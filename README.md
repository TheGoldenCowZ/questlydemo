# Questly Demo

Interactive phone demo of **Questly** — a mobile quest game that turns Zagreb into a living map of real-world challenges.

Kids pick a quest, go outside, snap a photo for AI verification, and earn tokens for local rewards. Parents get a simple activity tracker.

## Try it locally

Open `index.html` in a browser, or serve the folder:

```bash
cd demo
python3 -m http.server 8080
```

Then visit http://localhost:8080

- **Desktop:** phone emulator frame  
- **Phone:** full-screen app (best for live demos)

## Deploy free on GitHub Pages

1. Create a new repo (e.g. `questly-demo`)
2. Push the contents of this `demo/` folder to the repo root (or keep them in `/docs`)
3. GitHub → **Settings** → **Pages** → Source: **Deploy from a branch** → `main` / root (or `/docs`)
4. Share the Pages URL — works on phones and laptops

### Quick push from this folder

```bash
cd demo
git init
git add .
git commit -m "Add Questly interactive demo"
gh repo create questly-demo --public --source=. --remote=origin --push
# Then enable Pages in the repo settings (branch: main, folder: /)
```

## Demo flow

1. **Start exploring** → browse Zagreb quests  
2. Open a quest → **I'm here — snap photo**  
3. Tap the shutter → AI verification (simulated) → earn tokens  
4. **Rewards** tab → redeem with local partners  
5. **Family** tab → parent weekly activity view  

Brand colors match the Questly pitch deck (navy / coral / gold).
