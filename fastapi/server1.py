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
import random

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

# Define the action function that processes the PDF file
def action(pdf_path: str) -> str:
    p=pdf_path
    png_url = ""
    
    


    def pdf_to_png(pdf_path, output_folder, dpi=300):
        images = convert_from_path(pdf_path, dpi=dpi,poppler_path="/usr/bin")

        os.makedirs(output_folder, exist_ok=True)  
        image_paths = []

        for i, image in enumerate(images):
            p1 = str(random.randint(100000,999999))+".png"
            image_path = os.path.join(output_folder,p1)
            image.save(image_path, "PNG")
            image_paths.append(image_path)
            print(f"Saved!: {image_path}")

        return image_paths  

    def split_image(image_path, output_dir, segments):
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
            p2 = str(random.randint(100000,999999))+".png"
            output_path = os.path.join(output_dir,p2)
            cv2.imwrite(output_path, segment)
            segment_paths.append(output_path)
            print(f"Saved: {output_path}")
        os.remove(image_path)
        print("Removed png",image_path)
        return segment_paths  

    def upload_to_imgur(image_path, client_id="077b7b80d552daf"):
        headers = {"Authorization": f"Client-ID {client_id}"}

        if not os.path.exists(image_path):
            print(f"Error: File not found at {image_path}")
            return None

        with open(image_path, "rb") as file:
            response = requests.post(
                "https://api.imgur.com/3/upload",
                headers=headers,
                files={"image": file},
                data={"type": "file"}
            )

        if response.status_code == 200:
            img_url = response.json()["data"]["link"]
            print("Image Uploaded Successfully:", img_url)
            os.remove(image_path)
            print("Removed split png",image_path)
            return img_url
        else:
            try:
                error_msg = response.json()
            except requests.exceptions.JSONDecodeError:
                error_msg = response.text
            print("Upload Error:", error_msg)
            return None

    pdf_path = p
    output_folder = r".\\"
    image_path = r".\\"+str(random.randint(100000,999999))
    output_dir = r".\\"

    segments = {
        "section": (0.352, 0.325, 0.7, 0.5)  
    }

    # Execute Workflow
    image_paths = pdf_to_png(pdf_path, output_folder)  
    png_url = ""
    if image_paths:
        segment_paths = split_image(image_paths[0], output_dir, segments)  

        if segment_paths:
            for seg_path in segment_paths:
                png_url = upload_to_imgur(seg_path)  



    API_KEY = "AIzaSyAOZHGMoNu5ZhTGZbpP-vDUMEtl6fqoYqE"

    image_url = png_url

    url = f"https://vision.googleapis.com/v1/images:annotate?key={API_KEY}"

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
    detected_text = ""
    st1 = str(random.randint(100000,999999))+".json"
    with open(st1, "w") as json_file:
        json.dump(result, json_file, indent=4)

    if "responses" in result and "textAnnotations" in result["responses"][0]:
        detected_text = result["responses"][0]["textAnnotations"][0]["description"]
    else:
        print("No text detected.")
    os.remove(st1)
    print("output json deleted")

    data={
        "W": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        "Activity": {
            "A": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            "B": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            "C": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            "D": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            "E": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            "F": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            "G": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            "H": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            "I": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            "J": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            "K": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            "L": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        },
        "X": [1,1,1,1],
        "Y": [1,1]
    }


    d = detected_text
    d = d.split("\n")

    for i in d:
            if(len(i) == 2):
                pos1,pos2 = i[0],i[1]
                print(i)
                if(pos1 == "1"):
                    pos1 = "I"
                if(pos2 == "O"):
                    pos2 ="0"        
                if(pos2.isdigit()):
                    if(pos1 in data):
                        data[pos1][int(pos2)]=0
                    
                    if(pos1 in data["Activity"]):
                        data["Activity"][pos1][int(pos2)]=0
    if "Activity" in data:
        activity_dict = data["Activity"]
    
    if 0 in activity_dict:
        del activity_dict[0]
    print(data)
    updated_data = {}
    
    # Map old keys to new keys
    key_mapping = {
        'W': 'Driven_by',
        'X': 'By_Child',
        'Y': 'By_Parents'
    }
    
    # Copy data with updated keys
    for key, value in data.items():
        if key in key_mapping:
            updated_data[key_mapping[key]] = value
        else:
            updated_data[key] = value
    
    return updated_data
# Endpoint to upload the PDF file
@app.post("/upload/")
async def upload_pdf(file: UploadFile = File(...)):
    # Define the location where the PDF will be saved temporarily
    pdf_path = f"temp_{file.filename}"

    # Save the uploaded file to the specified path
    with open(pdf_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Call the action function with the PDF file path
    result = action(pdf_path)

    # Optionally, remove the file after processing
    os.remove(pdf_path)

    # Return the result from the action function
    return result


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