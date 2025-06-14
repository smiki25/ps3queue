# 🚀 Deployment Guide - PS3Queue on Vercel

This guide will help you deploy your PS3Queue app to Vercel for free hosting.

## Prerequisites

- A [Vercel account](https://vercel.com) (free)
- Your RAWG API key from [rawg.io/apidocs](https://rawg.io/apidocs)
- Your code pushed to GitHub, GitLab, or Bitbucket

## Quick Deploy (Recommended)

### Option 1: Deploy from GitHub

1. **Push your code to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with your GitHub account
   - Click "New Project"
   - Import your PS3Queue repository

3. **Configure Environment Variables**
   - In the deployment settings, add environment variable:
     - Name: `REACT_APP_RAWG_KEY`
     - Value: Your RAWG API key
   - Click "Deploy"

4. **Done!** Your app will be live at `https://your-project-name.vercel.app`

### Option 2: Deploy with Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Set up environment variable when asked:
     - `REACT_APP_RAWG_KEY=your_api_key_here`

4. **Production Deploy**
   ```bash
   vercel --prod
   ```

## Environment Variables Setup

Your app needs the RAWG API key to work. Set it up in Vercel:

1. Go to your project dashboard on Vercel
2. Click "Settings" → "Environment Variables"
3. Add:
   - **Name**: `REACT_APP_RAWG_KEY`
   - **Value**: Your API key from rawg.io
   - **Environments**: Production, Preview, Development

## Custom Domain (Optional)

1. In your Vercel project settings
2. Go to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Automatic Deployments

Once connected to GitHub:
- Every push to `main` branch = automatic production deployment
- Every pull request = automatic preview deployment
- Zero configuration needed!

## Performance Optimizations

Your app is already optimized for production with:
- ✅ Static asset caching (1 year)
- ✅ Gzip compression
- ✅ CDN distribution
- ✅ Mobile-responsive design
- ✅ Efficient API caching

## Monitoring

Monitor your app's performance:
- **Analytics**: Vercel dashboard shows visitor stats
- **Functions**: Monitor API usage and performance
- **Logs**: Real-time deployment and runtime logs

## Troubleshooting

### Common Issues:

1. **Build fails**: Check that all dependencies are in `package.json`
2. **API key not working**: Ensure environment variable is set correctly
3. **404 on refresh**: The `vercel.json` file handles this (already included)
4. **Slow loading**: Enable Vercel's Edge Network (automatic)

### Support:
- [Vercel Documentation](https://vercel.com/docs)
- [React Deployment Guide](https://create-react-app.dev/docs/deployment/)

## Cost

- **Free tier includes**:
  - 100GB bandwidth/month
  - 100 deployments/day
  - Custom domains
  - SSL certificates
  - Perfect for personal projects!

---

🎮 **Your PS3Queue app will be live and accessible worldwide in minutes!** 