# Heroku Deployment Guide

This application has been configured for deployment on Heroku. Follow these steps to deploy:

## Prerequisites

1. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Create a Heroku account if you don't have one

## Deployment Steps

### 1. Login to Heroku
```bash
heroku login
```

### 2. Create a Heroku Application
```bash
heroku create your-app-name
```
Replace `your-app-name` with your desired application name.

### 3. Add Heroku Remote (if not automatically added)
```bash
git remote add heroku https://git.heroku.com/your-app-name.git
```

### 4. Set Environment Variables (if needed)
```bash
heroku config:set NODE_ENV=production
heroku config:set NPM_CONFIG_PRODUCTION=false
```

Add any other environment variables your application needs:
```bash
heroku config:set NEXT_PUBLIC_API_URL=https://your-api-url.com
```

### 5. Deploy to Heroku
```bash
git push heroku heroku-deployment:main
```

### 6. Open Your Application
```bash
heroku open
```

## Configuration Files

- **Procfile**: Tells Heroku how to start the application
- **app.json**: Contains metadata about the app for Heroku
- **package.json**: Updated with Heroku-specific scripts and Node.js version requirements

## Key Changes Made for Heroku Deployment

1. **Updated start script**: Now uses `$PORT` environment variable
2. **Added heroku-postbuild script**: Runs the build process on Heroku
3. **Specified Node.js version**: Ensures compatibility
4. **Removed Vercel-specific configurations**:
   - Removed Vercel blob storage image references
   - Removed v0.dev generator metadata
   - Cleaned up image optimization settings
   - Removed .vercel from gitignore

## Troubleshooting

### Build Issues
- Check the Heroku build logs: `heroku logs --tail`
- Ensure all dependencies are listed in package.json
- Verify Node.js version compatibility

### Runtime Issues
- Check application logs: `heroku logs --tail`
- Verify environment variables are set correctly: `heroku config`
- Ensure the PORT environment variable is being used correctly

## Local Development

To run the application locally:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at `http://localhost:3000`.
