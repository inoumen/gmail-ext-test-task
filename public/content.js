// Global variable to track extension state
let isExtensionEnabled = false

// Function to create and manage overlay
async function createVoiceOverlay() {
 
}

function injectReactOverlay() {
  // Avoid duplicates
  if (document.getElementById('voice-email-react-root')) return

  // Create container
  const container = document.createElement('div')
  container.id = 'voice-email-react-root'
  container.style.position = 'fixed'
  container.style.top = '0'
  container.style.left = '0'
  container.style.zIndex = '99999'
  document.body.appendChild(container)

  // Inject your React script bundle
  const script = document.createElement('script')
  script.src = chrome.runtime.getURL('reactOverlay.bundle.js') // ← this is the compiled React file
  script.type = 'module' // optional: depends on how you build it
  document.body.appendChild(script)
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

// Listen for messages to create new email
chrome.runtime.onMessage.addListener((message) => {
  if (message.event === 'createNewEmail') {
    console.log('Creating new email')
    chrome.storage.sync.get(['voiceEmailExtensionEnabled'], (result) => {
      if (result.voiceEmailExtensionEnabled) {
        injectReactOverlay()
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

    if (!isExtensionEnabled) {
      removeVoiceOverlay()
    }
  }
})