# Meta Ads Automation

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/thhteamspace-6445s-projects/v0-meta-ads-automation)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/Xv0FMRVNT91)

## Overview

This is a Meta Ads Automation application that helps users analyze and create Facebook/Instagram ads. The app integrates with n8n webhooks to fetch ad data and generate content.

## Features

- **Landing Page**: Welcome screen with app introduction
- **Input Form**: Collect user requirements for ad analysis
- **Processing Screen**: Shows loading state while fetching data
- **Results Page**: Displays fetched ads with selection capability
- **Feedback Page**: Content creation and user feedback collection
- **Webhook Integration**: Connects to n8n for data processing

## Deployment Status

✅ **Ready for Vercel Deployment**

### Pre-deployment Checklist
- [x] Dependencies installed and up to date
- [x] TypeScript compilation successful
- [x] ESLint configuration fixed
- [x] Production build successful
- [x] Webhook endpoints verified (Status 200)
- [x] Vercel configuration optimized
- [x] Security headers configured

## Deployment

Your project is live at:

**[https://vercel.com/thhteamspace-6445s-projects/v0-meta-ads-automation](https://vercel.com/thhteamspace-6445s-projects/v0-meta-ads-automation)**

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## Webhook Configuration

The app uses two webhook endpoints:
- **METAADS**: `https://n8n.srv812138.hstgr.cloud/webhook/METAADS`
- **CONTENT_CREATION**: `https://n8n.srv812138.hstgr.cloud/webhook/CONTENT_CREATION_PIPELINE`

Both endpoints are verified and accessible.

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/Xv0FMRVNT91](https://v0.app/chat/projects/Xv0FMRVNT91)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository