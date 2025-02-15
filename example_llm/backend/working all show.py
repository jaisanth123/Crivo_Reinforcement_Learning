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

app = FastAPI()
model = "mistral"

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
    elif isinstance(obj, dict):
        return {key: objectid_to_str(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [objectid_to_str(item) for item in obj]
    else:
        return obj
    
def detect_operation(user_input):
    prompt = f"""
    Analyze the user request and determine the appropriate API endpoint and operation to perform.
    Available endpoints:
    {ENDPOINTS}

    Respond ONLY in this exact JSON format:
    {{
        "method": "GET",
        "endpoint": "/sellers",
        "parameters": {{}}
    }}

    User Input: {user_input}
    """
    try:
        # Call the chat API to analyze the user input
        response = chat(
            model=model,
            messages=[{'role': 'user', 'content': prompt}]
        )
        json_response = response['message']['content'].strip()
        logging.debug(f"Raw LLM response: {json_response}")

        # Parse the JSON response from the model and log
        if 'json' in json_response:
            json_response = json_response.split('json')[1].split('```')[0].strip()

        operation = json.loads(json_response)
        logging.info(f"Parsed operation: {operation}")

        # Ensure no unexpected parameters like 'type' are in the parsed request
        allowed_parameters = ["productId", "rating", "date", "page", "limit"]
        operation['parameters'] = {key: value for key, value in operation.get('parameters', {}).items() if key in allowed_parameters}

        return operation

    except Exception as e:
        logging.error(f"Error in detect_operation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Operation detection failed: {str(e)}")

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

    try:
        operation = detect_operation(user_input)
        if operation['method'] == 'GET':
            result = await handle_get(operation['endpoint'], operation.get('parameters', {}))
        elif operation['method'] == 'POST':
            result = await handle_post(operation['endpoint'], operation.get('data', {}))
        else:
            raise HTTPException(status_code=400, detail="Unsupported method")

        return result

    except HTTPException as http_exception:
        logging.error(f"HTTP Exception: {http_exception.detail}")
        raise http_exception
    except Exception as e:
        logging.error(f"Unexpected Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

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
