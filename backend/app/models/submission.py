from app import db, mongo
from datetime import datetime

class Submission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    test_id = db.Column(db.Integer, db.ForeignKey('tests.id'))
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(32), default='pending')  # 'pending', 'grading', 'completed'
    total_score = db.Column(db.Float)
    graded_by_ai = db.Column(db.Boolean, default=False)
    graded_by_teacher = db.Column(db.Boolean, default=False)
    
    def __repr__(self):
        return f'<Submission {self.id} for Test {self.test_id} by Student {self.student_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'test_id': self.test_id,
            'student_id': self.student_id,
            'submitted_at': self.submitted_at.isoformat() + 'Z',
            'status': self.status,
            'total_score': self.total_score,
            'graded_by_ai': self.graded_by_ai,
            'graded_by_teacher': self.graded_by_teacher
        }
    
    def from_dict(self, data):
        for field in ['test_id', 'student_id', 'status', 'total_score', 
                     'graded_by_ai', 'graded_by_teacher']:
            if field in data:
                setattr(self, field, data[field])
    
    def get_answers(self):
        """
        Retrieve the OCR results and grading from MongoDB
        """
        if mongo is None:
            return None
        
        db = mongo.testassistant
        return db.submission_answers.find_one({'submission_id': self.id})
    
    def save_answers(self, answers_data):
        """
        Save OCR results and grading to MongoDB
        """
        if mongo is None:
            return False
        
        db = mongo.testassistant
        
        # Add submission_id to the answers_data
        answers_data['submission_id'] = self.id
        
        # If document already exists, update it, otherwise insert new document
        result = db.submission_answers.update_one(
            {'submission_id': self.id},
            {'$set': answers_data},
            upsert=True
        )
        
        return result.acknowledged 