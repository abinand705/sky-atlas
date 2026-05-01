# Skycast Atlas - Deployment Guide

Real-time weather forecasting with photorealistic sky simulations.

## Quick Start

### Local Development
```bash
# Set your OpenWeatherMap API key
$env:OPENWEATHERMAP_API_KEY = "your_api_key_here"

# Run the server
node server.js

# Open in browser
# http://localhost:3000/
```

---

## Deploy to Vercel (Recommended)

### 1. Create GitHub Repository
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/skycast-atlas.git
git push -u origin main
```

### 2. Deploy to Vercel
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import your GitHub repo
- Add environment variable:
  - Name: `OPENWEATHERMAP_API_KEY`
  - Value: `your_api_key`
- Click "Deploy"

Your app is now live at `https://skycast-atlas-{random}.vercel.app/`

---

## Deploy to Netlify

### 1. Push to GitHub (same as above)

### 2. Deploy to Netlify
- Go to [netlify.com](https://netlify.com)
- Click "New site from Git"
- Connect GitHub
- Select your repo
- Add environment variable in "Site settings → Build & deploy → Environment":
  - Name: `OPENWEATHERMAP_API_KEY`
  - Value: `your_api_key`
- Click "Deploy site"

Your app is now live at `https://skycast-atlas-{random}.netlify.app/`

---

## Getting an OpenWeatherMap API Key

1. Go to [openweathermap.org](https://openweathermap.org)
2. Sign up for a free account
3. Navigate to "API keys"
4. Copy your default API key
5. Use it in environment variables (never commit to code)

---

## File Structure

```
.
├── whether.html          # Main frontend (photorealistic UI)
├── server.js             # Local Node.js server (for dev)
├── api/
│   └── openweather.js    # Vercel serverless function
├── netlify/
│   └── functions/
│       └── openweather.js  # Netlify serverless function
├── vercel.json           # Vercel config
├── netlify.toml          # Netlify config
├── package.json          # Project metadata
└── .gitignore            # Git ignore rules
```

---

## Security

✅ API key is **never exposed** in client-side code
✅ Backend proxy keeps key secure
✅ Works on both Vercel and Netlify free tier
✅ No credit card required for most deployments

---

## Features

- 🌥️ Photorealistic sky simulations
- 🎨 8 weather themes (clear, cloudy, rainy, stormy, snowy, misty, sunset, night)
- 📍 Geolocation support with IP fallback
- 💾 Save favorite cities
- ⏰ Hourly and 5-day forecasts
- 📱 Fully responsive mobile UI
- ✨ Glassmorphic design system
