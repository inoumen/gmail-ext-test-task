# Voice Email Composer Chrome Extension

## Overview
Voice Email Composer is a Chrome extension that allows users to compose emails using voice input directly within Gmail, streamlining the email writing process.

## Prerequisites
- Node.js (version 16 or later)
- npm (Node Package Manager)
- Google Chrome Browser

## Project Setup

### 1. Clone the Repository
```bash
git clone https://github.com/inoumen/gmail-ext-test-task.git
cd gmail-ext-test-task
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Development Build
To run the project in development mode:
```bash
npm run dev
```

### 4. Production Build
To create a production build:
```bash
npm run build
```

## Loading the Extension in Chrome

1. Create a production build using `npm run build`
2. Open Google Chrome
3. Navigate to `chrome://extensions/`
4. Enable "Developer mode"
5. Click "Load unpacked"
6. Select the `dist` folder

## How to Use

1. Pin the extension to your browser's extensions panel
2. Click on the extension icon and enable the Overlay
3. Open Gmail in your browser
4. Click the "New email" button — you'll see a menu that lets you record your voice
5. Record your message, then click "Stop Recording" and wait a moment for the text to be processed
6. Voilà! You can now copy the transcribed text and use it in your email


## Troubleshooting
- Ensure microphone permissions are granted
- Check browser compatibility
- Verify Chrome extension is enabled

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Contact
ih.kubrak@gmail.com

Project Link: [https://github.com/inoumen/gmail-ext-test-task](https://github.com/inoumen/gmail-ext-test-task)
