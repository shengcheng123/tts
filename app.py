from fastapi import FastAPI, Response
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import edge_tts
import tempfile
import os

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files - make sure the js directory exists
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def read_root():
    return FileResponse("static/index.html")

@app.post("/tts")
async def text_to_speech(text: str, voice: str = "en-US-JennyNeural"):
    try:
        # Create a temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
        temp_file.close()

        # Initialize edge-tts
        communicate = edge_tts.Communicate(text, voice)
        
        # Generate audio
        await communicate.save(temp_file.name)

        # Read the audio file
        with open(temp_file.name, "rb") as audio_file:
            audio_data = audio_file.read()

        # Clean up the temporary file
        os.unlink(temp_file.name)

        return Response(content=audio_data, media_type="audio/mpeg")
    except Exception as e:
        return {"error": str(e)}

@app.get("/voices")
async def get_voices():
    voices = await edge_tts.list_voices()
    return voices
