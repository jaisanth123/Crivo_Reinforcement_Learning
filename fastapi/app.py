from fastapi import FastAPI, HTTPException, UploadFile, File, BackgroundTasks, Form
from pydantic import BaseModel
import json
import os
from fastapi.middleware.cors import CORSMiddleware
import cv2
import requests
import shutil
import uuid
from pdf2image import convert_from_path
from dotenv import load_dotenv
from typing import Optional

# Load environment variables
load_dotenv()

# Create a SINGLE FastAPI app instance
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Consider restricting this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories for storing temporary files
TEMP_DIR = "./temp"
os.makedirs(TEMP_DIR, exist_ok=True)

# Fetch API keys from environment variables
IMGUR_CLIENT_ID = os.getenv("IMGUR_CLIENT_ID", "your-imgur-client-id")
GOOGLE_VISION_API_KEY = os.getenv("GOOGLE_VISION_API_KEY", "your-google-api-key")

class InputData(BaseModel):
    name: str
    email: str
    School_name: str
    City_name: str
    Class: str
    Driven_by: list
    Activity: dict
    By_Child: list
    By_Parents: list

@app.get("/check-email/{email}")
async def check_email(email: str):
    try:
        # Load existing data from the JSON file
        if os.path.exists("data.json"):
            with open("data.json", "r") as json_file:
                try:
                    data = json.load(json_file)
                    if not isinstance(data, list):
                        data = []  # Ensure data is a list
                except json.JSONDecodeError:
                    data = []  # Handle empty/corrupt file
        else:
            data = []

        # Search for the email in the list of records
        for entry in data:
            if entry.get("email") == email:
                return {
                    "name": entry.get("name"),
                    "School_name": entry.get("School_name"),
                    "City_name": entry.get("City_name"),
                    "Class": entry.get("Class"),
                    "email": entry.get("email")
                }

        # If email is not found
        return {"message": "Email unavailable"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/submit")
async def submit_data(data: InputData):
    try:
        # Convert the data to a dictionary
        data_dict = data.dict()

        # Check if the file exists
        if os.path.exists("data.json"):
            # Load existing data
            with open("data.json", "r") as json_file:
                try:
                    existing_data = json.load(json_file)
                    # Ensure existing data is a list
                    if not isinstance(existing_data, list):
                        existing_data = []
                except json.JSONDecodeError:
                    existing_data = []  # If file is empty or corrupted, start fresh
        else:
            existing_data = []

        # Append the new data
        existing_data.append(data_dict)

        # Save back to JSON file
        with open("data.json", "w") as json_file:
            json.dump(existing_data, json_file, indent=4)

        return {"message": "Data appended successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def pdf_to_png(pdf_path, output_folder, dpi=300):
    """Converts PDF to PNG images"""
    images = convert_from_path(pdf_path, dpi=dpi)
    os.makedirs(output_folder, exist_ok=True)
    image_paths = []

    for i, image in enumerate(images):
        image_path = os.path.join(output_folder, f"image_{i+1}.png")
        image.save(image_path, "PNG")
        image_paths.append(image_path)
        print(f"Saved: {image_path}")

    return image_paths

def split_image(image_path, output_dir, segments):
    """Splits an image based on predefined segment coordinates"""
    image = cv2.imread(image_path)
    
    if image is None:
        print(f"Error: Unable to read image at {image_path}.")
        return []

    height, width, _ = image.shape
    os.makedirs(output_dir, exist_ok=True)

    segment_paths = []
    for name, (x_ratio, y_ratio, w_ratio, h_ratio) in segments.items():
        x = int(x_ratio * width)
        y = int(y_ratio * height)
        w = min(int(w_ratio * width), width - x)
        h = min(int(h_ratio * height), height - y)

        segment = image[y:y+h, x:x+w]

        if segment.size == 0:
            print(f"Warning: Skipped segment '{name}' due to invalid cropping dimensions.")
            continue

        output_path = os.path.join(output_dir, f"{name}.png")
        cv2.imwrite(output_path, segment)
        segment_paths.append(output_path)
        print(f"Saved: {output_path}")

    return segment_paths

def upload_to_imgur(image_path):
    """Uploads an image to Imgur and returns the URL"""
    headers = {"Authorization": f"Client-ID {IMGUR_CLIENT_ID}"}

    if not os.path.exists(image_path):
        print(f"Error: File not found at {image_path}")
        return None

    with open(image_path, "rb") as file:
        response = requests.post(
            "https://api.imgur.com/3/upload",
            headers=headers,
            files={"image": file},
            verify=False,
            data={"type": "file"}
        )

    if response.status_code == 200:
        img_url = response.json()["data"]["link"]
        print("Image Uploaded Successfully:", img_url)
        return img_url
    else:
        try:
            error_msg = response.json()
        except requests.exceptions.JSONDecodeError:
            error_msg = response.text
        print("Upload Error:", error_msg)
        return None

def extract_text_from_image(image_url):
    """Extracts text from an image using Google Vision API"""
    url = f"https://vision.googleapis.com/v1/images:annotate?key={GOOGLE_VISION_API_KEY}"
    payload = {
        "requests": [
            {
                "image": {"source": {"imageUri": image_url}},
                "features": [{"type": "TEXT_DETECTION"}]
            }
        ]
    }

    response = requests.post(url, json=payload)
    result = response.json()

    if "responses" in result and "textAnnotations" in result["responses"][0]:
        return result["responses"][0]["textAnnotations"][0]["description"]
    
    print("No text detected.")
    return ""

def background_task(pdf_path):
    """Handles the full pipeline: PDF -> PNG -> Crop -> OCR -> Data Parsing"""
    output_folder = TEMP_DIR
    output_dir = TEMP_DIR

    # Define cropping areas (adjust ratios if needed)
    segments = {
        "section": (0.352, 0.325, 0.7, 0.5)
    }

    # Convert PDF to PNG
    image_paths = pdf_to_png(pdf_path, output_folder)
    if not image_paths:
        return {"error": "PDF conversion failed"}

    # Split images
    segment_paths = split_image(image_paths[0], output_dir, segments)
    if not segment_paths:
        return {"error": "Image segmentation failed"}

    # Upload to Imgur & extract text
    detected_text = ""
    for seg_path in segment_paths:
        png_url = upload_to_imgur(seg_path)
        if png_url:
            detected_text = extract_text_from_image(png_url)

    # Clean up temporary files
    os.remove(pdf_path)
    for file in image_paths + segment_paths:
        os.remove(file)

    # Dummy structured data (modify based on actual data logic)
    data = {
        "Driven_by": [1] * 10,
        "Activity": {chr(65+i): [1] * 10 for i in range(12)},  # A-L activities
        "By_Child": [1, 1, 1, 1],
        "By_Parents": [1, 1]
    }
    c = 0
    
    # Parse extracted text
    if detected_text:
        for line in detected_text.split("\n"):
            if len(line) == 2:
                char, num = line[0], line[1]
                if num == 'O':
                    if char in data:
                        data[char][0] = 0
                        c += 1
                    if char in data["Activity"]:
                        data["Activity"][char][0] = 0
                        c += 1
                elif num.isdigit():
                    index = int(num)
                    if char in data and index < len(data[char]):
                        data[char][index] = 0
                        c += 1
                    if char in data["Activity"] and index < len(data["Activity"][char]):
                        data["Activity"][char][index] = 0
                        c += 1

    # Format the response to match what the frontend expects
    if c > 5:
        return {"model_output": data}
    else:
        return {"error": "File uploaded was invalid"}

@app.post("/upload/")
async def upload_pdf(
    img: UploadFile = File(...),
    name: Optional[str] = Form(None),
    className: Optional[str] = Form(None),
    school: Optional[str] = Form(None),
    city: Optional[str] = Form(None),
    email: Optional[str] = Form(None)
):
    """Handles PDF file uploads and processes them"""
    file_ext = img.filename.split('.')[-1].lower()
    if file_ext != "pdf":
        return {"error": "Only PDF files are allowed"}

    temp_filename = f"temp_{uuid.uuid4()}.pdf"
    temp_filepath = os.path.join(TEMP_DIR, temp_filename)

    with open(temp_filepath, "wb") as buffer:
        shutil.copyfileobj(img.file, buffer)

    # Process the file
    result = background_task(temp_filepath)
    
    # Add form data to the response
    if "model_output" in result:
        result["name"] = name
        result["School_code"] = school
        result["City_code"] = city
        result["Class"] = className
    
    return result