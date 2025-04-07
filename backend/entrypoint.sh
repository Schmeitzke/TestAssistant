#!/bin/bash
set -e

# Wait for Postgres
echo "Waiting for PostgreSQL..."
wait-for-it postgres:5432 -t 60

# Wait for MongoDB
echo "Waiting for MongoDB..."
wait-for-it mongodb:27017 -t 60

# Start up the application
echo "Running database migrations..."
flask db upgrade

# Seed database if not in production
# Use FLASK_ENV or assume development if not explicitly set to production
if [ "${FLASK_ENV}" != "production" ]; then
  echo "Seeding database..."
  python -m app.db_seed
fi

echo "Starting application..."
exec flask run --host=0.0.0.0 