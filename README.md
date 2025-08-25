# Simple Job Board

A fullstack starter project built with **Next.js (App Router)**, **Supabase** (Database + Auth), and **Tailwind CSS**, deployed on **Vercel**.

👉 **[Live Demo](https://simple-job-board-wheat.vercel.app/)**  
👉 **[GitHub Repository](https://github.com/MHuseinJ/simple-job-board)**

---

## 🛠 Tech Stack

- **Next.js (App Router, TypeScript)** — frontend framework with React Server Components.
- **Supabase** — PostgreSQL database + authentication with Row Level Security.
- **Tailwind CSS** — utility-first styling.
- **Headless UI + Heroicons** — accessible, unstyled UI primitives & icons.
- **Deployment** — hosted on Vercel.

---

## ✨ Features

- Magic link authentication (email-based login).
- Protected routes (`/job`, `/job/create`, `/dashboard`).
- CRUD for Jobs:
  - Create, edit, delete jobs.
  - Job list with pagination & filters (by type, search, company).
  - Job detail page.
- Profiles linked to companies (from `profiles` table).
- Responsive UI with Headless UI components.

---

## 📂 Project Structure

```bash
src/
├── app/
│   ├── job/             # Job pages (list, create/edit, detail)
│   ├── auth/            # Auth pages & callback
│   ├── api/             # API routes (jobs, auth)
│   └── layout.tsx       # Root layout with Navbar
├── components/          # Reusable components (Navbar, forms)
├── contexts/            # Auth context provider (user session state)
├── lib/                 # Supabase client, helpers
└── styles/              # Tailwind styles
```

## 🚀 Getting Started

### 1. Supabase Setup

1. Create a project in [Supabase](https://supabase.com/).
2. Copy **Project URL** and **Anon Key**.
3. In **Auth → URL Configuration**:
  - Site URL: `http://localhost:3000`
  - Additional Redirects: `http://localhost:3000/auth/callback`
  - (After deploy) add Vercel URLs like `https://your-app.vercel.app/auth/callback`.
4. Run the schema on migration.sql to create tables and policies

### 2. Local Setup
```
git clone https://github.com/MHuseinJ/simple-job-board.git
cd simple-job-board

npm install

# Copy env vars
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_SERVICE_KEY, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, NEXT_PUBLIC_SITE_URL

npm run dev
```
### 3. Deploy on Vercel

1. Push your repo to GitHub.
2. Import the project into Vercel
3. Add environment variables in Vercel → Project Settings → Environment Variables:
   * NEXT_PUBLIC_SUPABASE_URL
   * NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
   * NEXT_SERVICE_KEY
   * NEXT_PUBLIC_SITE_URL (your Vercel domain)
4. Deploy! Vercel will build & serve automatically.

## 🔎 Architecture Overview

- Frontend: Next.js App Router with server and client components.
- Auth: Supabase OTP magic links. Sessions stored in cookies, managed via @supabase/ssr and React context (AuthContext).
- API Layer: Next.js route handlers under /api for CRUD operations, respecting RLS.
- Database: Supabase Postgres with RLS.

## Tables

- profiles — stores company/user info.
- jobs — job postings, linked to profiles.

## 🧭 What would you improve if given more time?

* Better error handling: unify API error responses and display user-friendly messages.
* UI/UX polish: add skeleton loaders, validations, and shadcn/ui components.
* Testing: implement integration tests with Playwright or Cypress.
* Authorization: refine RLS policies (roles, admins, more granular access).
* Performance: use keyset pagination for large datasets.
* CI/CD: add GitHub Actions for linting, testing, preview deploys.