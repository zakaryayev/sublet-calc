# Cloudflare Worker Setup

This directory contains the Cloudflare Worker configuration to proxy `/sublet-calculator` requests to your Vercel deployment.

## Setup Steps

1. **In Cloudflare Dashboard**
   - Go to Workers & Pages → Create Worker
   - Copy-paste the contents of `worker.js` as a Module worker
   - Update the `backendHost` variable to match your actual Vercel deployment URL

2. **Deploy the Worker**
   - Click "Save and Deploy"

3. **Add Routes**
   - In the worker settings, go to "Triggers" → "Routes"
   - Add the following routes:
     - `zakaryayev.com/sublet-calculator*`
     - `www.zakaryayev.com/sublet-calculator*` (if you use www)

4. **DNS Configuration**
   - Ensure your DNS root record for `zakaryayev.com` is orange-cloud proxied in Cloudflare
   - The worker will only trigger for proxied requests

## How It Works

- The worker intercepts requests to `/sublet-calculator` and its subpaths
- It forwards these requests to your Vercel deployment
- All other requests pass through unchanged
- Automatic redirect from `/sublet-calculator` to `/sublet-calculator/` for proper routing

## Testing

After setup, test the following URLs:
- `https://zakaryayev.com/sublet-calculator/` (should load the app)
- `https://zakaryayev.com/sublet-calculator/health` (should return JSON health check)

## Updating the Backend Host

When you deploy to Vercel, update the `backendHost` variable in `worker.js` to match your actual Vercel URL (e.g., `your-app-name.vercel.app`).
