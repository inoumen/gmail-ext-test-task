// Global variable to track extension state
let isExtensionEnabled = false

// Function to create and manage overlay
function createVoiceOverlay() {
  // Check if overlay already exists
  if (document.getElementById('voice-email-overlay')) return

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
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    max-width: 400px;
  `

  // Add text to content
  content.innerHTML = `
    <h2>Voice Email Composer</h2>
    <p>Listening for voice input...</p>
    <button id="stop-voice-btn">Stop Listening</button>
  `

  // Add stop button functionality
  const stopButton = content.querySelector('#stop-voice-btn')
  stopButton.addEventListener('click', removeVoiceOverlay)

  // Append content to overlay
  overlay.appendChild(content)
  
  // Add overlay to body
  document.body.appendChild(overlay)
}

// Function to remove overlay
function removeVoiceOverlay() {
  const overlay = document.getElementById('voice-email-overlay')
  if (overlay) {
    overlay.remove()
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

// Listen for messages from the popup
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