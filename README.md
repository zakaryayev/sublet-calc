# Sublet Profit Calculator

A production-ready Next.js application that calculates rental subletting scenarios by auto-filling one unknown variable among rent, price per room, reserved rooms, target profit, and total rooms.

## Features

- **Smart Calculator**: Automatically solves for any one unknown variable (R, P, S, K, N)
- **Real-time Results**: Instant calculations with profit analysis and target validation
- **URL State Management**: Shareable URLs that preserve calculator state
- **Responsive Design**: Clean, modern UI built with TailwindCSS
- **Type Safety**: Full TypeScript implementation with strict mode
- **Comprehensive Testing**: Vitest test suite covering all calculation scenarios

## Variables

- **R**: Monthly rent + all expenses (€)
- **P**: Average monthly rent per rentable room (€)
- **S**: Rooms reserved for you (integer)
- **K**: Target monthly profit after expenses (€)
- **N**: Total number of rooms in property (integer)

## Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone or navigate to the project directory
cd sublet-calc

# Install dependencies
pnpm install
# or
npm install
```

### Development

```bash
# Start development server
pnpm dev
# or  
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build

```bash
# Build for production
pnpm build
# or
npm run build

# Start production server
pnpm start
# or
npm start
```

### Testing

```bash
# Run tests
pnpm test
# or
npm test

# Watch mode
pnpm test:watch
# or
npm run test:watch
```

## Usage Examples

### Example 1: Find Required Rooms (N)
- Monthly rent: €3,500
- Price per room: €725
- Reserved rooms: 2
- Target profit: €1,500
- **Result**: Need 9 total rooms (profit: €1,575)

**Shareable URL**: `http://localhost:3000/?R=3500&P=725&S=2&K=1500&unknown=N`

### Example 2: Find Required Price per Room (P)
- Monthly rent: €3,500
- Total rooms: 8
- Reserved rooms: 2
- Target profit: €1,500
- **Result**: Need €833.33 per room

**Shareable URL**: `http://localhost:3000/?R=3500&S=2&K=1500&N=8&unknown=P`

### Example 3: Higher Rent Scenario
- Monthly rent: €4,500
- Price per room: €725
- Reserved rooms: 2
- Target profit: €1,500
- **Result**: Need 11 total rooms (profit: €2,025)

**Shareable URL**: `http://localhost:3000/?R=4500&P=725&S=2&K=1500&unknown=N`

## Technical Architecture

### Core Logic (`lib/calc.ts`)
- Pure functions for all calculations
- Zod schema validation
- Comprehensive error handling
- Money formatting utilities

### UI Components (`components/ui/`)
- Reusable, accessible components
- Consistent styling with TailwindCSS
- TypeScript interfaces for all props

### Main Application (`app/page.tsx`)
- Client-side calculator with React hooks
- URL state synchronization
- Real-time form validation
- Responsive layout

## Calculation Formulas

When exactly one variable is unknown:

- **N unknown**: `N = ceil(S + (R + K) / P)`
- **P unknown**: `P = (R + K) / (N - S)` (requires N - S > 0)
- **R unknown**: `R = (N - S) * P - K`
- **S unknown**: `S = floor(N - (R + K) / P)` (minimum 0)
- **K unknown**: `K = (N - S) * P - R`

### Rounding Policy
- **N (total rooms)**: Rounded **up** to ensure profit ≥ target
- **S (reserved rooms)**: Rounded **down** when derived, with warning

## Project Structure

```
sublet-calc/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout with SEO
│   └── page.tsx             # Main calculator page
├── components/ui/           # Reusable UI components
│   ├── alert.tsx
│   ├── badge.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── field.tsx
│   ├── number-input.tsx
│   └── radio-group.tsx
├── lib/
│   ├── __tests__/
│   │   └── calc.test.ts     # Test suite
│   └── calc.ts              # Core calculation logic
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Quality Assurance

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended rules
- **Prettier**: Consistent code formatting
- **Testing**: Comprehensive vitest test suite
- **SEO**: Meta tags, Open Graph, Twitter cards

## Development Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm test         # Run tests
pnpm test:watch   # Run tests in watch mode
```

## Deployment

### Deploy on Vercel

1. **Connect Repository**
   - Connect the `zakaryayev/sublet-calc` repository to Vercel
   - Framework will auto-detect as Next.js
   - No special environment variables needed

2. **Verify Deployment**
   - After deployment, note your Vercel host (e.g., `sublet-calc.vercel.app`)
   - Test that `/sublet-calculator/` works correctly
   - Verify health check at `/sublet-calculator/health`

### Cloudflare Worker Proxy

To serve the app at `zakaryayev.com/sublet-calculator`:

1. **Deploy Cloudflare Worker**
   - Go to Cloudflare Dashboard → Workers & Pages → Create Worker
   - Copy-paste contents from `cloudflare/worker.js` as a Module worker
   - Update `backendHost` to your actual Vercel URL
   - Deploy the worker

2. **Add Routes**
   - In worker settings → Triggers → Routes, add:
     - `zakaryayev.com/sublet-calculator*`
     - `www.zakaryayev.com/sublet-calculator*` (if using www)

3. **DNS Configuration**
   - Ensure DNS root record is orange-cloud proxied in Cloudflare

For detailed setup instructions, see `cloudflare/README.md`.

### Why basePath?

The `basePath: '/sublet-calculator'` configuration ensures:
- All assets (`_next/*`) are properly prefixed
- Internal routing works behind reverse proxy
- No hardcoded absolute paths break the subpath deployment

## Browser Support

- Modern browsers with ES2020+ support
- Mobile responsive design
- Accessible keyboard navigation

## License

This project is built for demonstration purposes. Feel free to use and modify as needed.

