# Finance Tracker

A full-stack personal finance management application built with Next.js 13, designed to help users track expenses, manage budgets, and visualize spending patterns.

## Why I Built This

I wanted to create a privacy-focused alternative to commercial finance apps where I have full control over my financial data. This project also gave me hands-on experience with the Next.js App Router and server-side authentication patterns.

## Key Features

- **Expense & Income Tracking** - Log transactions with categories, descriptions, and dates
- **Budget Management** - Set monthly spending limits per category
- **Visual Analytics** - Interactive charts showing spending patterns and trends
- **Secure Authentication** - Custom NextAuth implementation with credential-based login
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## Tech Stack

**Frontend:**
- Next.js 13 (App Router)
- React 18 with TypeScript
- Tailwind CSS + shadcn/ui components
- Recharts for data visualization

**Backend:**
- Next.js API Routes
- PostgreSQL database
- Prisma ORM
- NextAuth.js for authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (local or hosted)

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd finance-tracker
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create a `.env` file in the root directory:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/finance_tracker"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

4. Run database migrations
```bash
npx prisma migrate dev
```

5. Start the development server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the app.

## Database Schema

The app uses Prisma with the following main models:
- **User** - User accounts with hashed passwords
- **Expense** - Individual expense records with categories
- **Income** - Income tracking
- **Budget** - Monthly budget limits per category
- **Session** - NextAuth session management

## Deployment

This app is optimized for deployment on:
- **Vercel** (recommended for Next.js)
- **Railway** (includes PostgreSQL hosting)
- **Netlify** with Neon or Supabase for PostgreSQL

See `DEPLOYMENT.md` for detailed deployment instructions.

## Project Structure

```
├── app/                  # Next.js 13 app directory
│   ├── api/             # API routes
│   ├── auth/            # Authentication pages
│   ├── dashboard/       # Dashboard page
│   ├── expenses/        # Expense management
│   └── income/          # Income tracking
├── components/          # React components
│   ├── dashboard/       # Dashboard-specific components
│   ├── expenses/        # Expense forms and lists
│   └── ui/              # shadcn/ui components
├── lib/                 # Utility functions
│   ├── auth.ts          # NextAuth configuration
│   └── prisma.ts        # Prisma client instance
└── prisma/              # Database schema and migrations
```

## Features in Development

- [ ] Export data to CSV
- [ ] Recurring expense automation
- [ ] Multi-currency support
- [ ] Receipt photo uploads
- [ ] Budget recommendations based on spending patterns

## What I Learned

- Implementing secure authentication from scratch with NextAuth
- Managing database relationships with Prisma
- Building responsive data visualizations with Recharts
- Optimizing Next.js server components for better performance
- Handling form validation and error states in React

## License

MIT - Feel free to use this project for learning or personal use.

## Contact

Branden Smith - [Your contact info if you want]

---

Built with ❤️ using Next.js

