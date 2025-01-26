# models.py
from transformers import pipeline, AutoModelForCausalLM, AutoTokenizer
import os
import json
import datetime
import random
import mysql.connector
from dotenv import load_dotenv
import jwt  # Import PyJWT for JWT token handling
from werkzeug.security import generate_password_hash, check_password_hash  # Import bcrypt for password hashing

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

class PromptGenerator:
    def __init__(self):
        # Initialize Hugging Face pipeline for text generation
        model_name = "microsoft/Phi-3.5-mini-instruct"
        self.tokenizer = AutoTokenizer.from_pretrained(model_name, use_auth_token=HF_TOKEN)
        self.model = AutoModelForCausalLM.from_pretrained(model_name, use_auth_token=HF_TOKEN)
        self.generator = pipeline('text-generation', model=self.model, tokenizer=self.tokenizer)

    def generate_prompt(self, category, complexity, style):
        # Validate input
        if category not in categories:
            raise ValueError('Invalid category')
        if complexity not in complexity_levels:
            raise ValueError('Invalid complexity')
        if style not in styles:
            raise ValueError('Invalid style')

        # Construct prompt for the model
        prompt = f"Generate a creative prompt for a {category} project, with a {complexity} level of difficulty and a {style} style. The prompt should be engaging and inspiring."

        # Generate prompt using Hugging Face pipeline
        generated_prompt = self.generator(prompt, max_length=100, num_return_sequences=1)[0]['generated_text']

        return generated_prompt

class ChallengeManager:
    def __init__(self):
        pass

    def get_daily_challenge(self):
        # Get today's date
        today = datetime.date.today()

        # Check if challenge exists for today
        cursor.execute(
            "SELECT prompt FROM challenges WHERE date = %s",
            (today,)
        )
        challenge = cursor.fetchone()

        if challenge:
            return challenge[0]
        else:
            # Generate a new challenge prompt
            prompt_generator = PromptGenerator()
            challenge_prompt = prompt_generator.generate_prompt(
                category=random.choice(categories),
                complexity=random.choice(complexity_levels),
                style=random.choice(styles)
            )

            # Store the challenge prompt in the database
            cursor.execute(
                "INSERT INTO challenges (date, prompt) VALUES (%s, %s)",
                (today, challenge_prompt)
            )
            db.commit()

            return challenge_prompt

class BookmarkManager:
    def __init__(self):
        pass

    def bookmark_prompt(self, user_id, prompt):
        # Validate input
        if not prompt or not user_id:
            raise ValueError('Missing prompt or user ID')

        # Store bookmark in the database
        cursor.execute(
            "INSERT INTO bookmarks (user_id, prompt) VALUES (%s, %s)",
            (user_id, prompt)
        )
        db.commit()

    def get_bookmarks(self, user_id):
        # Validate input
        if not user_id:
            raise ValueError('Missing user ID')

        # Retrieve bookmarks from the database
        cursor.execute(
            "SELECT prompt FROM bookmarks WHERE user_id = %s",
            (user_id,)
        )
        bookmarks = cursor.fetchall()

        return [bookmark[0] for bookmark in bookmarks]

    def delete_bookmark(self, bookmark_id, user_id):
        # Validate input
        if not bookmark_id or not user_id:
            raise ValueError('Missing bookmark ID or user ID')

        # Delete bookmark from the database
        cursor.execute(
            "DELETE FROM bookmarks WHERE id = %s AND user_id = %s",
            (bookmark_id, user_id)
        )
        db.commit()

class ChallengeHistoryManager:
    def __init__(self):
        pass

    def get_challenges(self):
        # Retrieve challenges from the database
        cursor.execute(
            "SELECT date, prompt FROM challenges ORDER BY date DESC"
        )
        challenges = cursor.fetchall()

        return [{'date': challenge[0], 'prompt': challenge[1]} for challenge in challenges]

class UserManager:
    def __init__(self):
        pass

    def register_user(self, username, password):
        # Validate input
        if not username or not password:
            raise ValueError('Missing username or password')

        # Check if username already exists
        cursor.execute(
            "SELECT * FROM users WHERE username = %s",
            (username,)
        )
        user = cursor.fetchone()

        if user:
            raise ValueError('Username already exists')

        # Hash the password
        hashed_password = generate_password_hash(password)

        # Insert new user into the database
        cursor.execute(
            "INSERT INTO users (username, password) VALUES (%s, %s)",
            (username, hashed_password)
        )
        db.commit()

    def login_user(self, username, password):
        # Validate input
        if not username or not password:
            raise ValueError('Missing username or password')

        # Retrieve user from the database
        cursor.execute(
            "SELECT * FROM users WHERE username = %s",
            (username,)
        )
        user = cursor.fetchone()

        if not user:
            raise ValueError('Invalid username or password')

        # Verify password
        if not check_password_hash(user[2], password):
            raise ValueError('Invalid username or password')

        return user[0]

    def authenticate_user(self, token):
        # Validate token
        if not token:
            raise ValueError('Missing authorization token')

        # Verify token
        try:
            payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=['HS256'])
            return payload['user_id']
        except jwt.ExpiredSignatureError:
            raise ValueError('Token has expired')
        except jwt.InvalidTokenError:
            raise ValueError('Invalid token')

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