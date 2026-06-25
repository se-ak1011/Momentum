# Momentum (Expo SDK 56)

Momentum is a mobile app for solo consultants, coaches, and small psychology practices to reduce onboarding friction, improve follow-up, and keep clients engaged between sessions.

## Stack
- Expo SDK 56 + React Native + TypeScript
- Expo-managed workflow
- In-app service abstractions for auth, onboarding, clients, sessions, tasks, reminders, and plans
- Jest + eslint + Prettier

## MVP features in this scaffold
- Auth flow (email/password plus magic-link placeholder)
- Onboarding setup (provider profile, business type, branding, workflow)
- Client management (create, edit, archive, search)
- Intake form templates and custom questions
- Sessions (notes, summaries, next steps)
- Tasks/reminders and follow-up status
- Dashboard metrics (active clients, due tasks, overdue follow-ups, churn-risk flags)
- Billing-ready plan model (Stripe price id placeholder)
- Environment-based configuration and privacy-minded sensitive data isolation model

## Quick start
1. Install Node.js `22.18.0` (or latest Node 22.x stable).
2. Install dependencies:
   ```bash
   npm ci
   ```
3. Copy environment template:
   ```bash
   cp .env.example .env
   ```
4. Run the app:
   ```bash
   npm run start
   ```

## Scripts
- `npm run start` — Expo dev server
- `npm run android` — run on Android
- `npm run ios` — run on iOS
- `npm run web` — run web preview
- `npm run lint` — eslint
- `npm run test` — jest
- `npm run typecheck` — TypeScript no-emit check
- `npm run ci` — lint + test + typecheck

## Build / CI
- `eas.json` includes development, preview, and production profiles.
- `codemagic.yaml` at repository root includes install, lint, test, and Android/iOS export steps.
- Keep secrets in Codemagic environment variables (never commit secrets).

## Notes
- This scaffold intentionally keeps backend details abstract and ready to connect to real services.
- Sensitive client data is isolated in a separate in-memory structure to support stricter storage controls later.
