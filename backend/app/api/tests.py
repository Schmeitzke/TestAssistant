from flask import jsonify, request
from app.api import bp
from app.models.test import Test
from app import db

@bp.route('/tests', methods=['GET'])
def get_tests():
    tests = Test.query.all()
    return jsonify([test.to_dict() for test in tests])

@bp.route('/tests/<int:id>', methods=['GET'])
def get_test(id):
    test = Test.query.get_or_404(id)
    return jsonify(test.to_dict())

@bp.route('/tests', methods=['POST'])
def create_test():
    data = request.get_json() or {}
    
    if 'title' not in data or 'creator_id' not in data:
        return jsonify({'error': 'Must include title and creator_id'}), 400
    
    test = Test()
    test.from_dict(data)
    db.session.add(test)
    db.session.commit()
    
    return jsonify(test.to_dict()), 201

@bp.route('/tests/<int:id>', methods=['PUT'])
def update_test(id):
    test = Test.query.get_or_404(id)
    data = request.get_json() or {}
    
    test.from_dict(data)
    db.session.commit()
    
    return jsonify(test.to_dict())

@bp.route('/tests/<int:id>/questions', methods=['GET'])
def get_test_questions(id):
    test = Test.query.get_or_404(id)
    return jsonify([question.to_dict() for question in test.questions])

@bp.route('/tests/generate', methods=['POST'])
def generate_test():
    data = request.get_json() or {}
    
    if 'topic' not in data or 'num_questions' not in data:
        return jsonify({'error': 'Must include topic and num_questions'}), 400
    
    # This would call the AI service to generate a test
    # For now, return a placeholder response
    return jsonify({
        'message': 'Test generation endpoint (AI integration pending)',
        'topic': data.get('topic'),
        'num_questions': data.get('num_questions')
    }) 