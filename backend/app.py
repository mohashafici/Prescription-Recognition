from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import bcrypt
import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017/'))
db = client['prescription_system']
users_collection = db['users']

# JWT configuration
JWT_SECRET = os.getenv('JWT_SECRET', 'your-secret-key')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION = 24  # hours

def generate_token(user_id):
    """Generate JWT token for authenticated user"""
    payload = {
        'user_id': str(user_id),
        'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRATION)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'password', 'role']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400

        # Check if email already exists
        if users_collection.find_one({'email': data['email']}):
            return jsonify({'error': 'Email already registered'}), 400

        # Hash password
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

        # Create user document
        user = {
            'name': data['name'],
            'email': data['email'],
            'password': hashed_password,
            'role': data['role'],
            'created_at': datetime.utcnow()
        }

        # Insert user into database
        result = users_collection.insert_one(user)
        
        # Generate token
        token = generate_token(result.inserted_id)

        return jsonify({
            'message': 'User registered successfully',
            'token': token,
            'user': {
                'id': str(result.inserted_id),
                'name': user['name'],
                'email': user['email'],
                'role': user['role']
            }
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()

        # Validate required fields
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400

        # Find user by email
        user = users_collection.find_one({'email': data['email']})
        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401

        # Verify password
        if not bcrypt.checkpw(data['password'].encode('utf-8'), user['password']):
            return jsonify({'error': 'Invalid email or password'}), 401

        # Generate token
        token = generate_token(user['_id'])

        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': str(user['_id']),
                'name': user['name'],
                'email': user['email'],
                'role': user['role']
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/update-password', methods=['POST'])
def update_password():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['userId', 'currentPassword', 'newPassword']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400

        # Find user by ID
        user = users_collection.find_one({'_id': ObjectId(data['userId'])})
        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Verify current password
        if not bcrypt.checkpw(data['currentPassword'].encode('utf-8'), user['password']):
            return jsonify({'error': 'Current password is incorrect'}), 401

        # Hash new password
        hashed_password = bcrypt.hashpw(data['newPassword'].encode('utf-8'), bcrypt.gensalt())

        # Update password in database
        users_collection.update_one(
            {'_id': ObjectId(data['userId'])},
            {'$set': {'password': hashed_password}}
        )

        return jsonify({
            'message': 'Password updated successfully'
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        # Get all users from database with proper projection
        users = list(users_collection.find(
            {},  # empty filter to get all users
            {
                '_id': 1,
                'name': 1,
                'email': 1,
                'role': 1,
                'created_at': 1,
                'status': 1
            }
        ))

        # Convert ObjectId to string for JSON serialization
        for user in users:
            user['_id'] = str(user['_id'])
            user['created_at'] = user['created_at'].isoformat()
            # Set default status if not present
            if 'status' not in user:
                user['status'] = 'active'

        return jsonify({
            'users': users
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/users/<user_id>/status', methods=['PUT'])
def update_user_status(user_id):
    try:
        data = request.get_json()
        
        # Validate required fields
        if 'status' not in data:
            return jsonify({'error': 'Status is required'}), 400
        
        # Validate status value
        if data['status'] not in ['active', 'inactive']:
            return jsonify({'error': 'Invalid status value'}), 400

        # Update user status
        result = users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {'status': data['status']}}
        )

        if result.matched_count == 0:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({
            'message': f'User status updated to {data["status"]}'
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    try:
        # Get total users count
        total_users = users_collection.count_documents({})
        
        # Get active users count
        active_users = users_collection.count_documents({'status': 'active'})
        
        # Get inactive users count
        inactive_users = users_collection.count_documents({'status': 'inactive'})

        return jsonify({
            'total_users': total_users,
            'active_users': active_users,
            'inactive_users': inactive_users
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 


# from flask_cors import CORS
# from pymongo import MongoClient
# from bson import ObjectId
# import bcrypt
# import jwt
# from datetime import datetime, timedelta
# import os
# from dotenv import load_dotenv

# import torch
# from transformers import BertTokenizerFast, BertForMaskedLM
