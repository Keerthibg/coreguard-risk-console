# CoreGuard Risk Review Console

A full-stack risk review console for inspecting supply-chain risk events, reviewing evidence, updating status, adding notes, and tracking audit history.

## Tech Stack

- Next.js App Router
- Prisma ORM
- SQLite database
- Mock authentication / role-based workflow

I used Next.js because it supports frontend pages and backend API routes in one project. Prisma with SQLite keeps the assessment simple, deterministic, and easy to run locally.

## Local Setup

```bash
npm install
npx prisma generate
npm run seed
npm run dev