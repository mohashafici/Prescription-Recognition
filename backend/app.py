from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import bcrypt
import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from predictor import extract_text_and_predict
import io

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = MongoClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017/'))
db = client['prescription_system']
users_collection = db['users']
history_collection = db['prediction_history']

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

@app.route('/api/users', methods=['GET', 'POST'])
def manage_users():
    try:
        # Get user ID from token
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'No authorization token provided'}), 401

        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            user_id = payload['user_id']
            
            # Check if user is admin
            user = users_collection.find_one({'_id': ObjectId(user_id)})
            if not user or user.get('role') != 'admin':
                return jsonify({'error': 'Unauthorized access'}), 403
                
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        if request.method == 'GET':
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

        elif request.method == 'POST':
            # Create new user
            data = request.get_json()
            
            # Validate required fields
            required_fields = ['name', 'email', 'password', 'role']
            for field in required_fields:
                if field not in data:
                    return jsonify({'error': f'{field} is required'}), 400

            # Validate role
            if data['role'] not in ['user', 'admin']:
                return jsonify({'error': 'Invalid role. Must be "user" or "admin"'}), 400

            # Check if email already exists
            if users_collection.find_one({'email': data['email']}):
                return jsonify({'error': 'Email already registered'}), 400

            # Hash password
            hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

            # Create user document
            new_user = {
                'name': data['name'],
                'email': data['email'],
                'password': hashed_password,
                'role': data['role'],
                'status': 'active',
                'created_at': datetime.utcnow()
            }

            # Insert user into database
            result = users_collection.insert_one(new_user)

            return jsonify({
                'message': 'User created successfully',
                'user': {
                    'id': str(result.inserted_id),
                    'name': new_user['name'],
                    'email': new_user['email'],
                    'role': new_user['role'],
                    'status': new_user['status']
                }
            }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/users/<user_id>/status', methods=['PUT'])
def update_user_status(user_id):
    try:
        # Get user ID from token
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'No authorization token provided'}), 401

        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            admin_user_id = payload['user_id']
            
            # Check if user is admin
            admin_user = users_collection.find_one({'_id': ObjectId(admin_user_id)})
            if not admin_user or admin_user.get('role') != 'admin':
                return jsonify({'error': 'Unauthorized access'}), 403
                
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

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
        # Get user ID from token
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'No authorization token provided'}), 401

        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            user_id = payload['user_id']
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        # Get total uploads
        total_uploads = history_collection.count_documents({'user_id': ObjectId(user_id)})

        # Get last upload
        last_upload = history_collection.find_one(
            {'user_id': ObjectId(user_id)},
            sort=[('created_at', -1)]
        )

        # Get recent scans (last 5)
        recent_scans = list(history_collection.find(
            {'user_id': ObjectId(user_id)},
            sort=[('created_at', -1)],
            limit=5
        ))

        # Calculate success rate (entries with found drugs)
        successful_scans = history_collection.count_documents({
            'user_id': ObjectId(user_id),
            'found_drugs': {'$ne': []}  # entries that have found drugs
        })
        success_rate = (successful_scans / total_uploads * 100) if total_uploads > 0 else 0

        # Format last upload and recent scans
        if last_upload:
            last_upload['_id'] = str(last_upload['_id'])
            last_upload['user_id'] = str(last_upload['user_id'])
            last_upload['created_at'] = last_upload['created_at'].isoformat()

        for scan in recent_scans:
            scan['_id'] = str(scan['_id'])
            scan['user_id'] = str(scan['user_id'])
            scan['created_at'] = scan['created_at'].isoformat()

        return jsonify({
            'total_uploads': total_uploads,
            'last_upload': last_upload,
            'recent_scans': recent_scans,
            'success_rate': round(success_rate, 1)
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400

        # Get user ID from token
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'No authorization token provided'}), 401

        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            user_id = payload['user_id']
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        image_file = request.files['image']
        if not image_file:
            return jsonify({'error': 'Empty image file'}), 400

        # Convert the file to bytes
        image_bytes = io.BytesIO(image_file.read())
        
        # Get predictions
        ocr_text, predicted_text, found_drugs, ocr_confidence, drug_confidence = extract_text_and_predict(image_bytes)

        # Store in history
        history_entry = {
            'user_id': ObjectId(user_id),
            'ocr_text': ocr_text,
            'found_drugs': found_drugs,
            'ocr_confidence': ocr_confidence,
            'drug_confidence': drug_confidence,
            'created_at': datetime.utcnow()
        }
        history_collection.insert_one(history_entry)

        return jsonify({
            'ocr_text': ocr_text,
            'predicted_text': predicted_text,
            'found_drugs': found_drugs,
            'ocr_confidence': ocr_confidence,
            'drug_confidence': drug_confidence
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    try:
        # Get user ID from token
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'No authorization token provided'}), 401

        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            user_id = payload['user_id']
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        # Get history entries for the user
        history = list(history_collection.find(
            {'user_id': ObjectId(user_id)},
            sort=[('created_at', -1)]  # Sort by most recent first
        ))

        # Convert ObjectId and datetime to strings for JSON serialization
        for entry in history:
            entry['_id'] = str(entry['_id'])
            entry['user_id'] = str(entry['user_id'])
            entry['created_at'] = entry['created_at'].isoformat()

        return jsonify({
            'history': history
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/logs', methods=['GET'])
def get_all_logs():
    try:
        # Get user ID from token
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'No authorization token provided'}), 401

        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            user_id = payload['user_id']
            
            # Check if user is admin
            user = users_collection.find_one({'_id': ObjectId(user_id)})
            if not user or user.get('role') != 'admin':
                return jsonify({'error': 'Unauthorized access'}), 403
                
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        # Get all prescription logs with user information
        logs = list(history_collection.aggregate([
            {
                '$lookup': {
                    'from': 'users',
                    'localField': 'user_id',
                    'foreignField': '_id',
                    'as': 'user'
                }
            },
            {
                '$unwind': '$user'
            },
            {
                '$project': {
                    '_id': 1,
                    'ocr_text': 1,
                    'found_drugs': 1,
                    'created_at': 1,
                    'user': {
                        'name': 1,
                        'email': 1
                    }
                }
            },
            {
                '$sort': {'created_at': -1}
            }
        ]))

        # Convert ObjectId and datetime to strings for JSON serialization
        for log in logs:
            log['_id'] = str(log['_id'])
            log['created_at'] = log['created_at'].isoformat()

        return jsonify({
            'logs': logs
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/dashboard/stats', methods=['GET'])
def get_admin_dashboard_stats():
    try:
        # Get user ID from token
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'No authorization token provided'}), 401

        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            user_id = payload['user_id']
            
            # Check if user is admin
            user = users_collection.find_one({'_id': ObjectId(user_id)})
            if not user or user.get('role') != 'admin':
                return jsonify({'error': 'Unauthorized access'}), 403
                
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        # Get total users
        total_users = users_collection.count_documents({})
        
        # Get total scans
        total_scans = history_collection.count_documents({})
        
        # Get successful scans (with found drugs)
        successful_scans = history_collection.count_documents({
            'found_drugs': {'$ne': []}
        })
        
        # Calculate success rate
        success_rate = (successful_scans / total_scans * 100) if total_scans > 0 else 0
        
        # Get recent activity (last 10 scans with user info)
        recent_activity = list(history_collection.aggregate([
            {
                '$lookup': {
                    'from': 'users',
                    'localField': 'user_id',
                    'foreignField': '_id',
                    'as': 'user'
                }
            },
            {
                '$unwind': '$user'
            },
            {
                '$project': {
                    '_id': 1,
                    'created_at': 1,
                    'found_drugs': 1,
                    'user': {
                        'name': 1,
                        'email': 1
                    }
                }
            },
            {
                '$sort': {'created_at': -1}
            },
            {
                '$limit': 10
            }
        ]))

        # Get scans per day for the last 7 days
        from datetime import datetime, timedelta
        scans_per_day = []
        for i in range(7):
            date = datetime.utcnow() - timedelta(days=i)
            start_of_day = date.replace(hour=0, minute=0, second=0, microsecond=0)
            end_of_day = start_of_day + timedelta(days=1)
            
            daily_scans = history_collection.count_documents({
                'created_at': {
                    '$gte': start_of_day,
                    '$lt': end_of_day
                }
            })
            
            scans_per_day.append({
                'date': date.strftime('%b %d'),
                'scans': daily_scans
            })
        
        # Reverse to show oldest to newest
        scans_per_day.reverse()

        # Get accuracy trends (success rate per day for last 7 days)
        accuracy_trends = []
        for i in range(7):
            date = datetime.utcnow() - timedelta(days=i)
            start_of_day = date.replace(hour=0, minute=0, second=0, microsecond=0)
            end_of_day = start_of_day + timedelta(days=1)
            
            daily_total = history_collection.count_documents({
                'created_at': {
                    '$gte': start_of_day,
                    '$lt': end_of_day
                }
            })
            
            daily_successful = history_collection.count_documents({
                'created_at': {
                    '$gte': start_of_day,
                    '$lt': end_of_day
                },
                'found_drugs': {'$ne': []}
            })
            
            daily_accuracy = (daily_successful / daily_total * 100) if daily_total > 0 else 0
            
            accuracy_trends.append({
                'date': date.strftime('%b %d'),
                'accuracy': round(daily_accuracy, 1)
            })
        
        # Reverse to show oldest to newest
        accuracy_trends.reverse()

        # Format recent activity
        for activity in recent_activity:
            activity['_id'] = str(activity['_id'])
            activity['created_at'] = activity['created_at'].isoformat()
            activity['status'] = 'Completed' if activity['found_drugs'] else 'Failed'
            activity['model'] = 'TrOCR'

        return jsonify({
            'total_users': total_users,
            'total_scans': total_scans,
            'success_rate': round(success_rate, 1),
            'recent_activity': recent_activity,
            'scans_per_day': scans_per_day,
            'accuracy_trends': accuracy_trends
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/reports', methods=['GET'])
def get_admin_reports():
    try:
        # Get user ID from token
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'No authorization token provided'}), 401

        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            user_id = payload['user_id']
            
            # Check if user is admin
            user = users_collection.find_one({'_id': ObjectId(user_id)})
            if not user or user.get('role') != 'admin':
                return jsonify({'error': 'Unauthorized access'}), 403
                
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        # Get query parameters
        period = request.args.get('period', 'month')  # today, week, month, year
        
        # Calculate date ranges
        from datetime import datetime, timedelta
        now = datetime.utcnow()
        
        if period == 'today':
            start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
            end_date = start_date + timedelta(days=1)
        elif period == 'week':
            start_date = now - timedelta(days=7)
            end_date = now
        elif period == 'month':
            start_date = now - timedelta(days=30)
            end_date = now
        elif period == 'year':
            start_date = now - timedelta(days=365)
            end_date = now
        else:
            start_date = now - timedelta(days=30)
            end_date = now

        # Get total users
        total_users = users_collection.count_documents({})
        
        # Get total scans in period
        total_scans = history_collection.count_documents({
            'created_at': {'$gte': start_date, '$lt': end_date}
        })
        
        # Get successful scans in period
        successful_scans = history_collection.count_documents({
            'created_at': {'$gte': start_date, '$lt': end_date},
            'found_drugs': {'$ne': []}
        })
        
        # Calculate success rate
        success_rate = (successful_scans / total_scans * 100) if total_scans > 0 else 0
        
        # Get average confidence scores
        avg_ocr_confidence = 0
        avg_drug_confidence = 0
        
        confidence_stats = list(history_collection.aggregate([
            {
                '$match': {
                    'created_at': {'$gte': start_date, '$lt': end_date}
                }
            },
            {
                '$group': {
                    '_id': None,
                    'avg_ocr_confidence': {'$avg': '$ocr_confidence'},
                    'avg_drug_confidence': {'$avg': '$drug_confidence'}
                }
            }
        ]))
        
        if confidence_stats:
            avg_ocr_confidence = confidence_stats[0].get('avg_ocr_confidence', 0)
            avg_drug_confidence = confidence_stats[0].get('avg_drug_confidence', 0)

        # Get recognition activity data (daily for the period)
        recognition_activity = []
        current_date = start_date
        while current_date < end_date:
            next_date = current_date + timedelta(days=1)
            
            daily_scans = history_collection.count_documents({
                'created_at': {'$gte': current_date, '$lt': next_date}
            })
            
            daily_successful = history_collection.count_documents({
                'created_at': {'$gte': current_date, '$lt': next_date},
                'found_drugs': {'$ne': []}
            })
            
            daily_accuracy = (daily_successful / daily_scans * 100) if daily_scans > 0 else 0
            
            recognition_activity.append({
                'name': current_date.strftime('%a'),
                'recognitions': daily_scans,
                'accuracy': round(daily_accuracy, 1)
            })
            
            current_date = next_date

        # Get prescription distribution (successful vs failed)
        prescription_distribution = [
            {
                'name': 'Successful',
                'value': successful_scans
            },
            {
                'name': 'Failed',
                'value': total_scans - successful_scans
            }
        ]

        # Get top drugs detected
        top_drugs = list(history_collection.aggregate([
            {
                '$match': {
                    'created_at': {'$gte': start_date, '$lt': end_date},
                    'found_drugs': {'$ne': []}
                }
            },
            {
                '$unwind': '$found_drugs'
            },
            {
                '$group': {
                    '_id': '$found_drugs',
                    'count': {'$sum': 1}
                }
            },
            {
                '$sort': {'count': -1}
            },
            {
                '$limit': 10
            }
        ]))

        # Get user activity stats
        user_activity = list(history_collection.aggregate([
            {
                '$match': {
                    'created_at': {'$gte': start_date, '$lt': end_date}
                }
            },
            {
                '$lookup': {
                    'from': 'users',
                    'localField': 'user_id',
                    'foreignField': '_id',
                    'as': 'user'
                }
            },
            {
                '$unwind': '$user'
            },
            {
                '$group': {
                    '_id': '$user.name',
                    'scans': {'$sum': 1},
                    'successful_scans': {
                        '$sum': {'$cond': [{'$ne': ['$found_drugs', []]}, 1, 0]}
                    }
                }
            },
            {
                '$sort': {'scans': -1}
            },
            {
                '$limit': 5
            }
        ]))

        # Calculate period-over-period growth
        previous_start = start_date - (end_date - start_date)
        previous_end = start_date
        
        previous_scans = history_collection.count_documents({
            'created_at': {'$gte': previous_start, '$lt': previous_end}
        })
        
        previous_users = users_collection.count_documents({
            'created_at': {'$gte': previous_start, '$lt': previous_end}
        })
        
        scans_growth = ((total_scans - previous_scans) / previous_scans * 100) if previous_scans > 0 else 0
        users_growth = ((total_users - previous_users) / previous_users * 100) if previous_users > 0 else 0

        return jsonify({
            'period': period,
            'stats': {
                'total_users': total_users,
                'total_scans': total_scans,
                'success_rate': round(success_rate, 1),
                'avg_ocr_confidence': round(avg_ocr_confidence, 1),
                'avg_drug_confidence': round(avg_drug_confidence, 1),
                'scans_growth': round(scans_growth, 1),
                'users_growth': round(users_growth, 1)
            },
            'recognition_activity': recognition_activity,
            'prescription_distribution': prescription_distribution,
            'top_drugs': [{'name': drug['_id'], 'count': drug['count']} for drug in top_drugs],
            'user_activity': user_activity
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/reports/export', methods=['POST'])
def export_report():
    try:
        # Get user ID from token
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'No authorization token provided'}), 401

        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            user_id = payload['user_id']
            
            # Check if user is admin
            user = users_collection.find_one({'_id': ObjectId(user_id)})
            if not user or user.get('role') != 'admin':
                return jsonify({'error': 'Unauthorized access'}), 403
                
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401

        data = request.get_json()
        report_type = data.get('type', 'general')
        period = data.get('period', 'month')
        
        # For now, return a success message
        # In a real implementation, you would generate and return a CSV/PDF file
        return jsonify({
            'message': f'{report_type} report for {period} generated successfully',
            'download_url': f'/api/admin/reports/download/{report_type}_{period}_{datetime.utcnow().strftime("%Y%m%d")}.csv'
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
