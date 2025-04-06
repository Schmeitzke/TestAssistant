from app import db
from app.models.user import User, UserRole

def seed_db():
    """Seed the database with initial data for development."""
    print("Starting database seeding...")
    
    # Check if users already exist
    if User.query.count() == 0:
        print("Creating initial users...")
        
        # Create a test teacher account
        teacher = User(
            username='teacher',
            email='teacher@example.com',
            role=UserRole.TEACHER,
            first_name='Test',
            last_name='Teacher'
        )
        db.session.add(teacher)
        
        # Create a test student account
        student = User(
            username='student',
            email='student@example.com',
            role=UserRole.STUDENT,
            first_name='Test',
            last_name='Student'
        )
        db.session.add(student)
        
        # Commit changes to database
        db.session.commit()
        print(f"Created teacher user with ID: {teacher.id}")
        print(f"Created student user with ID: {student.id}")
    else:
        print("Users already exist, skipping user creation")
    
    print("Database seeding completed")

if __name__ == "__main__":
    # This allows running the script directly
    from app import create_app
    app = create_app()
    with app.app_context():
        seed_db() 