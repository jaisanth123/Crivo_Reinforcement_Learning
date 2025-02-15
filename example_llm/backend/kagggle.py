from fastapi import FastAPI, Request, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pymongo.errors import PyMongoError
import logging
from ollama import chat
import re
from typing import Optional
import json
from bson import ObjectId
from datetime import datetime
import requests
app = FastAPI()
model = "mistral"
import httpx
# Configure logging
logging.basicConfig(
    filename='server.log',
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# MongoDB connection
client = MongoClient(
    "mongodb+srv://llamamodel582:4gtooiHOABnJ1tSx@hacksphere.f56em.mongodb.net/farmers_db?retryWrites=true&w=majority",
    serverSelectionTimeoutMS=5000
)

try:
    client.admin.command('ping')
    logging.info("Successfully connected to MongoDB")
except Exception as e:
    logging.error(f"Failed to connect to MongoDB: {str(e)}")
    raise Exception("Database connection failed")

db = client["farmers_db"]

# At the top of your file, after the imports
KAGGLE_ENDPOINT = "https://2221-34-75-255-77.ngrok-free.app/chat"  # Your Kaggle ngrok URL
MODEL_NAME = "mistral"# Update this when you start your Kaggle notebook

# Define available endpoints and their operations
ENDPOINTS = {
    "GET": {
        "/sellers": ["List sellers", "Get seller details"],
        "/products": ["List products", "Get product details"],
        "/customers": ["List customers", "Get customer details"],
        "/reviews": ["List reviews", "Get product reviews"],
        "/orders": ["List orders", "Get order details"],  # Ensure orders are included in endpoints
    },
    "POST": {
        "/sellers": ["Create new seller"],
        "/products": ["Create new product"],
        "/reviews": ["Create new review"],
    }
}
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Function to convert ObjectId to string
def objectid_to_str(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, datetime):
        return obj.isoformat()  # Convert datetime to ISO format string
    elif isinstance(obj, dict):
        return {key: objectid_to_str(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [objectid_to_str(item) for item in obj]
    else:
        return obj
    
# def detect_operation(user_input):
#     try:
#         prompt = f"""
#         Analyze the user request and determine the appropriate API endpoint and operation to perform.
#         Available endpoints: {ENDPOINTS}

#         Respond ONLY in this exact JSON format:
#         {{
#             "method": "GET",
#             "endpoint": "/sellers",
#             "parameters": {{}}
#         }}

#         User Input: {user_input}
#         """
#         response = chat_with_model(prompt)
#         operation = json.loads(response)
#         return operation
#     except Exception as e:
#         logging.error(f"Error in detect_operation: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Operation detection failed: {str(e)}")

# async def detect_operation(user_input):
#     try:
#         async with httpx.AsyncClient() as client:
#             response = await client.post(
#                 "https://c296-34-127-60-122.ngrok-free.app/generate-response/",
#                 json={"user_input": user_input}
#             )
#         response.raise_for_status()
#         operation = response.json()
#         return operation
#     except httpx.HTTPError as e:
#         logging.error(f"Error in detect_operation: {str(e)}")
#         raise HTTPException(status_code=500, detail="Failed to detect operation")
    
    
    
    
async def detect_operation(user_input):
    prompt = f"""
    Analyze this user request and respond with a JSON object for the API operation.
    User request: "{user_input}"
    
    Available endpoints: {ENDPOINTS}

    Return ONLY a JSON object in this format:
    {{
        "method": "GET",
        "endpoint": "/products",
        "parameters": {{"category": "fruits"}}
    }}

    For example, if someone asks about apples, return:
    {{
        "method": "GET",
        "endpoint": "/products",
        "parameters": {{"category": "fruits"}}
    }}
    """
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                KAGGLE_ENDPOINT,
                json={"message": prompt},
                timeout=30.0
            )
            response.raise_for_status()
            
            result = response.json()
            generated_text = result.get("response", "")
            
            # Log the raw response for debugging
            logging.debug(f"Raw LLM response: {generated_text}")
            
            # Extract JSON from the response
            json_match = re.search(r'\{.*\}', generated_text, re.DOTALL)
            if not json_match:
                raise ValueError("No JSON object found in response")
                
            json_str = json_match.group()
            operation = json.loads(json_str)
            
            # Validate the operation format
            required_keys = ["method", "endpoint", "parameters"]
            if not all(key in operation for key in required_keys):
                raise ValueError("Invalid operation format")
                
            logging.info(f"Parsed operation: {operation}")
            return operation
            
    except (httpx.HTTPError, json.JSONDecodeError, ValueError) as e:
        logging.error(f"Error in detect_operation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to detect operation: {str(e)}")



# GET endpoint for orders
@app.get("/orders")
async def get_orders(status: Optional[str] = None, page: int = 1, limit: int = 10):
    try:
        query = {}
        if status:
            query["status"] = status  # Example: "pending", "completed", "cancelled"

        skip = (page - 1) * limit
        orders = list(db.orders.find(query).skip(skip).limit(limit))
        total_orders = db.orders.count_documents(query)

        # Convert ObjectId to string before returning
        orders = objectid_to_str(orders)

        return {
            "total_orders": total_orders,
            "orders": orders,
            "page": page,
            "limit": limit
        }

    except PyMongoError as e:
        logging.error(f"Error retrieving orders: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving orders: {str(e)}")

# GET endpoint for products
@app.get("/products")
async def get_products(category: Optional[str] = None, page: int = 1, limit: int = 10):
    try:
        query = {}
        if category:
            query["category"] = category

        skip = (page - 1) * limit
        products = list(db.products.find(query).skip(skip).limit(limit))
        total_products = db.products.count_documents(query)

        products = objectid_to_str(products)

        logging.info(f"Fetched {len(products)} products (page {page}, limit {limit})")
        return {
            "products": products,
            "total": total_products,
            "page": page,
            "limit": limit
        }
    except PyMongoError as e:
        logging.error(f"MongoDB error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/sellers")
async def get_sellers(status: Optional[str] = None, page: int = 1, limit: int = 10):
    try:
        query = {}
        if status:
            query["status"] = status

        skip = (page - 1) * limit
        sellers = list(db.sellers.find(query).skip(skip).limit(limit))
        total_sellers = db.sellers.count_documents(query)

        sellers = objectid_to_str(sellers)

        logging.info(f"Fetched {len(sellers)} sellers (page {page}, limit {limit})")
        return {
            "sellers": sellers,
            "total": total_sellers,
            "page": page,
            "limit": limit
        }
    except PyMongoError as e:
        logging.error(f"MongoDB error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
def chat_with_model(user_input):
    
    kaggle_api_url =KAGGLE_ENDPOINT # Replace with your actual ngrok URL
    response = requests.post(kaggle_api_url, json={"message": user_input})
    if response.status_code == 200:
        return response.json().get("response")
    else:
        raise Exception(f"Model API error: {response.status_code}")
    
    
async def chat_with_llama_model(prompt):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://your-kaggle-ngrok-url.com/chat",  # Update with your LLaMA model URL
            json={"message": prompt}
        )
    if response.status_code == 200:
        return response.json().get("response")
    else:
        raise Exception(f"Model API error: {response.status_code}")


# GET endpoint for reviews
@app.get("/reviews")
async def get_reviews(productId: Optional[str] = None, rating: Optional[int] = None, date: Optional[str] = None, page: int = 1, limit: int = 10):
    try:
        # Safely prepare the query with the expected parameters
        query = {}
        
        # Filter by productId if provided
        if productId:
            query["productId"] = productId
        
        # Filter by rating if provided
        if rating:
            query["rating"] = rating

        # Filter by date if provided (assuming format is YYYY-MM-DD)
        if date:
            query["date"] = date
        
        # Skip and limit for pagination
        skip = (page - 1) * limit

        # Fetch reviews from the database
        reviews = list(db.reviews.find(query).skip(skip).limit(limit))
        total_reviews = db.reviews.count_documents(query)

        # Convert ObjectId to string before returning
        reviews = objectid_to_str(reviews)

        logging.info(f"Fetched {len(reviews)} reviews (page {page}, limit {limit})")
        return {
            "reviews": reviews,
            "total": total_reviews,
            "page": page,
            "limit": limit
        }
    except PyMongoError as e:
        logging.error(f"MongoDB error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.get("/customers")
async def get_customers(status: Optional[str] = None, page: int = 1, limit: int = 10):
    try:
        query = {}
        if status:
            query["status"] = status

        skip = (page - 1) * limit
        customers = list(db.customers.find(query).skip(skip).limit(limit))
        total_customers = db.customers.count_documents(query)

        customers = objectid_to_str(customers)

        logging.info(f"Fetched {len(customers)} customers (page {page}, limit {limit})")
        return {
            "customers": customers,
            "total": total_customers,
            "page": page,
            "limit": limit
        }
    except PyMongoError as e:
        logging.error(f"MongoDB error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
@app.post("/process-request")
async def process_request(request: Request):
    data = await request.json()
    user_input = data.get("input", "")
    
    logging.info(f"Received request with input: {user_input}")
    
    try:
        # Detect operation using Kaggle LLaMA model
        operation = await detect_operation(user_input)
        logging.info(f"Detected operation: {operation}")
        
        if operation['method'] == 'GET':
            # Fetch data based on the operation
            fetched_data = await handle_get(operation['endpoint'], operation.get('parameters', {}))
            
            # Generate prompt for the model
            prompt = f"""
            Based on this user query: {user_input}
            
            Here is the fetched data: {json.dumps(fetched_data, indent=2)}
            
            Please provide a natural response summarizing the requested information.
            """
            
            # Get final response from Kaggle model
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    KAGGLE_ENDPOINT,
                    json={"message": prompt},
                    timeout=30.0
                )
                response.raise_for_status()
                result = response.json()
                
            return {"response": result.get("response", "")}
            
        elif operation['method'] == 'POST':
            result = await handle_post(operation['endpoint'], operation.get('data', {}))
            return {"response": f"Successfully processed POST request: {result}"}
        else:
            raise HTTPException(status_code=400, detail="Unsupported method")
            
    except HTTPException as http_exception:
        logging.error(f"HTTP Exception: {http_exception.detail}")
        raise http_exception
    except Exception as e:
        logging.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))



def generate_llm_prompt(user_input: str, fetched_data: dict) -> str:
    prompt = f"""
    You are an assistant providing information based on user queries.

    User Query: {user_input}

    Fetched Data: {json.dumps(fetched_data, indent=2)}

    Based on the user's query, provide the requested details. If the user asks for a list of sellers, return the list of sellers only, without extra information.
    """
    return prompt


async def handle_get(endpoint: str, params: dict):
    if endpoint == "/sellers":
        return await get_sellers(**params)
    elif endpoint == "/products":
        return await get_products(**params)
    elif endpoint == "/customers":
        return await get_customers(**params)
    elif endpoint == "/reviews":
        return await get_reviews(**params)
    elif endpoint == "/orders":  # Add this new case for orders
        return await get_orders(**params)
    else:
        raise HTTPException(status_code=404, detail="Endpoint not found")

async def handle_post(endpoint: str, data: dict):
    if endpoint == "/products":
        return await create_product(data)
    elif endpoint == "/reviews":
        return await create_review(data)
    else:
        raise HTTPException(status_code=404, detail="Endpoint not found")


