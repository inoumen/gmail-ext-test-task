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

## Features
- Voice-to-text email composition
- Easy-to-use voice commands

## Troubleshooting
- Ensure microphone permissions are granted
- Check browser compatibility
- Verify Chrome extension is enabled

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Contact
ih.kubrak@gmail.com

Project Link: [https://github.com/inoumen/gmail-ext-test-task](https://github.com/inoumen/gmail-ext-test-task)
