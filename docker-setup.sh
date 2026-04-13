#!/bin/bash

# Docker setup script for Nepal Travel Website
# This script helps set up the development environment with Docker

set -e

echo "🚀 Setting up Nepal Travel Website with Docker..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install it and try again."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Database
DATABASE_URL="postgresql://nepal_user:nepal_password@postgres:5432/nepal_db?schema=public"

# NextAuth
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"

# Node Environment
NODE_ENV="development"
EOF
    echo "✅ .env file created"
else
    echo "ℹ️  .env file already exists, skipping..."
fi

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start containers
echo "🏗️  Building and starting containers..."
docker-compose up -d --build

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Run migrations
echo "🔄 Running database migrations..."
docker-compose exec app npx prisma db push --accept-data-loss || true

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
docker-compose exec app npx prisma generate

# Seed database
echo "🌱 Seeding database..."
docker-compose exec app npm run db:seed || true

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "  1. The app is running at http://localhost:3000"
echo "  2. Admin login: http://localhost:3000/admin/login"
echo "     - Email: admin@nepal.com"
echo "     - Password: admin123"
echo ""
echo "📝 Useful commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Stop containers: docker-compose down"
echo "  - Start containers: docker-compose up -d"
echo "  - Restart app: docker-compose restart app"
echo "  - Access database: docker-compose exec postgres psql -U nepal_user -d nepal_db"
echo ""

