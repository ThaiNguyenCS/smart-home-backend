# import speech_recognition as sr
# import sys
# import json


# def recognize_speech():
#     recognizer = sr.Recognizer()
#     with sr.Microphone() as source:
#         # print("Listening...")
#         try:
#             audio = recognizer.listen(source, timeout=5)
#             text = recognizer.recognize_google(
#                 audio, language="en-US")

#             text = text.lower()
#             sys.stderr.write("text " + text)
#             sys.stderr.flush()

#             commands = {
#                 "light on": "Turn on the fan",
#                 "light off": "Turn off the fan",
#             }
#             action = commands.get(text, "Invalid command")
#             return action
#         except sr.WaitTimeoutError:
#             return "Timeout"
#         except sr.UnknownValueError:
#             return "Cannot recognize voice"
#         except sr.RequestError:
#             return "Cannot connect to recognition service"


# if __name__ == "__main__":
#     result = recognize_speech()
#     print(json.dumps({"text": result}))


import speech_recognition as sr
import sys
import json


def recognize_speech_from_file(audio_path):
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_path) as source:
        try:
            audio = recognizer.record(source)
            text = recognizer.recognize_google(audio, language="en-US")
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


if __name__ == "__main__":
    result = recognize_speech_from_file("./test-audio/turn-light-on.wav")
    print(json.dumps(result))
