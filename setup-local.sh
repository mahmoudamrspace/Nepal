#!/bin/bash

# Local setup script - runs app locally, uses Docker only for database

set -e

echo "🚀 Setting up Nepal Travel Website (Local Development)..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Database - Docker PostgreSQL
DATABASE_URL="postgresql://nepal_user:nepal_password@localhost:5432/nepal_db?schema=public"

# NextAuth
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"

# Node Environment
NODE_ENV="development"
EOF
    echo "✅ .env file created"
else
    echo "ℹ️  .env file already exists"
    echo "⚠️  Make sure DATABASE_URL points to: postgresql://nepal_user:nepal_password@localhost:5432/nepal_db?schema=public"
fi

# Start only PostgreSQL
echo "🐘 Starting PostgreSQL database..."
docker compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Run migrations
echo "🔄 Running database migrations..."
npx prisma db push --accept-data-loss

# Seed database
echo "🌱 Seeding database..."
npm run db:seed || echo "⚠️  Seed may have failed (database might already be seeded)"

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Start the development server: npm run dev"
echo "  2. The app will run at http://localhost:3000"
echo "  3. Admin login: http://localhost:3000/admin/login"
echo "     - Email: admin@nepal.com"
echo "     - Password: admin123"
echo ""
echo "📝 Useful commands:"
echo "  - Start database: docker compose up -d postgres"
echo "  - Stop database: docker compose down"
echo "  - View database logs: docker compose logs postgres"
echo "  - Access database: docker compose exec postgres psql -U nepal_user -d nepal_db"
echo ""


