from flask import Flask, current_app
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os
import sqlalchemy
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
from flask_pymongo import PyMongo
import time
import socket

# Initialize SQLAlchemy
db = SQLAlchemy()
migrate = Migrate()

# Initialize Flask-PyMongo
mongo = PyMongo()

def create_database_if_not_exists(app):
    """Create the database if it doesn't exist."""
    db_uri = app.config['SQLALCHEMY_DATABASE_URI']
    db_name = db_uri.split('/')[-1]
    
    # Get the base URI (without database name)
    base_uri = '/'.join(db_uri.split('/')[:-1])
    
    try:
        # Try to resolve host
        host = db_uri.split('@')[1].split(':')[0]
        print(f"Trying to resolve host: {host}")
        try:
            socket.gethostbyname(host)
            print(f"Successfully resolved host {host}")
        except socket.gaierror:
            print(f"Warning: Could not resolve hostname {host}. Using IP if available.")
        
        # Connect to the postgres database (which always exists)
        engine = create_engine(f"{base_uri}/postgres", connect_args={'connect_timeout': 10})
        with engine.connect() as connection:
            # Check if our database exists
            result = connection.execute(text(f"SELECT 1 FROM pg_database WHERE datname = '{db_name}'"))
            if not result.fetchone():
                print(f"Creating database {db_name}...")
                # Create the database
                connection.execute(text(f"CREATE DATABASE {db_name}"))
                print(f"Database {db_name} created successfully")
            else:
                print(f"Database {db_name} already exists")
    except Exception as e:
        print(f"Error checking/creating database: {e}")

def create_app(test_config=None):
    # Create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    
    # Enable CORS
    CORS(app)
    
    # Load configuration
    if test_config is None:
        # Load the instance config if it exists
        app.config.from_mapping(
            SECRET_KEY=os.environ.get('SECRET_KEY', 'dev'),
            SQLALCHEMY_DATABASE_URI=os.environ.get('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/testassistant'),
            SQLALCHEMY_TRACK_MODIFICATIONS=False,
            MONGO_URI=os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/testassistant')
        )
    else:
        # Load the test config if passed in
        app.config.from_mapping(test_config)
    
    # Wait for database to be available
    max_retries = 5
    retry_count = 0
    while retry_count < max_retries:
        try:
            # Try to create the database
            create_database_if_not_exists(app)
            break
        except Exception as e:
            retry_count += 1
            if retry_count >= max_retries:
                print(f"Failed to connect to database after {max_retries} attempts: {e}")
                # Continue anyway, as the app might still be usable for health checks
                break
            print(f"Failed to connect to database. Retrying in 5 seconds... (Attempt {retry_count}/{max_retries})")
            time.sleep(5)
    
    # Initialize SQLAlchemy with the app
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Initialize Flask-PyMongo with the app
    mongo.init_app(app)
    
    # Register pymongo instance in the extensions dictionary
    # This makes it accessible via current_app.extensions['pymongo']
    with app.app_context():
        app.extensions['pymongo'] = mongo
        
        # Create all database tables if they don't exist
        try:
            db.create_all()
        except Exception as e:
            print(f"Error creating database tables: {e}")
            # Continue anyway, as the app might still be usable for health checks

    # Import models here to ensure they are registered with SQLAlchemy
    with app.app_context():
        from app import models # This line ensures models are discovered by Flask-Migrate
        
        # Seed the database with initial data in development mode
        # Use FLASK_ENV or assume development if not set
        env = os.environ.get('FLASK_ENV', 'development')
        if env != 'production':
            try:
                from app.db_seed import seed_db
                seed_db()
            except Exception as e:
                print(f"Error seeding database: {e}")

    # Register blueprints
    from app.api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api')
    
    @app.route('/health')
    def health_check():
        return {'status': 'healthy'}
    
    return app 