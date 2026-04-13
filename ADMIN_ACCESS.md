# Admin Dashboard Access Guide

## Quick Access

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the login page:**
   ```
   http://localhost:3000/admin/login
   ```

3. **Login Credentials:**
   - **Email:** `admin@nepal.com`
   - **Password:** `admin123`

## Troubleshooting

### If you get a 500 error on `/api/auth/session`:

1. **Check environment variables:**
   Make sure your `.env` file has:
   ```env
   DATABASE_URL="postgresql://nepal_user:nepal_password@localhost:5432/nepal_db?schema=public"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

2. **Restart the dev server:**
   ```bash
   # Stop the server (Ctrl+C) and restart
   npm run dev
   ```

3. **Verify database is running:**
   ```bash
   docker compose ps postgres
   ```

4. **Check if admin user exists:**
   ```bash
   npm run db:seed
   ```

## Dashboard Features

Once logged in, you can access:

- **Dashboard Overview** (`/admin`) - Statistics and recent activity
- **Packages** (`/admin/packages`) - Manage travel packages
- **Blog** (`/admin/blog`) - Manage blog posts
- **Bookings** (`/admin/bookings`) - View and manage bookings
- **Tags** (`/admin/tags`) - Manage tags

## Security Note

⚠️ **Important:** Change the default password in production!

You can create a new admin user through the database or update the existing one.

