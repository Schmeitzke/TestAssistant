from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import enum

class UserRole(enum.Enum):
    TEACHER = 'teacher'
    STUDENT = 'student'

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.Enum(UserRole), nullable=False, default=UserRole.STUDENT)
    # Add password hash later for security
    # password_hash = db.Column(db.String(128))
    first_name = db.Column(db.String(64))
    last_name = db.Column(db.String(64))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships - use string references to avoid circular imports
    created_tests = db.relationship('Test', backref='creator', lazy='dynamic', foreign_keys='Test.creator_id')
    submissions = db.relationship('Submission', backref='student', lazy='dynamic', foreign_keys='Submission.student_id')
    
    def __repr__(self):
        return f'<User {self.username}>'
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role.value if isinstance(self.role, UserRole) else self.role,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'created_at': self.created_at.isoformat() + 'Z'
        }
    
    def from_dict(self, data, new_user=True):
        for field in ['username', 'email', 'role', 'first_name', 'last_name']:
            if field in data:
                setattr(self, field, data[field])
        if new_user and 'password' in data:
            self.set_password(data['password']) 