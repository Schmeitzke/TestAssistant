from app import db
from datetime import datetime

class Test(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    creation_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    subject = db.Column(db.String(64), index=True)
    grade_level = db.Column(db.String(32))
    time_limit_minutes = db.Column(db.Integer, default=60)
    is_published = db.Column(db.Boolean, default=False)
    
    # Relationships
    questions = db.relationship('Question', backref='test', lazy='dynamic', cascade='all, delete-orphan')
    submissions = db.relationship('Submission', backref='test', lazy='dynamic')
    creator = db.relationship('User', backref=db.backref('created_tests', lazy=True))
    
    def __repr__(self):
        return f'<Test {self.title}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'creator_id': self.creator_id,
            'created_at': self.creation_date.isoformat() + 'Z',
            'subject': self.subject,
            'grade_level': self.grade_level,
            'time_limit_minutes': self.time_limit_minutes,
            'is_published': self.is_published,
            'question_count': self.questions.count()
        }
    
    def from_dict(self, data):
        for field in ['title', 'description', 'creator_id', 'subject', 
                      'grade_level', 'time_limit_minutes', 'is_published']:
            if field in data:
                setattr(self, field, data[field])

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    test_id = db.Column(db.Integer, db.ForeignKey('test.id'))
    content = db.Column(db.Text)
    question_type = db.Column(db.String(32))  # 'multiple_choice', 'short_answer', 'essay'
    points = db.Column(db.Integer, default=1)
    order = db.Column(db.Integer)
    
    # Relationships
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
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'))
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