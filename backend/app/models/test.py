from app import db
from datetime import datetime

class Test(db.Model):
    __tablename__ = 'tests'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    duration_minutes = db.Column(db.Integer, nullable=True)
    num_questions = db.Column(db.Integer, nullable=False, default=0)
    level = db.Column(db.String(100), nullable=True)
    test_date = db.Column(db.DateTime, nullable=True)
    course_name = db.Column(db.String(255), nullable=True)
    subject = db.Column(db.String(100), nullable=True)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(50), default='draft')
    mongo_content_id = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Use string references for relationships to avoid circular imports
    questions = db.relationship('Question', backref='test', lazy='dynamic', cascade='all, delete-orphan')
    submissions = db.relationship('Submission', backref='test', lazy='dynamic', foreign_keys='Submission.test_id')

    def __repr__(self):
        return f'<Test {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'duration_minutes': self.duration_minutes,
            'num_questions': self.num_questions,
            'level': self.level,
            'test_date': self.test_date.isoformat() if self.test_date else None,
            'course_name': self.course_name,
            'subject': self.subject,
            'creator_id': self.creator_id,
            'status': self.status,
            'mongo_content_id': self.mongo_content_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    test_id = db.Column(db.Integer, db.ForeignKey('tests.id'), nullable=False)
    content = db.Column(db.Text)
    question_type = db.Column(db.String(32))
    points = db.Column(db.Integer, default=1)
    order = db.Column(db.Integer)
    
    options = db.relationship('QuestionOption', backref='question', lazy='dynamic', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Question {self.id} for Test {self.test_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'test_id': self.test_id,
            'content': self.content,
            'question_type': self.question_type,
            'points': self.points,
            'order': self.order,
            'options': [option.to_dict() for option in self.options]
        }

class QuestionOption(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)
    content = db.Column(db.Text)
    is_correct = db.Column(db.Boolean, default=False)
    
    def __repr__(self):
        return f'<Option {self.id} for Question {self.question_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'question_id': self.question_id,
            'content': self.content,
            'is_correct': self.is_correct
        } 