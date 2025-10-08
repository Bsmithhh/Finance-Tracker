# Environment Variables Setup

This document explains how to set up the required environment variables for the Finance Tracker application.

## Required Environment Variables

### 1. DATABASE_URL
The connection string for your database.

**For PostgreSQL (recommended for production):**
```
DATABASE_URL="postgresql://username:password@host:5432/database_name?schema=public"
```

**For SQLite (local development only):**
```
DATABASE_URL="file:./prisma/dev.db"
```

### 2. NEXTAUTH_URL
The base URL of your application.

**For local development:**
```
NEXTAUTH_URL="http://localhost:3000"
```

**For production on Vercel:**
This is automatically set by Vercel, but you can override it if needed.

### 3. NEXTAUTH_SECRET
A secret key used by NextAuth for encryption.

Generate one using:
```bash
openssl rand -base64 32
```

Example:
```
NEXTAUTH_SECRET="your-generated-secret-key-here"
```

## Setting up on Vercel

### Step 1: Set Up a PostgreSQL Database

You have several options:

1. **Vercel Postgres** (Recommended)
   - Go to your Vercel project dashboard
   - Click on the "Storage" tab
   - Create a new Postgres database
   - Vercel will automatically set the `DATABASE_URL` for you

2. **Neon** (Free PostgreSQL)
   - Sign up at https://neon.tech
   - Create a new database
   - Copy the connection string

3. **Supabase** (Free PostgreSQL)
   - Sign up at https://supabase.com
   - Create a new project
   - Go to Settings > Database > Connection String
   - **Important**: You need TWO connection strings:
     - **Transaction mode** (port 5432) - For migrations (set as `DIRECT_DATABASE_URL`)
     - **Session mode** (port 6543) - For runtime queries (set as `DATABASE_URL`)
   - Copy both connection strings

4. **Railway** (PostgreSQL with free tier)
   - Sign up at https://railway.app
   - Create a new PostgreSQL database
   - Copy the connection string

### Step 2: Add Environment Variables to Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Add the following variables:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `DATABASE_URL` | Your database connection string | Production, Preview, Development |
   | `DIRECT_DATABASE_URL` | Direct connection URL (Supabase only, port 5432) | Production, Preview, Development |
   | `NEXTAUTH_SECRET` | Your generated secret | Production, Preview, Development |
   | `NEXTAUTH_URL` | Your production URL (optional) | Production |

4. Click **Save**

### Step 3: Run Database Migrations

After setting up your environment variables and deploying to Vercel:

1. Install Vercel CLI locally:
   ```bash
   npm i -g vercel
   ```

2. Pull your environment variables:
   ```bash
   vercel env pull
   ```

3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

Or you can run migrations directly on Vercel by adding a custom script or using the Vercel dashboard's terminal.

## Local Development Setup

1. Create a `.env.local` file in the root directory:
   ```bash
   touch .env.local
   ```

2. Add your environment variables:
   ```
   DATABASE_URL="file:./prisma/dev.db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="generate-a-secret-key"
   ```

3. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Troubleshooting

### Build fails with "DATABASE_URL not found"
- Make sure the build script doesn't include `prisma migrate deploy`
- The current `package.json` build script should only be: `prisma generate && next build`

### Runtime errors about missing DATABASE_URL
- Ensure you've set the `DATABASE_URL` in Vercel's environment variables
- Redeploy your application after setting environment variables

### Authentication issues
- Make sure `NEXTAUTH_SECRET` is set and is the same across all deployments
- Check that `NEXTAUTH_URL` matches your deployment URL

## Quick Start Checklist

- [ ] Choose a database provider (Vercel Postgres, Neon, Supabase, or Railway)
- [ ] Create a new database
- [ ] Copy the connection string
- [ ] Add `DATABASE_URL` to Vercel environment variables
- [ ] Generate and add `NEXTAUTH_SECRET` to Vercel environment variables
- [ ] Run `npx prisma migrate deploy` to set up database tables
- [ ] Redeploy your application on Vercel

