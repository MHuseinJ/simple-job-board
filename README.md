# simple-job-board
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Supa Starter — Next.js (App Router) + Supabase + Tailwind

A minimal boilerplate using **Next.js App Router**, **Supabase (DB + Auth)**, and **Tailwind CSS**, deployed to **Vercel**.

## Tech Stack

- Next.js (App Router, TypeScript)
- Supabase (Postgres, Auth, RLS)
- Tailwind CSS
- Deployed on Vercel

## Features

- Email magic link + optional OAuth (GitHub/Google)
- Protected route example (`/dashboard`)
- `profiles` table with RLS and auto-create trigger
- Minimal, accessible UI

## Getting Started

### 1) Supabase Setup

- Create a project at Supabase.
- Copy **Project URL** and **anon key**.
- In **Auth → URL Configuration**, add:
    - Site URL: `http://localhost:3000` (dev)
    - Additional Redirects: `http://localhost:3000/auth/callback`
- (After deploy) add the Vercel URLs too.
- Run the SQL in `/supabase.sql` or the snippet in this README to create `profiles` and RLS policies.

### 2) App Setup

```bash
npm install
cp .env.local.example .env.local
# Fill NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev


```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```