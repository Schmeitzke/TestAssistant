#!/bin/bash
set -e

# Wait for Postgres
echo "Waiting for PostgreSQL..."
# Increase timeout if needed
wait-for-it postgres:5432 -t 60 -- echo "PostgreSQL is up"

# Wait for MongoDB
echo "Waiting for MongoDB..."
# Increase timeout if needed
wait-for-it mongodb:27017 -t 60 -- echo "MongoDB is up"

# Run database migrations
echo "Running database migrations..."
flask db upgrade
echo "Database migrations finished."

# Seed database (Only run once or check if seeding is needed)
# You might want a more robust check than just FLASK_ENV
# For example, check if a specific user/table exists before seeding
if [ "${FLASK_ENV}" != "production" ]; then
  # Consider adding a check here to prevent re-seeding on every restart
  echo "Attempting to seed database (if necessary)..."
  python -m app.db_seed
  echo "Database seeding attempt finished."
fi

echo "Starting application with Gunicorn..."
# Use Gunicorn for a more robust server
# Bind to 0.0.0.0 to accept connections from outside the container
# Adjust workers as needed (e.g., based on CPU cores)
# Point to your Flask app instance (wsgi:app in wsgi.py)
exec gunicorn --bind 0.0.0.0:5000 wsgi:app 