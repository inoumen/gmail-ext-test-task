import React, { useState, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { Button, Paper, TextField, Typography } from '@mui/material'

const App = () => {
  const [text, setText] = useState('')
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
      let final = ''

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript
        } else {
          interim += event.results[i][0].transcript
        }
      }

      setText(final || interim)
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
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard')
    })
  }

  return (
    <Paper elevation={3} style={{
      position: 'fixed',
      top: '10%',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '20px',
      zIndex: 999999,
      width: '400px'
    }}>
      <Typography variant="h6" gutterBottom>
        Voice Email Composer
      </Typography>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
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
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Speak something..."
      />

      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={copyToClipboard}>
          Copy
        </Button>
        <Button variant="outlined" onClick={() => console.log('Insert into email')}>
          Insert
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
