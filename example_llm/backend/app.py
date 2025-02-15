from fastapi import FastAPI, Request, HTTPException, Query, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pymongo.errors import PyMongoError
import logging
from ollama import chat
import re
from typing import Optional, List
import json
from bson import ObjectId
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr
from google import genai
import random
app = FastAPI()
model = "mistral"

# Configure logging
logging.basicConfig(
    filename='server.log',
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# MongoDB connection@
client = MongoClient(
"mongodb+srv://llamamodel582:4gtooiHOABnJ1tSx@hacksphere.f56em.mongodb.net/farmers_db?retryWrites=true&w=majority",
   serverSelectionTimeoutMS=5000
)
geminiclient = genai.Client(api_key="AIzaSyCToYIs_aKmpMRPfjKGsQdog4pv_sS6NBs")

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
        "/customers": ["Create new customer"],
        "/reviews": ["Create new review"],
        "/orders": ["Create new order"],
    }
}
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security settings
SECRET_KEY = "your_secret_key"  # Change this to a secure key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="sellers/login")

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
        # Call the Gemini API
        response = geminiclient.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
        )

        response_text = response.text.strip()
            
        # Extract JSON from the response if it's wrapped in markdown
        if 'json' in response_text.lower():
            response_text = response_text.split('```json')[-1].split('```')[0].strip()
        elif '```' in response_text:
            response_text = response_text.split('```')[-2].strip()

        operation = json.loads(response_text)
        logging.info(f"Parsed operation: {operation}")

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
    
    
    
    # ========
    
    #    # First, detect the operation (API call and parameters based on user input)
    # try:
    #     operation = detect_operation(user_input)
    #     if operation['method'] == 'GET':
    #         # Fetch the data from the appropriate endpoint
    #         fetched_data = await handle_get(operation['endpoint'], operation.get
    #         ('parameters', {}))
            
    #         # Combine fetched data and user input to create a meaningful prompt for LLM
    #         prompt = generate_llm_prompt(user_input, fetched_data)
            
    #         # Call the LLM model (Mistral) with the combined prompt
    #         # llm_response = chat(
    #         #     model=model,
    #         #     messages=[{'role': 'user', 'content': prompt}]
    #         # )
                                
    #         llm_response = geminiclient.models.generate_content(
    #             model="gemini-2.0-flash",
    #             contents=prompt,
    #         )
            
    #         # Extract the response from the model
    #         model_output = llm_response.text.strip()
            
    #         return {"response": model_output}

    #     elif operation['method'] == 'POST':
    #         result = await handle_post(operation['endpoint'], operation.get('data', {}))
    #         return result
    #     else:
    #         raise HTTPException(status_code=400, detail="Unsupported method")
    # except HTTPException as http_exception:
    #     logging.error(f"HTTP Exception: {http_exception.detail}")
    #     raise http_exception
    # except Exception as e:
    #     logging.error(f"Unexpected Error: {str(e)}")
    #     raise HTTPException(status_code=500, detail=str(e))
    # =========
    

@app.post("/process-request")
async def process_request(request: Request):
    try:
        data = await request.json()
        user_input = data.get("input", "")
        logging.info(f"Received user input: {user_input}")
        
        # Check if it's a product creation request
        if any(word in user_input.lower() for word in ["create", "add", "new"]) and "product" in user_input.lower():
            current_date = datetime.utcnow().strftime('%Y-%m-%d')
            
            # Use the product extraction prompt
            prompt = f"""
            Extract product details from the following text and format them precisely.
            Text: {user_input}
            
            Rules for extraction:
            1. For category, if not explicitly mentioned, infer from the item name:
               - Vegetables: tomatoes, onions, potatoes, carrots, etc.
               - Fruits: apples, mangoes, bananas, oranges, etc.
               - Grains: rice, wheat, barley, oats, etc.
               - Sprouts: mung beans, chickpeas, lentils, etc.
               - Nuts: almonds, cashews, peanuts, etc.
               - Spices: turmeric, pepper, cardamom, etc.
            2. Use today's date ({current_date}) if harvest date is not specified
            
            Return ONLY a JSON object with these exact fields:
            {{
                "item": "product name",
                "pricePerKilo": number,
                "category": "inferred or mentioned category",
                "quantity": number,
                "harvestDate": "{current_date}",
                "location": "place"
            }}
            """
            
            try:
                llm_response = geminiclient.models.generate_content(
                    model="gemini-2.0-flash",
                    contents=prompt,
                )
                
                response_text = llm_response.text.strip()
                logging.info(f"LLM Response: {response_text}")
                
                # Clean the response
                if 'json' in response_text.lower():
                    response_text = response_text.split('```json')[-1].split('```')[0].strip()
                elif '```' in response_text:
                    response_text = response_text.split('```')[-2].strip()
                
                extracted_data = json.loads(response_text)
                logging.info(f"Extracted data: {extracted_data}")
                
                # Create product data
                product_data = {
                    "productId": f"P{random.randint(1000, 9999)}",
                    "item": extracted_data.get("item", "NaN"),
                    "pricePerKilo": float(extracted_data.get("pricePerKilo", 0)),
                    "category": extracted_data.get("category", "NaN"),
                    "quantity": int(extracted_data.get("quantity", 0)),
                    "harvestDate": extracted_data.get("harvestDate", current_date),
                    "location": extracted_data.get("location", "NaN")
                }
                
                logging.info(f"Processed product data: {product_data}")
                return {"product_data": product_data}
                
            except json.JSONDecodeError as e:
                logging.error(f"JSON parsing error: {str(e)}, Response text: {response_text}")
                raise HTTPException(status_code=400, detail=f"Invalid JSON format in response: {str(e)}")
            except Exception as e:
                logging.error(f"Error processing product data: {str(e)}")
                raise HTTPException(status_code=500, detail=f"Error processing product data: {str(e)}")
                
        else:
            # Handle other operations (GET requests, etc.)
            operation = detect_operation(user_input)
            if operation['method'] == 'GET':
                fetched_data = await handle_get(operation['endpoint'], operation.get('parameters', {}))
                prompt = generate_llm_prompt(user_input, fetched_data)
                
                llm_response = geminiclient.models.generate_content(
                    model="gemini-2.0-flash",
                    contents=prompt,
                )
                
                model_output = llm_response.text.strip()
                return {"response": model_output}
                
    except Exception as e:
        logging.error(f"Error in process_request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

def extract_product_details(text: str) -> dict:
    """Extract product details from the LLM response"""
    product_data = {
        "productId": f"P{random.randint(1000, 9999)}",
        "item": "NaN",
        "pricePerKilo": "NaN",
        "category": "NaN",
        "quantity": "NaN",
        "harvestDate": "NaN",
        "location": "NaN"
    }
    
    # Try to extract values from the text
    if "name" in text.lower() or "item" in text.lower():
        match = re.search(r"(?:name|item)[:\s]+([^\n,]+)", text.lower())
        if match:
            product_data["item"] = match.group(1).strip()
            
    if "price" in text.lower():
        match = re.search(r"price[:\s]+(\d+(?:\.\d+)?)", text.lower())
        if match:
            product_data["pricePerKilo"] = float(match.group(1))
            
    if "category" in text.lower():
        match = re.search(r"category[:\s]+([^\n,]+)", text.lower())
        if match:
            product_data["category"] = match.group(1).strip()
            
    if "quantity" in text.lower():
        match = re.search(r"quantity[:\s]+(\d+)", text.lower())
        if match:
            product_data["quantity"] = int(match.group(1))
            
    if "harvest" in text.lower():
        match = re.search(r"harvest[:\s]+([^\n,]+)", text.lower())
        if match:
            product_data["harvestDate"] = match.group(1).strip()
            
    if "location" in text.lower():
        match = re.search(r"location[:\s]+([^\n,]+)", text.lower())
        if match:
            product_data["location"] = match.group(1).strip()
    
    return product_data

def generate_llm_prompt(user_input: str, fetched_data: dict) -> str:
    prompt = f"""
    You are an assistant providing information based strictly on user queries.

    User Query: {user_input}

    Fetched Data: {json.dumps(fetched_data, indent=2)}

    Respond ONLY with the exact details requested in a clear format. If the user asks for a list of products, respond with the available products in an unordered list format, like this:
    
    Available products:
    - Product 1
    - Product 2
    - Product 3

    Do NOT provide any additional context, explanations, or information. For example, if asked 'Show me all the sellers,' return only the list of seller names in the same format, without any extra commentary. Your response should be concise and directly related to the user's request.
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

# @app.post("/products")
# async def create_product(data: dict):
#     try:
#         required_fields = ['name', 'price', 'category', 'sellerId', 'description']
        
#         # Validate required fields
#         for field in required_fields:
#             if field not in data:
#                 raise HTTPException(status_code=400, detail=f"Missing required field: {field}")
        
#         # Add timestamp
#         data['createdAt'] = datetime.utcnow()
        
#         result = db.products.insert_one(data)
#         return {"message": "Product created successfully", "id": str(result.inserted_id)}
    
#     except PyMongoError as e:
#         logging.error(f"MongoDB error: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")




@app.post("/products")
async def create_product(data: dict):
    try:
        # Convert the incoming data to match your schema
        product_data = {
            "productId": data.get('productId'),
            "item": data.get('item'),
            "pricePerKilo": float(data.get('pricePerKilo', 0)),
            "category": data.get('category'),
            "quantity": int(data.get('quantity', 0)),
            "reviews": [],  # Initialize empty reviews array
            "createdAt": datetime.utcnow(),  # Set createdAt to current time
            "updatedAt": datetime.utcnow()
        }

        # Validate required fields
        required_fields = ['productId', 'item', 'pricePerKilo', 'category', 'quantity']
        missing_fields = [field for field in required_fields if not product_data.get(field)]
        
        if missing_fields:
            raise HTTPException(
                status_code=400, 
                detail=f"Missing required fields: {', '.join(missing_fields)}"
            )
        
        result = db.products.insert_one(product_data)
        return {
            "status": "success",
            "message": "Product created successfully",
            "id": str(result.inserted_id)
        }
    
    except PyMongoError as e:
        logging.error(f"MongoDB error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid data format: {str(e)}")

async def handle_post(endpoint: str, data: dict):
    try:
        # Parse natural language input into structured data
        if endpoint == "/products":
            # Extract product details from natural language input
            product_data = parse_product_data(data.get('input', ''))
            return await create_product(product_data)
        elif endpoint == "/reviews":
            review_data = parse_review_data(data.get('input', ''))
            return await create_review(review_data)
        elif endpoint == "/sellers":
            seller_data = parse_seller_data(data.get('input', ''))
            return await create_seller(seller_data)
        elif endpoint == "/customers":
            customer_data = parse_customer_data(data.get('input', ''))
            return await create_customer(customer_data)
        elif endpoint == "/orders":
            order_data = parse_order_data(data.get('input', ''))
            return await create_order(order_data)
        else:
            raise HTTPException(status_code=404, detail="Endpoint not found")
    except Exception as e:
        logging.error(f"Error in handle_post: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def parse_product_data(input_text: str) -> dict:
    """Parse natural language input into structured product data"""
    try:
        # Remove 'Create new product:' from the start
        input_text = input_text.replace('Create new product:', '').strip()
        
        # Split the remaining text by commas
        parts = [p.strip() for p in input_text.split(',')]
        
        product_data = {
            'name': '',
            'price': 0,
            'category': '',
            'sellerId': 'default_seller',  # You might want to get this from authentication
            'description': ''
        }
        
        for part in parts:
            if ':' in part:
                key, value = [p.strip() for p in part.split(':', 1)]
                if 'price' in key.lower():
                    product_data['price'] = float(value.replace('$', ''))
                elif 'category' in key.lower():
                    product_data['category'] = value
                elif 'name' in key.lower():
                    product_data['name'] = value
                elif 'description' in key.lower():
                    product_data['description'] = value
            else:
                # If no key is specified, assume it's the name
                product_data['name'] = part.strip()
                product_data['description'] = f"Description for {part.strip()}"
        
        # If name wasn't set with a key:value pair, use the first part
        if not product_data['name'] and parts:
            product_data['name'] = parts[0]
            product_data['description'] = f"Description for {parts[0]}"
        
        return product_data
    
    except Exception as e:
        logging.error(f"Error parsing product data: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Invalid product data format: {str(e)}")

@app.post("/sellers")
async def create_seller(data: dict):
    try:
        # Convert incoming data to match seller schema
        seller_data = {
            "sellerId": data.get('sellerId'),
            "name": data.get('name'),
            "email": data.get('email'),
            "phone": data.get('phone'),
            "address": data.get('address'),
            "status": "active",
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }

        # Validate required fields
        required_fields = ['sellerId', 'name', 'email', 'phone', 'address']
        missing_fields = [field for field in required_fields if not seller_data.get(field)]
        
        if missing_fields:
            raise HTTPException(
                status_code=400, 
                detail=f"Missing required fields: {', '.join(missing_fields)}"
            )
        
        result = db.sellers.insert_one(seller_data)
        return {
            "status": "success",
            "message": "Seller created successfully",
            "id": str(result.inserted_id)
        }
    
    except PyMongoError as e:
        logging.error(f"MongoDB error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid data format: {str(e)}")

@app.post("/customers")
async def create_customer(data: dict):
    try:
        # Convert incoming data to match customer schema
        customer_data = {
            "customerId": data.get('customerId'),
            "name": data.get('name'),
            "email": data.get('email'),
            "phone": data.get('phone'),
            "address": data.get('address'),
            "status": "active",
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }

        # Validate required fields
        required_fields = ['customerId', 'name', 'email', 'phone', 'address']
        missing_fields = [field for field in required_fields if not customer_data.get(field)]
        
        if missing_fields:
            raise HTTPException(
                status_code=400, 
                detail=f"Missing required fields: {', '.join(missing_fields)}"
            )
        
        result = db.customers.insert_one(customer_data)
        return {
            "status": "success",
            "message": "Customer created successfully",
            "id": str(result.inserted_id)
        }
    
    except PyMongoError as e:
        logging.error(f"MongoDB error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid data format: {str(e)}")

def parse_seller_data(input_text: str) -> dict:
    """Parse natural language input into structured seller data"""
    try:
        # Remove 'Create new seller:' from the start
        input_text = input_text.replace('Create new seller:', '').strip()
        
        # Split the text by commas
        parts = [p.strip() for p in input_text.split(',')]
        
        seller_data = {
            'sellerId': '',
            'name': '',
            'email': '',
            'phone': '',
            'address': ''
        }
        
        for part in parts:
            if ':' in part:
                key, value = [p.strip() for p in part.split(':', 1)]
                key = key.lower()
                if 'id' in key:
                    seller_data['sellerId'] = value
                elif 'name' in key:
                    seller_data['name'] = value
                elif 'email' in key:
                    seller_data['email'] = value
                elif 'phone' in key:
                    seller_data['phone'] = value
                elif 'address' in key:
                    seller_data['address'] = value
        
        return seller_data
    
    except Exception as e:
        logging.error(f"Error parsing seller data: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Invalid seller data format: {str(e)}")

def parse_customer_data(input_text: str) -> dict:
    """Parse natural language input into structured customer data"""
    try:
        # Remove 'Create new customer:' from the start
        input_text = input_text.replace('Create new customer:', '').strip()
        
        # Split the text by commas
        parts = [p.strip() for p in input_text.split(',')]
        
        customer_data = {
            'customerId': '',
            'name': '',
            'email': '',
            'phone': '',
            'address': ''
        }
        
        for part in parts:
            if ':' in part:
                key, value = [p.strip() for p in part.split(':', 1)]
                key = key.lower()
                if 'id' in key:
                    customer_data['customerId'] = value
                elif 'name' in key:
                    customer_data['name'] = value
                elif 'email' in key:
                    customer_data['email'] = value
                elif 'phone' in key:
                    customer_data['phone'] = value
                elif 'address' in key:
                    customer_data['address'] = value
        
        return customer_data
    
    except Exception as e:
        logging.error(f"Error parsing customer data: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Invalid customer data format: {str(e)}")

@app.post("/reviews")
async def create_review(data: dict):
    try:
        # Convert incoming data to match review schema
        review_data = {
            "reviewId": data.get('reviewId'),
            "productId": data.get('productId'),
            "customerId": data.get('customerId'),
            "rating": int(data.get('rating', 0)),
            "comment": data.get('comment'),
            "status": "active",
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }

        # Validate required fields
        required_fields = ['reviewId', 'productId', 'customerId', 'rating', 'comment']
        missing_fields = [field for field in required_fields if not review_data.get(field)]
        
        if missing_fields:
            raise HTTPException(
                status_code=400, 
                detail=f"Missing required fields: {', '.join(missing_fields)}"
            )
        
        # Validate rating is between 1 and 5
        if not 1 <= review_data['rating'] <= 5:
            raise HTTPException(
                status_code=400,
                detail="Rating must be between 1 and 5"
            )
        
        result = db.reviews.insert_one(review_data)
        return {
            "status": "success",
            "message": "Review created successfully",
            "id": str(result.inserted_id)
        }
    
    except PyMongoError as e:
        logging.error(f"MongoDB error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid data format: {str(e)}")

def parse_review_data(input_text: str) -> dict:
    """Parse natural language input into structured review data"""
    try:
        # Remove 'Create new review:' from the start
        input_text = input_text.replace('Create new review:', '').strip()
        
        # Split the text by commas
        parts = [p.strip() for p in input_text.split(',')]
        
        review_data = {
            'reviewId': '',
            'productId': '',
            'customerId': '',
            'rating': 0,
            'comment': ''
        }
        
        for part in parts:
            if ':' in part:
                key, value = [p.strip() for p in part.split(':', 1)]
                key = key.lower()
                if 'review id' in key or 'reviewid' in key:
                    review_data['reviewId'] = value
                elif 'product id' in key or 'productid' in key:
                    review_data['productId'] = value
                elif 'customer id' in key or 'customerid' in key:
                    review_data['customerId'] = value
                elif 'rating' in key:
                    review_data['rating'] = int(value)
                elif 'comment' in key:
                    review_data['comment'] = value
        
        return review_data
    
    except Exception as e:
        logging.error(f"Error parsing review data: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Invalid review data format: {str(e)}")

@app.post("/orders")
async def create_order(request: Request):
    try:
        data = await request.json()
        required_fields = ['customerId', 'products', 'totalAmount']
        
        for field in required_fields:
            if field not in data:
                raise HTTPException(status_code=400, detail=f"Missing required field: {field}")
        
        # Validate products array
        if not isinstance(data['products'], list) or len(data['products']) == 0:
            raise HTTPException(status_code=400, detail="Products must be a non-empty array")
        
        # Add default status and timestamp
        data['status'] = 'pending'
        data['createdAt'] = datetime.utcnow()
        
        result = db.orders.insert_one(data)
        return {"message": "Order created successfully", "id": str(result.inserted_id)}
    
    except PyMongoError as e:
        logging.error(f"MongoDB error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# Pydantic model for Seller
class Seller(BaseModel):
    sellerId: str
    name: str
    email: EmailStr
    password: str  # Consider hashing this before storing
    address: str
    sellerNumber: str
    status: str
    role: str
    createdAt: str  # Use str for ISO format or datetime if you want to parse it
    updatedAt: str  # Same as above
    orderIds: List[ObjectId] = []  # Optional field
    products: List[ObjectId] = []  # Optional field

    class Config:
        arbitrary_types_allowed = True  # Allow arbitrary types
        json_encoders = {
            ObjectId: str  # Convert ObjectId to string for JSON serialization
        }

# Token creation
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Dependency to get the current seller
async def get_current_seller(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        seller_id: str = payload.get("sub")
        if seller_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    seller = sellers_db.get(seller_id)
    if seller is None:
        raise credentials_exception
    return seller

# Seller registration
@app.post("/sellers/register", response_model=Seller)
async def register_seller(seller: Seller):
    logger.info(f"User input received: {seller.dict()}")  # Log user input
    print(f"User input received: {seller.dict()}")  # Print user input

    seller_data = seller.dict()
    seller_data["_id"] = ObjectId()  # Create a new ObjectId for the seller
    seller_data["createdAt"] = datetime.utcnow().isoformat()  # Set createdAt to current time
    seller_data["updatedAt"] = datetime.utcnow().isoformat()  # Set updatedAt to current time

    logger.info("Inserting seller data into the database...")  # Log before DB operation
    print("Inserting seller data into the database...")  # Print before DB operation
    result = db.sellers.insert_one(seller_data)
    seller_data["_id"] = result.inserted_id  # Get the inserted ID

    logger.info(f"Seller registered with ID: {seller_data['_id']}")  # Log the inserted ID
    print(f"Seller registered with ID: {seller_data['_id']}")  # Print the inserted ID
    return Seller(**seller_data)  # Return the registered seller

# Seller login
@app.post("/sellers/login")
async def login_seller(form_data: OAuth2PasswordRequestForm = Depends()):
    seller = sellers_db.get(form_data.username)
    if not seller or not pwd_context.verify(form_data.password, seller.password):
        logging.warning(f"Failed login attempt for seller: {form_data.username}")
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": seller.sellerId}, expires_delta=access_token_expires)
    logging.info(f"Seller logged in: {seller.sellerId}")
    return {"access_token": access_token, "token_type": "bearer"}

# Seller logout (invalidate token logic can be implemented)
@app.post("/sellers/logout")
async def logout_seller():
    logging.info("Seller logged out")
    return {"message": "Seller logged out"}

# Get current seller profile
@app.get("/sellers/me")
async def read_seller_me(current_seller: Seller = Depends(get_current_seller)):
    logging.info(f"Retrieved profile for seller: {current_seller.sellerId}")
    return current_seller

# Update current seller profile
@app.put("/sellers/me")
async def update_seller_me(seller: Seller, current_seller: Seller = Depends(get_current_seller)):
    sellers_db[current_seller.sellerId] = seller
    logging.info(f"Updated profile for seller: {current_seller.sellerId}")
    return {"message": "Seller profile updated"}

# Get products for a specific seller
@app.get("/sellers/{seller_id}/products", response_model=List[dict])
async def get_seller_products(seller_id: str):
    products = list(db.products.find({"sellerId": seller_id}))
    logging.info(f"Retrieved {len(products)} products for seller: {seller_id}")
    return products

# Add a new product for a specific seller
@app.post("/sellers/{seller_id}/products")
async def add_seller_product(seller_id: str, product: dict):
    product['sellerId'] = seller_id
    result = db.products.insert_one(product)
    logging.info(f"Product added for seller: {seller_id}, Product ID: {str(result.inserted_id)}")
    return {"message": "Product added", "id": str(result.inserted_id)}

# Get details of a specific product for a specific seller
@app.get("/sellers/{seller_id}/products/{product_id}")
async def get_seller_product(seller_id: str, product_id: str):
    product = db.products.find_one({"_id": ObjectId(product_id), "sellerId": seller_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    logging.info(f"Retrieved product details for seller: {seller_id}, Product ID: {product_id}")
    return product

# Update details of a specific product for a specific seller
@app.put("/sellers/{seller_id}/products/{product_id}")
async def update_seller_product(seller_id: str, product_id: str, product: dict):
    result = db.products.update_one({"_id": ObjectId(product_id), "sellerId": seller_id}, {"$set": product})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Product not found or no changes made")
    logging.info(f"Updated product for seller: {seller_id}, Product ID: {product_id}")
    return {"message": "Product updated"}

# Delete a specific product for a specific seller
@app.delete("/sellers/{seller_id}/products/{product_id}")
async def delete_seller_product(seller_id: str, product_id: str):
    result = db.products.delete_one({"_id": ObjectId(product_id), "sellerId": seller_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    logging.info(f"Deleted product for seller: {seller_id}, Product ID: {product_id}")
    return {"message": "Product deleted"}

# Get orders for a specific seller
@app.get("/sellers/{seller_id}/orders", response_model=List[dict])
async def get_seller_orders(seller_id: str):
    orders = list(db.orders.find({"sellerId": seller_id}))
    logging.info(f"Retrieved {len(orders)} orders for seller: {seller_id}")
    return orders

# Get details of a specific order for a specific seller
@app.get("/sellers/{seller_id}/orders/{order_id}")
async def get_seller_order(seller_id: str, order_id: str):
    order = db.orders.find_one({"_id": ObjectId(order_id), "sellerId": seller_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    logging.info(f"Retrieved order details for seller: {seller_id}, Order ID: {order_id}")
    return order

# Update the status of a specific order for a specific seller
@app.put("/sellers/{seller_id}/orders/{order_id}")
async def update_seller_order(seller_id: str, order_id: str, status: str):
    result = db.orders.update_one({"_id": ObjectId(order_id), "sellerId": seller_id}, {"$set": {"status": status}})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Order not found or no changes made")
    logging.info(f"Updated order status for seller: {seller_id}, Order ID: {order_id}, New Status: {status}")
    return {"message": "Order status updated"}

# Get inventory levels for all products of a specific seller
@app.get("/sellers/{seller_id}/inventory", response_model=List[dict])
async def get_seller_inventory(seller_id: str):
    inventory = []  # Logic to retrieve inventory levels
    logging.info(f"Retrieved inventory levels for seller: {seller_id}")
    return inventory

# Get inventory level for a specific product of a specific seller
@app.get("/sellers/{seller_id}/inventory/{product_id}")
async def get_seller_product_inventory(seller_id: str, product_id: str):
    # Logic to retrieve inventory level
    logging.info(f"Retrieved inventory level for seller: {seller_id}, Product ID: {product_id}")
    return {}

# Update inventory level for a specific product of a specific seller
@app.put("/sellers/{seller_id}/inventory/{product_id}")
async def update_seller_product_inventory(seller_id: str, product_id: str, quantity: int):
    # Logic to update inventory level
    logging.info(f"Updated inventory level for seller: {seller_id}, Product ID: {product_id}, New Quantity: {quantity}")
    return {"message": "Inventory updated"}

# Get sales data for a specific seller
@app.get("/sellers/{seller_id}/sales")
async def get_seller_sales(seller_id: str):
    # Logic to retrieve sales data
    logging.info(f"Retrieved sales data for seller: {seller_id}")
    return {}

# Get analytics for a specific seller
@app.get("/sellers/{seller_id}/analytics")
async def get_seller_analytics(seller_id: str):
    # Logic to provide analytics
    logging.info(f"Retrieved analytics for seller: {seller_id}")
    return {}

# Get reviews for a specific seller
@app.get("/sellers/{seller_id}/reviews", response_model=List[dict])
async def get_seller_reviews(seller_id: str):
    reviews = list(db.reviews.find({"sellerId": seller_id}))
    logging.info(f"Retrieved {len(reviews)} reviews for seller: {seller_id}")
    return reviews

# Get a specific review for a specific seller
@app.get("/sellers/{seller_id}/reviews/{review_id}")
async def get_seller_review(seller_id: str, review_id: str):
    review = db.reviews.find_one({"_id": ObjectId(review_id), "sellerId": seller_id})
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    logging.info(f"Retrieved review for seller: {seller_id}, Review ID: {review_id}")
    return review

# Get messages for a specific seller
@app.get("/sellers/{seller_id}/messages", response_model=List[dict])
async def get_seller_messages(seller_id: str):
    messages = list(db.messages.find({"sellerId": seller_id}))
    logging.info(f"Retrieved {len(messages)} messages for seller: {seller_id}")
    return messages

# Get a specific message for a specific seller
@app.get("/sellers/{seller_id}/messages/{message_id}")
async def get_seller_message(seller_id: str, message_id: str):
    message = db.messages.find_one({"_id": ObjectId(message_id), "sellerId": seller_id})
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    logging.info(f"Retrieved message for seller: {seller_id}, Message ID: {message_id}")
    return message

# Send a new message to a specific seller
@app.post("/sellers/{seller_id}/messages")
async def send_seller_message(seller_id: str, message: dict):
    message['sellerId'] = seller_id
    result = db.messages.insert_one(message)
    logging.info(f"Message sent to seller: {seller_id}, Message ID: {str(result.inserted_id)}")
    return {"message": "Message sent", "id": str(result.inserted_id)}

# Close the MongoDB connection when the application stops
@app.on_event("shutdown")
def shutdown_event():
    client.close()

# Run the application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

# Add a new endpoint to handle the process of adding a product based on user input and Gemini's response
# Send a request to the backend with the user input to find values for all fields in the product form
# If any field is missing, leave it as NaN
# Send the values to the frontend to display in the form input boxes
# Allow users to change or add data and submit to add a new product
