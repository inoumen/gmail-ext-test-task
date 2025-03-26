import React, { useState, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { 
  Button, 
  Paper, 
  TextField, 
  Typography, 
  IconButton, 
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import nlp from 'compromise'
import { pipeline } from '@xenova/transformers'

const App = () => {
  const [text, setText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [properNouns, setProperNouns] = useState([])
  const [error, setError] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const whisperPipelineRef = useRef(null)

  // Load Whisper model
  useEffect(() => {
    const loadWhisperModel = async () => {
      try {
        whisperPipelineRef.current = await pipeline(
          'automatic-speech-recognition', 
          'Xenova/whisper-tiny.en'
        )
      } catch (err) {
        console.error('Failed to load Whisper model:', err)
        setError('Could not load speech recognition model')
      }
    }
    loadWhisperModel()
  }, [])

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        
        try {
          // Set processing state
          setIsProcessing(true)
          setProperNouns([])
          setError(null)

          // Convert blob to base64
          const reader = new FileReader()
          reader.readAsDataURL(audioBlob)
          reader.onloadend = async () => {
            try {
              if (!whisperPipelineRef.current) {
                throw new Error('Whisper model not loaded')
              }

              // Transcribe audio with automatic chunking
              const result = await whisperPipelineRef.current(reader.result, {
                chunk_length_s: 30,
                stride_length_s: 5,
                return_timestamps: true,
              })
              
              // Combine text from all chunks
              const transcribedText = result.text || ''
              
              // Update text and parse proper nouns
              setText(transcribedText)
              parseProperNouns(transcribedText)
            } catch (transcribeErr) {
              console.error('Transcription error:', transcribeErr)
              setError('Failed to transcribe audio')
            } finally {
              // Reset processing state
              setIsProcessing(false)
            }
          }
        } catch (err) {
          console.error('Audio processing error:', err)
          setError('Audio processing failed')
          setIsProcessing(false)
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
      setError(null)
    } catch (err) {
      console.error('Recording start error:', err)
      setError('Could not start recording')
    }
  }

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  // Parse proper nouns
  const parseProperNouns = (inputText) => {
    const doc = nlp(inputText)
    const extractedProperNouns = doc.people().out('array')
      .concat(doc.places().out('array'))
      .concat(doc.organizations().out('array'))
      .filter((noun, index, self) => 
        noun && noun.trim() !== '' && self.indexOf(noun) === index
      )

    setProperNouns(extractedProperNouns)
  }

  // Manual text change handler
  const handleManualChange = (e) => {
    const newText = e.target.value
    setText(newText)
    parseProperNouns(newText)
  }

  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied to clipboard')
    }).catch(err => {
      console.error('Copy to clipboard failed:', err)
    })
  }

  // Close overlay
  const closeOverlay = () => {
    const el = document.getElementById('voice-email-react-root')
    if (el) el.remove()
    stopRecording()
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

      {error && (
        <Typography color="error" style={{ marginBottom: '10px' }}>
          {error}
        </Typography>
      )}

      <div style={{ display: 'flex', gap: '10px', margin: '15px 0' }}>
        {!isRecording ? (
          <Button 
            variant="contained" 
            color="success" 
            onClick={startRecording}
            loading={isProcessing}
          >
            Start Recording
          </Button>
        ) : (
          <Button 
            variant="contained" 
            color="error" 
            onClick={stopRecording}
          >
            Stop Recording
          </Button>
        )}
      </div>

      <TextField
        multiline
        fullWidth
        minRows={5}
        value={text}
        onChange={handleManualChange}
        placeholder="Speak something..."
      />

      <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="outlined" 
          onClick={copyToClipboard}
          disabled={isProcessing}
        >
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