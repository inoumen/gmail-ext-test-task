import React, { useState, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { Button, Paper, TextField, Typography, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

const App = () => {
  const [finalText, setFinalText] = useState('')
  const [interimText, setInterimText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const recognitionRef = useRef(null)

  const initializeRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser.')
      return null
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      let interim = ''
      let newFinal = ''

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          newFinal += transcript
        } else {
          interim += transcript
        }
      }

      if (newFinal) {
        setFinalText(prev => prev + newFinal)
        setInterimText('')
      } else {
        setInterimText(interim)
      }
    }

    recognition.onerror = (e) => {
      console.error('Speech recognition error:', e.error)
      stopRecording()
    }

    return recognition
  }

  const startRecording = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = initializeRecognition()
    }

    try {
      recognitionRef.current.start()
      setIsRecording(true)
    } catch (err) {
      console.error('Recognition start failed:', err)
    }
  }

  const stopRecording = () => {
    try {
      recognitionRef.current?.stop()
    } catch (err) {
      console.error('Recognition stop failed:', err)
    }
    setIsRecording(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(finalText + interimText).then(() => {
      console.log('Copied to clipboard')
    })
  }

  const handleManualChange = (e) => {
    setFinalText(e.target.value)
  }

  const closeOverlay = () => {
    const el = document.getElementById('voice-email-react-root')
    if (el) el.remove()

    try {
      recognitionRef.current?.stop()
    } catch (err) {
      console.error('Recognition stop on close failed:', err)
    }
  }

  return (
    <Paper elevation={3} style={{
      position: 'fixed',
      top: '10%',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '20px',
      zIndex: 999999,
      width: '400px',
      boxSizing: 'border-box',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Voice Email Composer</Typography>
        <IconButton onClick={closeOverlay}>
          <CloseIcon />
        </IconButton>
      </div>

      <div style={{ display: 'flex', gap: '10px', margin: '15px 0' }}>
        {!isRecording ? (
          <Button variant="contained" color="success" onClick={startRecording}>
            Start Recording
          </Button>
        ) : (
          <Button variant="contained" color="error" onClick={stopRecording}>
            Stop Recording
          </Button>
        )}
      </div>

      <TextField
        multiline
        fullWidth
        minRows={5}
        value={finalText + interimText}
        onChange={handleManualChange}
        placeholder="Speak something..."
      />

      <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={copyToClipboard}>
          Copy
        </Button>
      </div>
    </Paper>
  )
}

const mountPoint = document.getElementById('voice-email-react-root') || (() => {
  const el = document.createElement('div')
  el.id = 'voice-email-react-root'
  document.body.appendChild(el)
  return el
})()

const root = createRoot(mountPoint)
root.render(<App />)
