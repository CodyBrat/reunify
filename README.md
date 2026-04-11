# Reunify - Alumni Networking Platform


Reunify is a modern, full-stack alumni networking platform built with Next.js, TypeScript, and MongoDB. It connects current students with alumni for mentorship, job referrals, and community engagement.

## Features

- **User Authentication**: Secure login and registration for both students and alumni.
- **Dashboard**: Personalized dashboards for students and alumni.
- **Job Board**: Alumni can post job opportunities, and students can apply.
- **Referral System**: Streamlined referral process with status tracking.
- **Community Forum**: Discussion boards for sharing insights and asking questions.
- **Clean Architecture**: Implements Domain-Driven Design (DDD) principles with separate layers for Domain, Application, Infrastructure, and Presentation.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB (via Prisma)
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

```
reunify/
├── backend/          # Node.js/Express Backend
│   ├── src/
│   │   ├── domain/     # Business logic and entities
│   │   ├── application/  # Use cases and services
│   │   ├── infrastructure/ # Database, auth, middleware
│   │   └── presentation/ # Controllers and routes
│   ├── prisma/         # Prisma schema and migrations
│   └── package.json
├── frontend/         # Next.js Frontend
│   ├── app/          # Next.js App Router pages
│   ├── components/   # Reusable React components
│   ├── lib/          # Utilities and API clients
│   └── package.json
└── package.json      # Root package manager
```

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

### 1. Backend Setup

```bash
cd backend
npm install

# Generate Prisma client
npx prisma generate

# Start the server
npm run dev
```

The backend will start on `http://localhost:8080`.

### 2. Frontend Setup

```bash
cd frontend
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:3000`.

## Usage

1. Open [http://localhost:3000](http://localhost:3000) in your browser.
2. Register as a student or alumni.
3. Log in to access your dashboard.
4. Explore features like job boards, referrals, and community posts.

## License

ISC