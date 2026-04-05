# 📸 Polaroid Stack

A scroll-driven polaroid stacking website built with React + Vite. As you scroll, polaroid photos drop in one by one and stack on top of each other.

## 🚀 Deploy to Vercel

### Option A — Vercel CLI (fastest)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Vercel CLI (if you haven't):
   ```bash
   npm i -g vercel
   ```

3. Deploy:
   ```bash
   vercel
   ```
   Follow the prompts. Vercel auto-detects Vite and configures everything.

### Option B — GitHub + Vercel Dashboard

1. Push this project to a GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   gh repo create polaroid-stack --public --push
   ```
   *(or create the repo on github.com and push manually)*

2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repo
4. Click **Deploy** — Vercel auto-detects Vite, no config needed

## 🛠 Local Development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`

## ✏️ Customization

Edit `src/PolaroidStack.jsx`:

- **Images**: Update the `POLAROIDS` array with your own Unsplash URLs or local images
- **Captions**: Change the `caption` field on each polaroid
- **Rotation**: Adjust `rotation` values (degrees) for each card's tilt
- **Scroll speed**: Change `SCROLL_PER_CARD` (default 600px between reveals)
