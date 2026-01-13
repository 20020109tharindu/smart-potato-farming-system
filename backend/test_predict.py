import requests
import sys

URL = "http://127.0.0.1:5000/predict"
# Update this path to a valid image on your machine
IMAGE_PATH = r"C:\Users\Admin\Desktop\potato seeds\single potato seed\IMG_20251205_142805.jpg"

if len(sys.argv) > 1:
    IMAGE_PATH = sys.argv[1]

print(f"Posting image: {IMAGE_PATH} to {URL}")
try:
    with open(IMAGE_PATH, "rb") as f:
        r = requests.post(URL, files={"image": f}, timeout=30)
    print("Status:", r.status_code)
    try:
        print("JSON response:", r.json())
    except Exception:
        print("Text response:", r.text)
except requests.exceptions.RequestException as e:
    print("Request failed:", e)
except FileNotFoundError:
    print("Image file not found:", IMAGE_PATH)
