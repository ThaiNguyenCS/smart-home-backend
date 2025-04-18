import json
import io
import os 
import speech_recognition as sr
import sys
from dotenv import load_dotenv

load_dotenv()

timeout = int(os.getenv("VOICE_RECOGNITION_TIMEOUT", default=5))

def recognize_speech_from_file(audio_path):
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_path) as source:
        try:
            audio = recognizer.record(source)
            text = recognizer.recognize_google(
                audio, language="en-US")  # Set timeout to 10 seconds
            text = text.lower()
            sys.stderr.write("text " + text)
            sys.stderr.flush()

            words = set(text.lower().split())

            device = None
            action = None
            if any(word in words for word in ["light", "lights"]):
                device = "light"
            elif any(word in words for word in ["fan", "fans"]):
                device = "fan"
            if any(word in words for word in ["on", "off"]):
                action = "on" if "on" in words else "off"
            return {"device": device, "action": action}
        except sr.UnknownValueError:
            return "Cannot recognize voice"
        except sr.RequestError:
            return "Cannot connect to recognition service"
        except sr.WaitTimeoutError:
            return "Recognition timed out"


if __name__ == "__main__":
    audio_buffer = sys.stdin.buffer.read()
    audio_file = io.BytesIO(audio_buffer)
    result = recognize_speech_from_file(audio_file)
    print(json.dumps(result))
