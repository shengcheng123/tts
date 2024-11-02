# Edge TTS Web Interface

A web interface for Microsoft Edge's Text-to-Speech service using FastAPI and TypeScript.

## Features

- Convert text to speech using Microsoft Edge's TTS voices
- Filter voices by language
- Play/Stop audio control
- Save settings locally
- Loading state indicators
- Responsive design

## Prerequisites

- Python 3.7+
- Node.js and npm
- pip (Python package manager)

## Installation

1. Create a new directory for your project:
```bash
mkdir edge-tts-web
cd edge-tts-web
```

2. Create the following directory structure:
```bash
mkdir -p static/{css,ts,js}
```

3. Install Python dependencies:
```bash
pip install fastapi uvicorn edge-tts
```

4. Install Node.js dependencies:
```bash
npm init -y
npm install --save-dev esbuild
```

5. Copy all the provided files into their respective directories:
   - `app.py` → root directory
   - `build.js` → root directory
   - `watch.js` → root directory
   - `tsconfig.json` → root directory
   - `index.html` → static directory
   - TypeScript files (*.ts) → static/ts directory
   - `styles.css` → static/css directory

## Running the Application

1. First, compile the TypeScript files:
```bash
# One-time build
node build.js

# Or for development with auto-recompile
node watch.js
```

2. In a separate terminal, start the FastAPI server:
```bash
uvicorn app:app --reload
```

3. Open your browser and visit:
```
http://localhost:8000
```

## Development

### File Structure
```
project/
├── app.py              # FastAPI backend server
├── build.js            # esbuild production build
├── watch.js            # esbuild development watch
├── tsconfig.json       # TypeScript configuration
└── static/
    ├── css/
    │   └── styles.css  # Application styles
    ├── ts/             # TypeScript source files
    │   ├── types.ts    # Type definitions
    │   ├── storage.ts  # Local storage management
    │   ├── voiceManager.ts  # Voice handling
    │   ├── audioManager.ts  # Audio playback
    │   └── main.ts     # Main application logic
    ├── js/             # Compiled JavaScript (generated)
    └── index.html      # Main HTML page
```

### Making Changes

1. TypeScript files are in `static/ts/`
2. CSS styles are in `static/css/styles.css`
3. Backend API is in `app.py`

When making changes:
- TypeScript changes will auto-compile if using `watch.js`
- FastAPI will auto-reload if using `uvicorn` with `--reload`
- Browser refresh required to see changes

## API Endpoints

### GET /
- Serves the main web interface

### GET /voices
- Returns list of available TTS voices
- Response: Array of voice objects
```json
[
  {
    "Locale": "en-US",
    "ShortName": "en-US-JennyNeural",
    "FriendlyName": "Jenny"
  }
]
```

### POST /tts
- Converts text to speech
- Query Parameters:
  - `text`: String to convert (required)
  - `voice`: Voice ID (optional, defaults to "en-US-JennyNeural")
- Returns: Audio file (MP3)

## Troubleshooting

### Common Issues

1. **No voices in dropdown**
   - Check browser console for network errors
   - Verify FastAPI server is running
   - Ensure `/voices` endpoint returns data

2. **Audio not playing**
   - Verify text is entered in the input field
   - Check if selected voice is valid
   - Look for errors in browser console

3. **TypeScript compilation errors**
   - Ensure all dependencies are installed
   - Check `tsconfig.json` settings
   - Run `tsc` directly for detailed error messages

4. **Server won't start**
   - Verify Python dependencies are installed
   - Check if port 8000 is available
   - Look for errors in terminal output

### Browser Support

The application requires a modern browser with support for:
- ES2020 features
- Web Audio API
- Fetch API

Tested and working on:
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

## License

MIT License

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request