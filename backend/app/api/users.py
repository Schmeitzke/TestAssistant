from flask import jsonify, request
from app.api import bp
from app.models.user import User
from app import db

@bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@bp.route('/users/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.get_or_404(id)
    return jsonify(user.to_dict())

@bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json() or {}
    if 'username' not in data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Must include username, email, and password'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email address already exists'}), 400
    
    user = User()
    user.from_dict(data)
    db.session.add(user)
    db.session.commit()
    
    return jsonify(user.to_dict()), 201

@bp.route('/users/<int:id>', methods=['PUT'])
def update_user(id):
    user = User.query.get_or_404(id)
    data = request.get_json() or {}
    
    if 'username' in data and data['username'] != user.username and \
            User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    if 'email' in data and data['email'] != user.email and \
            User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email address already exists'}), 400
    
    user.from_dict(data, new_user=False)
    db.session.commit()
    
    return jsonify(user.to_dict()) 