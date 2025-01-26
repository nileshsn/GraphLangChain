# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline, AutoModelForCausalLM, AutoTokenizer
import os
import json
import datetime
import random
import mysql.connector
from dotenv import load_dotenv
import jwt  # Import PyJWT for JWT token handling
from werkzeug.security import generate_password_hash, check_password_hash  # Import bcrypt for password hashing
from models import PromptGenerator, ChallengeManager, BookmarkManager, ChallengeHistoryManager, UserManager  # Import models

load_dotenv()  # Load environment variables

# Hugging Face API key
HF_TOKEN = os.environ.get('HF_TOKEN')

# Database configuration
db_config = {
    'host': os.environ.get('DB_HOST'),
    'user': os.environ.get('DB_USER'),
    'password': os.environ.get('DB_PASSWORD'),
    'database': os.environ.get('DB_NAME')
}

# Initialize MySQL connection
db = mysql.connector.connect(**db_config)
cursor = db.cursor()

# JWT secret key
JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')  # Add JWT_SECRET_KEY to your .env file

# Define prompt categories
categories = ['Writing', 'Art', 'Business Ideas', 'Personal Projects']

# Define prompt complexity levels
complexity_levels = ['Easy', 'Medium', 'Hard']

# Define prompt styles
styles = ['Descriptive', 'Intriguing', 'Surreal', 'Humorous']

app = Flask(__name__)
CORS(app)

# Function to generate a creative prompt
@app.route('/generate_prompt', methods=['POST'])
def generate_prompt():
    data = request.get_json()
    category = data.get('category')
    complexity = data.get('complexity')
    style = data.get('style')

    # Validate input
    if category not in categories:
        return jsonify({'error': 'Invalid category'}), 400
    if complexity not in complexity_levels:
        return jsonify({'error': 'Invalid complexity'}), 400
    if style not in styles:
        return jsonify({'error': 'Invalid style'}), 400

    # Use the PromptGenerator class from models.py
    prompt_generator = PromptGenerator()
    generated_prompt = prompt_generator.generate_prompt(category, complexity, style)

    return jsonify({'prompt': generated_prompt})

# Function to get daily challenge prompt
@app.route('/daily_challenge', methods=['GET'])
def get_daily_challenge():
    # Use the ChallengeManager class from models.py
    challenge_manager = ChallengeManager()
    daily_challenge = challenge_manager.get_daily_challenge()

    return jsonify({'prompt': daily_challenge}), 200

# Function to bookmark a prompt
@app.route('/bookmark', methods=['POST'])
def bookmark_prompt():
    data = request.get_json()
    prompt = data.get('prompt')
    user_id = data.get('user_id')

    # Validate input
    if not prompt or not user_id:
        return jsonify({'error': 'Missing prompt or user ID'}), 400

    # Use the BookmarkManager class from models.py
    bookmark_manager = BookmarkManager()
    bookmark_manager.bookmark_prompt(user_id, prompt)

    return jsonify({'message': 'Prompt bookmarked successfully'}), 200

# Function to get user's bookmarks
@app.route('/bookmarks', methods=['GET'])
def get_bookmarks():
    user_id = request.args.get('user_id')

    # Validate input
    if not user_id:
        return jsonify({'error': 'Missing user ID'}), 400

    # Use the BookmarkManager class from models.py
    bookmark_manager = BookmarkManager()
    bookmarks = bookmark_manager.get_bookmarks(user_id)

    return jsonify({'bookmarks': bookmarks}), 200

# Function to delete a bookmark
@app.route('/bookmark/<bookmark_id>', methods=['DELETE'])
def delete_bookmark(bookmark_id):
    user_id = request.args.get('user_id')

    # Validate input
    if not bookmark_id or not user_id:
        return jsonify({'error': 'Missing bookmark ID or user ID'}), 400

    # Use the BookmarkManager class from models.py
    bookmark_manager = BookmarkManager()
    bookmark_manager.delete_bookmark(bookmark_id, user_id)

    return jsonify({'message': 'Bookmark deleted successfully'}), 200

# Function to get past challenges
@app.route('/challenges', methods=['GET'])
def get_challenges():
    # Use the ChallengeHistoryManager class from models.py
    challenge_history_manager = ChallengeHistoryManager()
    challenges = challenge_history_manager.get_challenges()

    return jsonify({'challenges': challenges}), 200

# Function to register a new user
@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Validate input
    if not username or not password:
        return jsonify({'error': 'Missing username or password'}), 400

    # Use the UserManager class from models.py
    user_manager = UserManager()
    user_manager.register_user(username, password)

    return jsonify({'message': 'User registered successfully'}), 200

# Function to login a user
@app.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Validate input
    if not username or not password:
        return jsonify({'error': 'Missing username or password'}), 400

    # Use the UserManager class from models.py
    user_manager = UserManager()
    user_id = user_manager.login_user(username, password)

    # Generate JWT token
    token = generate_jwt_token(user_id)

    return jsonify({'token': token}), 200

# Function to handle user authentication
@app.route('/auth', methods=['GET'])
def authenticate_user():
    token = request.headers.get('Authorization')

    # Validate token
    if not token:
        return jsonify({'error': 'Missing authorization token'}), 401

    # Use the UserManager class from models.py
    user_manager = UserManager()
    user_id = user_manager.authenticate_user(token)

    if not user_id:
        return jsonify({'error': 'Invalid authorization token'}), 401

    return jsonify({'user_id': user_id}), 200

# Function to generate a JWT token
def generate_jwt_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)  # Token expires in 1 day
    }
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm='HS256')
    return token.decode('utf-8')

# Function to verify a JWT token
def verify_jwt_token(token):
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

# Function to hash a password
def hash_password(password):
    return generate_password_hash(password)

# Function to check password against hash
def check_password(password, hashed_password):
    return check_password_hash(hashed_password, password)

if __name__ == '__main__':
    app.run(debug=True)