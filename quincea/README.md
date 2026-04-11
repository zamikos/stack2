# XV Años — Sofía Becerra Martínez

A beautiful Quinceañera invitation website built with Next.js and Tailwind CSS.

## Deploy to Vercel

### Option 1: Git Deploy (recommended)
1. Push this folder to a GitHub/GitLab/Bitbucket repo
2. Go to [vercel.com](https://vercel.com) and click "New Project"
3. Import your repo — Vercel auto-detects Next.js
4. Click "Deploy" — done!

### Option 2: Vercel CLI
```bash
npm install -g vercel
cd quincea
npm install
vercel
```

## Local Development
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

## Mobile Notes
- Uses `100dvh` (dynamic viewport height) for proper mobile browser chrome handling
- All touch targets are minimum 44px
- Navbar scrolls horizontally on small screens
- Font sizes scale down gracefully on mobile
- Images lazy-load for performance
