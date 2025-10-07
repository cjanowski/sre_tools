# 🚀 Deployment Guide

## Quick Deploy to Vercel

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/sre_tools.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"

## Alternative: Vercel CLI

```bash
npm install -g vercel
cd sre_tools
vercel --prod
```

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Configure in Vercel dashboard or use the UI to set:
- Elasticsearch URL
- Kibana URL  
- Username/Password
- Webhook URL (optional)

## Build Command

Vercel automatically uses:
```bash
npm run build
```

## Troubleshooting

### Build Fails
- Check TypeScript errors: `npm run build`
- Verify dependencies: `npm install`

### Runtime Errors
- Check Vercel function logs
- Verify API endpoints are accessible
- Ensure CORS is enabled on Elasticsearch

### Connection Issues
- Verify Elasticsearch URL is correct
- Check authentication credentials
- Ensure network access to Elastic cluster

## Production Checklist

- ✅ TypeScript compiles without errors
- ✅ All dependencies installed
- ✅ Environment variables configured
- ✅ Elasticsearch cluster accessible
- ✅ CORS enabled if needed
- ✅ Authentication credentials valid
