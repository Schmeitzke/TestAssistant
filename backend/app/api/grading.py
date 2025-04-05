from flask import jsonify, request
from app.api import bp
from app.models.submission import Submission
from app import db

@bp.route('/submissions', methods=['GET'])
def get_submissions():
    submissions = Submission.query.all()
    return jsonify([submission.to_dict() for submission in submissions])

@bp.route('/submissions/<int:id>', methods=['GET'])
def get_submission(id):
    submission = Submission.query.get_or_404(id)
    return jsonify(submission.to_dict())

@bp.route('/submissions', methods=['POST'])
def create_submission():
    data = request.get_json() or {}
    
    if 'test_id' not in data or 'student_id' not in data:
        return jsonify({'error': 'Must include test_id and student_id'}), 400
    
    submission = Submission()
    submission.from_dict(data)
    db.session.add(submission)
    db.session.commit()
    
    return jsonify(submission.to_dict()), 201

@bp.route('/submissions/<int:id>/grade', methods=['POST'])
def grade_submission(id):
    submission = Submission.query.get_or_404(id)
    
    # Check if we have scanned images
    if not request.files:
        return jsonify({'error': 'No scanned test images provided'}), 400
    
    # This would process scanned images with OCR
    # and then use AI to grade against rubric
    # For now, return a placeholder response
    
    return jsonify({
        'submission_id': id,
        'message': 'Grading endpoint (OCR and AI integration pending)',
        'status': 'processing'
    })

@bp.route('/submissions/<int:id>/answers', methods=['GET'])
def get_submission_answers(id):
    submission = Submission.query.get_or_404(id)
    
    # This would fetch the MongoDB document containing the OCR results
    # and AI grading results for this submission
    # For now, return a placeholder
    
    return jsonify({
        'submission_id': id,
        'answers': [
            {'question_id': 1, 'ocr_text': 'Sample OCR text', 'score': None, 'feedback': None}
        ]
    }) 