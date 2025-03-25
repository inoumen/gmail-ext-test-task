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
git clone https://github.com/yourusername/voice-email-composer.git
cd voice-email-composer
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

### Method 1: Development Mode
1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top right)
4. Click "Load unpacked"
5. Select the `dist` folder from your project directory

### Method 2: Production Build
1. Create a production build using `npm run build`
2. Open Google Chrome
3. Navigate to `chrome://extensions/`
4. Enable "Developer mode"
5. Click "Load unpacked"
6. Select the `dist` folder

## Features
- Voice-to-text email composition
- Direct integration with Gmail
- Easy-to-use voice commands

## Troubleshooting
- Ensure microphone permissions are granted
- Check browser compatibility
- Verify Chrome extension is enabled

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Contact
ih.kubrak@gmail.com

Project Link: [https://github.com/inoumen/gmail-ext-test-task](https://github.com/inoumen/gmail-ext-test-task)