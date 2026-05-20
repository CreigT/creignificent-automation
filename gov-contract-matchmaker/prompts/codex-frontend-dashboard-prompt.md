# CODEX FRONTEND DASHBOARD PROMPT

Build the frontend dashboard for the Nationwide Gov Contract Matchmaker using Next.js, TailwindCSS, Supabase Auth, and SAM.gov integration.

Requirements:

## Stack
- Next.js 15
- TypeScript
- TailwindCSS
- Supabase
- Vercel deployment ready
- Mobile responsive

## Pages
Create these pages:

1. Landing Page
2. Dashboard
3. Login
4. Register
5. Saved Contracts
6. Contract Details
7. Account Settings

## Dashboard Features
- Search government contracts
- Filter by ZIP code
- Filter by NAICS
- Filter by certifications
- Filter by state
- Save opportunities
- View saved contracts
- Display deadlines
- Responsive contract cards
- AI explanation section

## Authentication
Use Supabase Auth:
- Email/password login
- Session persistence
- Protected dashboard routes
- User-specific saved opportunities

## SAM.gov Integration
Create reusable API utilities for:
- Pulling opportunities
- Searching by NAICS
- Filtering by state
- Deadline sorting
- Pagination support

## AI Contract Explainer
Create UI component:
- Contract summary
- Qualification explanation
- Submission guidance
- Risk warnings

## Components
Build reusable components:
- Navbar
- Sidebar
- ContractCard
- SearchFilters
- SavedButton
- AuthForm
- DashboardStats
- LoadingStates
- EmptyStates

## Styling
Style:
- Modern SaaS UI
- Clean government-tech appearance
- Dark/light mode ready
- Mobile responsive
- Accessible layout

## Database Tables
Prepare Supabase integration for:
- users
- saved_contracts
- contract_matches
- user_preferences

## Deployment
Project must be deployment-ready for:
- Vercel
- Supabase

## Folder Structure
/frontend
/components
/lib
/app
/hooks
/types
/styles

## Goal
Build a scalable SaaS frontend that transforms complex SAM.gov contract data into plain-English opportunities for U.S. small businesses.

Branding Footer:
Tc Creig • Copyright • Creignificent LLC • 2026
