# Nationwide Gov Contract Matchmaker Architecture

## System Overview

Frontend:
- Next.js
- TailwindCSS
- Vercel Deployment

Backend:
- Supabase PostgreSQL
- Next.js API Routes
- SAM.gov API Integration
- Gemini API Integration

Authentication:
- Supabase Auth
- Email/password login
- Saved opportunities

Core Features:
- ZIP-based filtering
- NAICS mapping
- Certification matching
- AI contract explanations
- Saved contracts dashboard
- Email alerts

## Folder Structure

frontend/
apps-script/
prompts/
docs/

## Planned Database Tables

users
saved_contracts
contract_matches
contract_cache
user_preferences

## Deployment Stack

Frontend Hosting:
- Vercel

Database:
- Supabase

AI:
- Gemini 1.5 Flash

Government Data:
- SAM.gov API

## Future Roadmap

Phase 1:
- Google Stack MVP

Phase 2:
- SaaS conversion

Phase 3:
- White-label PTAC deployments

Phase 4:
- AI proposal drafting
- AI bid analysis
- Opportunity scoring
