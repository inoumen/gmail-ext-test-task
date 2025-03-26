import React, { useState, useEffect } from 'react'
import { 
  Box, 
  Typography, 
  Switch, 
  FormControlLabel, 
  Container, 
  Paper 
} from '@mui/material'

// Utility function to safely interact with Chrome storage
const chromeStorageGet = (key, defaultValue) => {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.get([key], (result) => {
        resolve(result[key] ?? defaultValue)
      })
    } else {
      // Fallback for development
      const storedValue = localStorage.getItem(key)
      resolve(storedValue ? JSON.parse(storedValue) : defaultValue)
    }
  })
}

const chromeStorageSet = (key, value) => {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.sync.set({ [key]: value }, resolve)
    } else {
      // Fallback for development
      localStorage.setItem(key, JSON.stringify(value))
      resolve()
    }
  })
}

export default function ExtensionPopup() {
  const [isEnabled, setIsEnabled] = useState(false)

  // Load the saved state when the component mounts
  useEffect(() => {
    const loadState = async () => {
      const savedState = await chromeStorageGet('voiceEmailExtensionEnabled', false)
      setIsEnabled(savedState)
    }
    loadState()
  }, [])

  // Update storage when the toggle is switched
  const handleToggleChange = async () => {
    const newState = !isEnabled
    setIsEnabled(newState)
    
    // Save the state to storage
    await chromeStorageSet('voiceEmailExtensionEnabled', newState)

    // Try to send message to content script if Chrome APIs are available
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      try {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0] && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, { 
              action: 'toggleExtension', 
              enabled: newState 
            })
          }
        })
      } catch (error) {
        console.warn('Could not send message to content script', error)
      }
    }
  }

  return (
    <Container maxWidth="xs" sx={{ p: 2, minWidth: "400px" }}>
      <Paper elevation={3} sx={{ 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        <Typography 
          variant="h6" 
          component="h1" 
          gutterBottom 
          sx={{ fontWeight: 'bold' }}
        >
          Voice Email Composer
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          width: '100%',
          mb: 2 
        }}>
          <Typography variant="body1">
            Enable Overlay
          </Typography>
          
          <FormControlLabel
            control={
              <Switch
                checked={isEnabled}
                onChange={handleToggleChange}
                color="primary"
              />
            }
            label=""
          />
        </Box>

        <Typography 
          variant="caption" 
          color="textSecondary" 
          align="center"
        >
          {isEnabled 
            ? 'Voice overlay is active in Gmail' 
            : 'Voice overlay is disabled'}
        </Typography>
      </Paper>
    </Container>
  )
}