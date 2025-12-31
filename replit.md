# FluxBank

A Web3 decentralized banking application built with Next.js and React.

## Overview

FluxBank is a crypto banking platform that allows users to:
- Borrow cryptocurrencies by locking Flux tokens as collateral
- Stake Flux tokens to earn yield
- Create instant wallets without seed phrases
- Deposit and withdraw assets

## Tech Stack

- **Framework**: Next.js 16
- **UI**: React 19, Tailwind CSS, Radix UI components
- **Styling**: Tailwind CSS with custom animations
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation

## Project Structure

```
app/           - Next.js app router pages
  app/         - App dashboard page
  page.tsx     - Landing page
  layout.tsx   - Root layout
  globals.css  - Global styles
components/    - React components
  ui/          - UI components (Button, Card, Input, etc.)
lib/           - Utility functions
public/        - Static assets and images
styles/        - Additional stylesheets
```

## Development

The application runs on port 5000 with:
```
npm run dev -- -p 5000 -H 0.0.0.0
```

## Deployment

Configured for autoscale deployment on Replit using:
- Build: `npm run build`
- Start: `npm run start -- -p 5000 -H 0.0.0.0`
