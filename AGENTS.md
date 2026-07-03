<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Rishte Forever IDE Context

## Project Shape
- App: Rishte Forever matrimonial site.
- Stack: Next.js 16 App Router, React 19, TypeScript, Prisma, MongoDB Atlas, Auth.js v5, Razorpay, vanilla CSS.
- Project root: `gulzar`.
- Source: `src/`.
- Routes: `src/app/`.
- Components: `src/components/`.
- Shared helpers: `src/lib/`.
- Prisma schema: `prisma/schema.prisma`.
- Product/project decisions: `PROJECT_NOTES.md`.

## Commands
- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Seed data: `npm run seed`

## Working Rules
- Preserve the existing visual direction and business rules in `PROJECT_NOTES.md`.
- Keep changes scoped and avoid unrelated refactors.
- Do not commit or expose `.env` values.
- Run `npm run lint` and `npm run build` after meaningful code changes when practical.
- For Next.js behavior, prefer local docs under `node_modules/next/dist/docs/` because this project uses Next.js 16.
