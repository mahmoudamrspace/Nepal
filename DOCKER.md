# Local Development Setup Guide

This guide will help you set up and run the Nepal Travel Website locally. The database runs in Docker, while the Next.js app runs on your local machine.

## Prerequisites

- Node.js 18+ installed
- Docker Desktop installed and running
- npm or yarn package manager

## Quick Start

### Option 1: Using the Setup Script (Recommended)

```bash
./setup-local.sh
```

This script will:
- Check Docker is running
- Create `.env` file if it doesn't exist
- Start PostgreSQL database in Docker
- Install npm dependencies
- Generate Prisma Client
- Run database migrations
- Seed the database with initial data

### Option 2: Manual Setup

1. **Start PostgreSQL database**:
```bash
docker compose up -d postgres
```

2. **Create `.env` file** (if it doesn't exist):
```bash
cat > .env << EOF
DATABASE_URL="postgresql://nepal_user:nepal_password@localhost:5432/nepal_db?schema=public"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"
NODE_ENV="development"
EOF
```

3. **Install dependencies**:
```bash
npm install
```

4. **Generate Prisma Client**:
```bash
npx prisma generate
```

5. **Run migrations**:
```bash
npx prisma db push --accept-data-loss
```

6. **Seed the database**:
```bash
npm run db:seed
```

7. **Start the development server**:
```bash
npm run dev
```

## Access the Application

- **Website**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin/login
  - Email: `admin@nepal.com`
  - Password: `admin123`

## Useful Commands

### Database Management

```bash
# Start database
npm run db:docker:up
# or
docker compose up -d postgres

# Stop database
npm run db:docker:down
# or
docker compose down

# View database logs
npm run db:docker:logs
# or
docker compose logs -f postgres

# Access database directly
docker compose exec postgres psql -U nepal_user -d nepal_db
```

### Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Push schema changes
npx prisma db push

# Run migrations
npx prisma migrate dev

# Open Prisma Studio (Database GUI)
npx prisma studio
# Then visit http://localhost:5555

# Seed database
npm run db:seed
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Development Workflow

1. **Start the database** (if not running):
   ```bash
   docker compose up -d postgres
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Make code changes** - Next.js will automatically reload on file changes

4. **Database changes** - When you update the Prisma schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

## Troubleshooting

### Port Already in Use

If port 5432 is already in use (you have another PostgreSQL running):
- Change the port in `docker-compose.yml`:
  ```yaml
  ports:
    - "5433:5432"  # Use 5433 instead of 5432
  ```
- Update `DATABASE_URL` in `.env` accordingly:
  ```
  DATABASE_URL="postgresql://nepal_user:nepal_password@localhost:5433/nepal_db?schema=public"
  ```

### Database Connection Issues

- Ensure PostgreSQL container is running: `docker compose ps`
- Check logs: `docker compose logs postgres`
- Verify DATABASE_URL in `.env` matches docker-compose.yml
- Make sure the database is healthy: `docker compose ps` should show "healthy"

### Prisma Client Not Generated

```bash
npx prisma generate
```

### Clear Next.js Cache

```bash
rm -rf .next
npm run dev
```

### Reset Everything

```bash
# Stop and remove database
docker compose down -v

# Start fresh
./setup-local.sh
```

## Using Your Existing PostgreSQL

If you prefer to use your existing PostgreSQL installation instead of Docker:

1. Update `.env` with your database connection:
   ```env
   DATABASE_URL="postgresql://your_user:your_password@localhost:5432/your_database?schema=public"
   ```

2. Create the database:
   ```sql
   CREATE DATABASE nepal_db;
   ```

3. Run migrations:
   ```bash
   npx prisma generate
   npx prisma db push --accept-data-loss
   npm run db:seed
   ```

## Environment Variables

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Secret for NextAuth.js (min 32 characters)
- `NEXTAUTH_URL` - Base URL of your application

Optional:
- `NODE_ENV` - Set to `production` for production builds

## Notes

- Database data persists in Docker volume `postgres_data`
- To completely reset the database, remove the volume: `docker compose down -v`
- The app runs locally with hot reload for faster development
- Prisma Client must be regenerated after schema changes: `npx prisma generate`
