# StayWise - Property Rental Platform

A modern property rental platform built with Next.js, Express, and Prisma.

## 🏗️ Project Structure

This is a Turborepo monorepo with:

- **apps/web**: Next.js 15 frontend with React 19
- **apps/api**: Express.js backend API
- **packages/database**: Prisma ORM and database schemas
- **packages/schemas**: Shared Zod validation schemas
- **packages/types**: Shared TypeScript types

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Redis instance

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env

# Edit the .env files with your credentials

# Run database migrations
cd packages/database
npx prisma migrate dev
npx prisma generate

# Seed database (optional)
npm run seed

# Start development servers
cd ../..
npm run dev
```

The web app will be available at `http://localhost:3000` and the API at `http://localhost:8000`.

## 📦 Deployment

### Deploy to Vercel (Recommended for Web)

See the detailed deployment guides:

- 🎯 **[Quick Start Checklist](./VERCEL_CHECKLIST.md)** - Step-by-step deployment checklist
- 📖 **[Full Deployment Guide](./DEPLOYMENT.md)** - Comprehensive deployment documentation

### Quick Deploy Web App

1. Push code to GitHub
2. Import to Vercel
3. Set root directory: `apps/web`
4. Configure environment variables
5. Deploy!

For the API, we recommend **Railway** or **Render** due to background workers.

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework
- **React 19** - UI library
- **NextAuth.js** - Authentication
- **TanStack Query** - Data fetching
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components

### Backend

- **Express.js** - Web framework
- **Prisma ORM** - Database ORM
- **PostgreSQL** - Database
- **Redis** - Queue and caching
- **BullMQ** - Background jobs
- **JWT** - Authentication

### Services

- **Cloudinary** - Image storage
- **Resend** - Email service
- **Midtrans** - Payment gateway
- **Google Maps** - Location services

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start all apps in development mode
npm run build        # Build all apps for production
npm run start        # Start all apps in production mode

# Web app only
cd apps/web
npm run dev          # Start web in development
npm run build        # Build web for production
npm run start        # Start web in production

# API only
cd apps/api
npm run dev          # Start API in development
npm run build        # Build API for production
npm run start        # Start API in production

# Database
cd packages/database
npx prisma studio    # Open Prisma Studio
npx prisma migrate dev  # Run migrations
npm run seed         # Seed database
```

## 🔐 Environment Variables

See `.env.example` files in each package for required environment variables:

- `apps/web/.env.example` - Frontend environment variables
- `apps/api/.env.example` - Backend environment variables
- `packages/database/.env.example` - Database configuration

## 🧪 Testing

```bash
# Run tests (when available)
npm run test

# Type checking
npm run type-check
```

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT.md)
- [Vercel Deployment Checklist](./VERCEL_CHECKLIST.md)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Ensure builds pass: `npm run build`
4. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For deployment issues, refer to:

- [Troubleshooting Guide](./DEPLOYMENT.md#common-issues)
- [Vercel Checklist](./VERCEL_CHECKLIST.md#-troubleshooting)
