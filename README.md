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
3. Access the running backend container:
   `docker-compose exec backend bash`
4. Inside the container, initialize migrations (only once):
   `flask db init`
5. Create the initial migration:
   `flask db migrate -m "Initial migration with User and Test models"`
6. Apply the migration to the database:
   `flask db upgrade`
7. Backend API will be available at http://localhost:5000
8. Frontend will be available at http://localhost:3000

## Project Structure

```