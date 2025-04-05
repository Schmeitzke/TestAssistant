from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os
from pymongo import MongoClient

# Initialize SQLAlchemy
db = SQLAlchemy()
migrate = Migrate()

# Initialize MongoDB client
mongo_client = None

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
            MONGODB_URI=os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/testassistant')
        )
    else:
        # Load the test config if passed in
        app.config.from_mapping(test_config)
    
    # Initialize SQLAlchemy with the app
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Initialize MongoDB connection
    global mongo_client
    mongo_client = MongoClient(app.config['MONGODB_URI'])
    
    # Register blueprints
    from app.api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api')
    
    @app.route('/health')
    def health_check():
        return {'status': 'healthy'}
    
    return app 