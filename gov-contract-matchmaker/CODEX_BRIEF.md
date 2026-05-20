# CODEX BRIEF — Nationwide Gov Contract Matchmaker

## Project Name
Nationwide Gov Contract Matchmaker

## One-Line Mission
Build a Google-native MVP that helps U.S. small businesses find government contracts they may qualify for, using SAM.gov data, NAICS mapping, certification filters, Gemini explanations, and Gmail output.

## Current MVP Stack
- Google Sites = public front door
- Google Forms = user intake
- Google Sheets = lightweight database
- Apps Script = automation brain
- SAM.gov API = contract source
- Gemini API = AI explanation engine
- GmailApp = email delivery

## User Flow
1. User lands on Google Site.
2. User submits Google Form.
3. Form response lands in Google Sheet.
4. Apps Script reads ZIP, service type, and certifications.
5. Script maps service type to NAICS codes.
6. Script filters cached SAM.gov opportunities.
7. Gemini explains matches in plain English.
8. Gmail sends user a digest of the top contract matches.

## MVP Inputs
Form fields:
- Business Name
- Contact Email
- ZIP Code
- What do you do?
- Certifications

Dropdown services:
- Janitorial
- Construction
- IT
- Professional Services
- Manufacturing

Certifications:
- 8(a)
- HUBZone
- WOSB
- SDVOSB
- Small Business
- None

## MVP Sheets
- User Intake
- Master Contracts
- Matches
- Settings
- Logs

## Settings Keys
- SAM_API_KEY
- GEMINI_API_KEY
- OWNER_EMAIL
- DEFAULT_RADIUS

## MVP States
Start with:
- CA
- TX
- LA

After testing, expand to all 50 states.

## Core NAICS Mapping
Janitorial:
- 561720

Construction:
- 236220
- 237310
- 238990

IT:
- 541511
- 541512
- 541519

Professional Services:
- 541611
- 541618
- 541990

Manufacturing:
- 332999
- 333999
- 339999

## Gemini Role
Gemini acts like a PTAC counselor. It does not promise the user will win. It explains whether they may qualify, what the contract is, how to respond, and what to watch out for.

Required Gemini output format:

You may qualify:
What it is:
How to respond:
Watch out for:

## Codex Objective
Turn this concept into a clean repo-ready project packet and then optionally evolve it into a production SaaS.

## Phase 1 — Google Stack MVP
Create clean documentation and Apps Script files for:
- SAM.gov daily pull
- Google Form submit trigger
- Contract matching
- Gemini explanation
- Gmail digest
- Logs and settings

## Phase 2 — Full SaaS Conversion
Later rebuild into:
- Next.js frontend
- Supabase or PostgreSQL database
- User authentication
- Saved contracts
- Deadline tracking
- Admin dashboard
- Daily email alerts
- Gemini explanations
- Vercel deployment

## Positioning
This is the free “TurboTax for SAM.gov” — plain-English government contract discovery for small businesses.

## Branding
Tc Creig • Copyright • Creignificent LLC • 2026
