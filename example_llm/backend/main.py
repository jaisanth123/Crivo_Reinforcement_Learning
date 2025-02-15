from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import subprocess

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/get-mistral-response/")
async def get_mistral_response(request: Request):
    data = await request.json()
    user_input = data.get("input", "")
    try:
        # Use subprocess.Popen to send the input directly to Ollama
        process = subprocess.Popen(
            ["ollama", "run", "mistral"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        stdout, stderr = process.communicate(input=user_input)

        if process.returncode != 0:
            return {"response": f"Error querying the model: {stderr.strip()}"}

        return {"response": stdout.strip()}
    except Exception as e:
        return {"response": f"Unexpected error: {str(e)}"}








# from fastapi import FastAPI, Request
# from fastapi.middleware.cors import CORSMiddleware
# from pymongo import MongoClient
# import json
# from transformers import pipeline

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # MongoDB connection
# MONGO_URI = "mongodb+srv://llamamodel582:4gtooiHOABnJ1tSx@hacksphere.f56em.mongodb.net/farmers_db?retryWrites=true&w=majority"
# DATABASE_NAME = "farmers_db"
# client = MongoClient(MONGO_URI)
# db = client[DATABASE_NAME]
# products_collection = db["products"]

# # Load the Hugging Face Mistral model
# llm = pipeline("text-generation", model="mistralai/Mistral-7B-v0.1")  # Hugging Face model name

# # Define the prompt template for MongoDB query generation
# prompt = """
#     You are a very intelligent AI assistant who is an expert in identifying relevant questions from the user and converting them into MongoDB aggregation pipeline queries.
#     Your task is to generate a MongoDB aggregation query based on the following schema:

#     Schema: The database contains a collection of products where each document has the following fields:
#     - productId: Unique identifier for the product.
#     - item: Name of the product.
#     - pricePerKilo: Price per kilogram of the product.
#     - category: Category the product belongs to.
#     - quantity: Quantity of the product available in stock.

#     Your task is to convert the user input question into a valid MongoDB aggregation pipeline query. Only return the query, nothing else.
    
#     Example questions:
#     1. "How much is the price per kilogram for product X?"
#     2. "Give me the details of product Y."
#     3. "What is the quantity of product Z?"
# """

# @app.post("/get-product-info/")
# async def get_product_info(request: Request):
#     data = await request.json()
#     question = data.get("input", "").strip()

#     try:
#         if question:
#             # Generate MongoDB query from user input using Mistral
#             response = llm(prompt + question)  # Hugging Face model response
#             generated_text = response[0]['generated_text'].strip()

#             try:
#                 # Try to parse the model output as a JSON query
#                 query = json.loads(generated_text)
#             except json.JSONDecodeError:
#                 return {"response": "Error: Unable to parse generated query from the model."}

#             # Execute the generated query on the MongoDB collection
#             results = products_collection.aggregate(query)

#             response_data = []
#             for result in results:
#                 response_data.append({
#                     "productId": result.get("productId"),
#                     "item": result.get("item"),
#                     "pricePerKilo": result.get("pricePerKilo"),
#                     "category": result.get("category"),
#                     "quantity": result.get("quantity")
#                 })

#             if response_data:
#                 return {"response": response_data}
#             else:
#                 return {"response": "No matching products found."}
#         else:
#             return {"response": "No question provided."}
#     except Exception as e:
#         return {"response": f"Error processing the request: {str(e)}"}
