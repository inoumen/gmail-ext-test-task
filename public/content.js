// Global variable to track extension state
let isExtensionEnabled = false
let recognition = null

// Async function to handle speech recognition
async function initializeSpeechRecognition() {
  // Check if browser supports speech recognition
  const SpeechRecognition = 
    window.SpeechRecognition || 
    window.webkitSpeechRecognition || 
    window.mozSpeechRecognition || 
    window.msSpeechRecognition

  if (!SpeechRecognition) {
    throw new Error('Speech recognition not supported')
  }

  const rec = new SpeechRecognition()
  rec.continuous = true
  rec.interimResults = true
  rec.lang = 'en-US'

  return rec
}

// Function to create and manage overlay
async function createVoiceOverlay() {
  // Check if overlay already exists
  if (document.getElementById('voice-email-overlay')) return

  // Initialize speech recognition
  try {
    recognition = await initializeSpeechRecognition()
  } catch (error) {
    console.error('Speech recognition setup failed:', error)
    return
  }

  // Create overlay container
  const overlay = document.createElement('div')
  overlay.id = 'voice-email-overlay'
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  `

  // Create overlay content
  const content = document.createElement('div')
  content.style.cssText = `
    background: white;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    width: 500px;
    max-width: 90%;
    padding: 20px;
  `

  // Add detailed content
  content.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
      <h2 style="margin: 0; font-size: 1.2rem;">Voice Email Composer</h2>
      <button id="close-overlay-btn" style="
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
      ">×</button>
    </div>

    <div id="mic-controls" style="display: flex; justify-content: center; margin-bottom: 15px;">
      <button id="start-recording-btn" style="
        background-color: #4CAF50;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        margin-right: 10px;
      ">
        Start Recording
      </button>
      <button id="stop-recording-btn" style="
        background-color: #f44336;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        display: none;
      ">
        Stop Recording
      </button>
    </div>

    <div style="margin-bottom: 15px;">
      <textarea id="voice-text-output" style="
        width: 100%;
        min-height: 150px;
        resize: vertical;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
      " placeholder="Transcribed text will appear here..."></textarea>
    </div>

    <div style="display: flex; justify-content: space-between;">
      <button id="copy-text-btn" style="
        background-color: #2196F3;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
      ">
        Copy Text
      </button>
      <button id="insert-text-btn" style="
        background-color: #FF9800;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
      ">
        Insert into Email
      </button>
    </div>
  `

  // Add overlay to body
  overlay.appendChild(content)
  document.body.appendChild(overlay)

  // Get elements
  const closeBtn = document.getElementById('close-overlay-btn')
  const startRecordingBtn = document.getElementById('start-recording-btn')
  const stopRecordingBtn = document.getElementById('stop-recording-btn')
  const textOutput = document.getElementById('voice-text-output')
  const copyTextBtn = document.getElementById('copy-text-btn')
  const insertTextBtn = document.getElementById('insert-text-btn')

  // Close overlay
  closeBtn.addEventListener('click', removeVoiceOverlay)

  // Recording event handlers
  recognition.onresult = (event) => {
    let interimTranscript = ''
    let finalTranscript = ''

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript
      } else {
        interimTranscript += event.results[i][0].transcript
      }
    }

    textOutput.value = finalTranscript || interimTranscript
  }

  // Start recording
  startRecordingBtn.addEventListener('click', () => {
    try {
      recognition.start()
      startRecordingBtn.style.display = 'none'
      stopRecordingBtn.style.display = 'inline-block'
    } catch (error) {
      console.error('Error starting recognition:', error)
    }
  })

  // Stop recording
  stopRecordingBtn.addEventListener('click', () => {
    recognition.stop()
    startRecordingBtn.style.display = 'inline-block'
    stopRecordingBtn.style.display = 'none'
  })

  // Copy text functionality
  copyTextBtn.addEventListener('click', () => {
    textOutput.select()
    document.execCommand('copy')
  })

  // Insert text into email (placeholder - you'll need to implement Gmail-specific logic)
  insertTextBtn.addEventListener('click', () => {
    const text = textOutput.value
    // TODO: Implement logic to insert text into Gmail compose window
    console.log('Inserting text:', text)
  })
}

// Function to remove overlay
function removeVoiceOverlay() {
  const overlay = document.getElementById('voice-email-overlay')
  if (overlay) {
    overlay.remove()
  }

  // Stop recognition if it's active
  if (recognition) {
    try {
      recognition.stop()
    } catch (error) {
      console.error('Error stopping recognition:', error)
    }
  }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'toggleExtension') {
    isExtensionEnabled = message.enabled

    if (isExtensionEnabled) {
      console.log('Extension enabled')
    } else {
      removeVoiceOverlay()
    }
  }
})

// Listen for messages to create new email
chrome.runtime.onMessage.addListener((message) => {
  if (message.event === 'createNewEmail') {
    console.log('Creating new email')
    chrome.storage.sync.get(['voiceEmailExtensionEnabled'], (result) => {
      if (result.voiceEmailExtensionEnabled) {
        createVoiceOverlay()
      }
    })
  } else {
    removeVoiceOverlay()
  }
})

// Check initial state when script loads
chrome.storage.sync.get(['voiceEmailExtensionEnabled'], (result) => {
  isExtensionEnabled = result.voiceEmailExtensionEnabled || false
  
  if (isExtensionEnabled) {
    console.log('Initial script load: Extension enabled')
  } else {
    console.log('Initial script load: Extension disabled')
  }
})

// Detect if we're on Gmail
function isGmailPage() {
  return window.location.href.includes('mail.google.com')
}

// Optional: Add a keyboard shortcut to toggle overlay
document.addEventListener('keydown', (event) => {
  // Ctrl + Shift + V to toggle overlay
  if (event.ctrlKey && event.shiftKey && event.key === 'V') {
    isExtensionEnabled = !isExtensionEnabled
    
    // Save to storage
    chrome.storage.sync.set({ 
      voiceEmailExtensionEnabled: isExtensionEnabled 
    })

    if (isExtensionEnabled) {
      createVoiceOverlay()
    } else {
      removeVoiceOverlay()
    }
  }
})