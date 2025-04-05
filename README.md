# AI-Powered Online Testing Assistant

An intelligent system designed to streamline educational assessment processes using AI technologies.

## Features

- **Test Generation**: Create tests using Large Language Models
- **Handwritten Answer Processing**: OCR technology to digitize handwritten responses
- **Automated Grading**: AI reasoning models for intelligent assessment
- **Analytics Dashboard**: Insights into student performance
- **Personalized Feedback**: Custom learning resources based on performance

## Architecture

- **Backend**: Python/Flask RESTful API
- **Frontend**: React with Glassmorphism UI design
- **Databases**:
  - PostgreSQL for structured data (users, tests, questions)
  - MongoDB for unstructured data (student answers, AI feedback)
- **AI Services**:
  - LLM integration (via APIs)
  - OCR processing (via Google Cloud Document AI/Azure AI)
  - AI reasoning for automated grading

## Prerequisites

- Docker
- Docker Compose
- PostgreSQL
- MongoDB
- Python 3.9+
- Node.js 16+

## Development Setup

1. Clone the repository
2. Run `docker-compose up` to start the development environment
3. Backend API will be available at http://localhost:5000
4. Frontend will be available at http://localhost:3000

## Project Structure

```
├── backend/                # Flask API server
│   ├── app/                # Application code
│   │   ├── api/            # API routes
│   │   ├── core/           # Core business logic
│   │   ├── services/       # External service integrations
│   │   └── models/         # Data models
│   ├── tests/              # Test suite
│   └── Dockerfile          # Backend Docker configuration
├── frontend/               # React application
│   ├── src/                # Source files
│   ├── public/             # Static assets
│   └── Dockerfile          # Frontend Docker configuration
├── database/               # Database scripts and migrations
├── docker-compose.yml      # Docker composition for development
└── docs/                   # Documentation
```

## Cloud Deployment

The application is designed to be deployed on cloud platforms with appropriate scaling configurations. 