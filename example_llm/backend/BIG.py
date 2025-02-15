
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pymongo.errors import PyMongoError
import logging
import json
from typing import Optional

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
    client.admin.command('ping')  # Verify MongoDB connection
    logging.info("Successfully connected to MongoDB")
except Exception as e:
    logging.error(f"Failed to connect to MongoDB: {str(e)}")
    raise Exception("Database connection failed")

db = client["farmers_db"]

# Define available endpoints and operations
ENDPOINTS = {
    "GET": {
        "/sellers": ["List sellers", "Get seller details"],
        "/products": ["List products", "Search products"],
        "/orders": ["List orders", "Get order details"],
        "/customers": ["List customers", "Get customer details"],
        "/reviews": ["List reviews", "Get product reviews"],
    },
    "POST": {
        "/sellers": ["Create new seller"],
        "/products": ["Create new product"],
        "/orders": ["Create new order"],
        "/customers": ["Create new customer"],
        "/reviews": ["Create new review"],
    },
}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def detect_operation(user_input: str) -> dict:
    """Detects the API operation based on user input using pre-defined endpoint mappings."""
    prompt = f"""
    You are an API query analyzer. Analyze the user's request and map it to the appropriate API endpoint and operation.

    Context:
    - Available endpoints and operations:
    {ENDPOINTS}

    Response format (JSON only):
    {{
        "method": "GET|POST|PUT|DELETE",
        "endpoint": "/reviews",
        "parameters": {{
            "product_id": "value",
            "min_rating": number,
            "customer_id": "value"
        }}
    }}

    User Input: {user_input}
    """
    # Here you can use a model like OpenAI to process the prompt and return a JSON response.
    # For now, returning a sample response for demonstration:
    return {
        "method": "GET",
        "endpoint": "/reviews",
        "parameters": {
            "product_id": "P001"
        }
    }

@app.get("/get-messages")
async def get_messages(page: int = 1):
    """Get messages with pagination."""
    try:
        messages_per_page = 10
        skip = (page - 1) * messages_per_page
        messages = list(db.messages.find().skip(skip).limit(messages_per_page))
        total_messages = db.messages.count_documents({})
        total_pages = (total_messages + messages_per_page - 1) // messages_per_page
        return {"messages": messages, "totalPages": total_pages}
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Error fetching messages: {str(e)}")

@app.post("/create-message")
async def create_message(message: dict):
    """Create a new message."""
    try:
        result = db.messages.insert_one(message)
        return {"status": "success", "id": str(result.inserted_id), "text": message["text"]}
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Failed to create message: {str(e)}")

@app.put("/update-message/{message_id}")
async def update_message(message_id: str, updated_message: dict):
    """Update an existing message."""
    try:
        result = db.messages.update_one({"_id": message_id}, {"$set": updated_message})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Message not found")
        return {"status": "success", "matched_count": result.matched_count}
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Error updating message: {str(e)}")

@app.delete("/delete-message/{message_id}")
async def delete_message(message_id: str):
    """Delete a message by ID."""
    try:
        result = db.messages.delete_one({"_id": message_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Message not found")
        return {"status": "success", "deleted_count": result.deleted_count}
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Error deleting message: {str(e)}")



@app.post("/sellers")
async def create_seller(seller: dict):
    """Create a new seller."""
    try:
        result = db.sellers.insert_one(seller)
        return {"status": "success", "seller_id": str(result.inserted_id)}
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Failed to create seller: {str(e)}")


@app.get("/sellers/{seller_id}")
async def get_seller(seller_id: str):
    """Get seller details by ID."""
    try:
        seller = db.sellers.find_one({"seller_id": seller_id}, {'_id': 0})
        if not seller:
            raise HTTPException(status_code=404, detail="Seller not found")
        return seller
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Error fetching seller: {str(e)}")


@app.put("/sellers/{seller_id}")
async def update_seller(seller_id: str, update_data: dict):
    """Update seller details."""
    try:
        result = db.sellers.update_one({"seller_id": seller_id}, {"$set": update_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Seller not found")
        return {"status": "success", "matched_count": result.matched_count}
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Error updating seller: {str(e)}")


@app.delete("/sellers/{seller_id}")
async def delete_seller(seller_id: str):
    """Delete a seller by ID."""
    try:
        result = db.sellers.delete_one({"seller_id": seller_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Seller not found")
        return {"status": "success", "deleted_count": result.deleted_count}
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Error deleting seller: {str(e)}")



@app.post("/products")
async def create_product(product: dict):
    """Create a new product."""
    try:
        result = db.products.insert_one(product)
        return {"status": "success", "product_id": str(result.inserted_id)}
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Failed to create product: {str(e)}")


@app.get("/products/{product_id}")
async def get_product(product_id: str):
    """Get product details by ID."""
    try:
        product = db.products.find_one({"product_id": product_id}, {'_id': 0})
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        return product
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Error fetching product: {str(e)}")


@app.put("/products/{product_id}")
async def update_product(product_id: str, update_data: dict):
    """Update product details."""
    try:
        result = db.products.update_one({"product_id": product_id}, {"$set": update_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Product not found")
        return {"status": "success", "matched_count": result.matched_count}
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Error updating product: {str(e)}")


@app.delete("/products/{product_id}")
async def delete_product(product_id: str):
    """Delete a product by ID."""
    try:
        result = db.products.delete_one({"product_id": product_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Product not found")
        return {"status": "success", "deleted_count": result.deleted_count}
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Error deleting product: {str(e)}")


@app.post("/customers")
async def create_customer(customer: dict):
    """Create a new customer."""
    try:
        result = db.customers.insert_one(customer)
        return {"status": "success", "customer_id": str(result.inserted_id)}
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Failed to create customer: {str(e)}")


@app.get("/customers/{customer_id}")
async def get_customer(customer_id: str):
    """Get customer details by ID."""
    try:
        customer = db.customers.find_one({"customer_id": customer_id}, {'_id': 0})
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
        return customer
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Error fetching customer: {str(e)}")


@app.put("/customers/{customer_id}")
async def update_customer(customer_id: str, update_data: dict):
    """Update customer details."""
    try:
        result = db.customers.update_one({"customer_id": customer_id}, {"$set": update_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Customer not found")
        return {"status": "success", "matched_count": result.matched_count}
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Error updating customer: {str(e)}")


@app.delete("/customers/{customer_id}")
async def delete_customer(customer_id: str):
    """Delete a customer by ID."""
    try:
        result = db.customers.delete_one({"customer_id": customer_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Customer not found")
        return {"status": "success", "deleted_count": result.deleted_count}
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Error deleting customer: {str(e)}")



@app.post("/reviews")
async def create_review(review: dict):
    """Create a new review."""
    try:
        result = db.reviews.insert_one(review)
        return {"status": "success", "review_id": str(result.inserted_id)}
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Failed to create review: {str(e)}")


@app.get("/reviews/{review_id}")
async def get_review(review_id: str):
    """Get review details by ID."""
    try:
        review = db.reviews.find_one({"review_id": review_id}, {'_id': 0})
        if not review:
            raise HTTPException(status_code=404, detail="Review not found")
        return review
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Error fetching review: {str(e)}")


@app.put("/reviews/{review_id}")
async def update_review(review_id: str, update_data: dict):
    """Update review details."""
    try:
        result = db.reviews.update_one({"review_id": review_id}, {"$set": update_data})
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Review not found")
        return {"status": "success", "matched_count": result.matched_count}
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Error updating review: {str(e)}")


@app.delete("/reviews/{review_id}")
async def delete_review(review_id: str):
    """Delete a review by ID."""
    try:
        result = db.reviews.delete_one({"review_id": review_id})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Review not found")
        return {"status": "success", "deleted_count": result.deleted_count}
    except PyMongoError as e:
        raise HTTPException(status_code=500, detail=f"Error deleting review: {str(e)}")
