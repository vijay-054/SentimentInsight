# Deployment Guide for SentimentInsight AI

This guide will help you deploy your SentimentInsight AI project to free hosting platforms.

## Prerequisites

- Node.js installed (for frontend)
- Python 3.8+ installed (for backend)
- Git installed
- Account on deployment platform (Heroku, Render, or Railway)

## Local Development

### 1. Setup Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=sentiment_db
CORS_ORIGINS=*
```

### 2. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 4. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn server:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:8000`.

## Production Deployment

### Option 1: Heroku (Free Tier)

Heroku offers free deployment with some limitations.

1. **Install Heroku CLI**
   - Download from [heroku.com](https://devcenter.heroku.com/articles/heroku-cli)

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create a New App**
   ```bash
   heroku create sentimentinsight-ai
   ```

4. **Add MongoDB Atlas (Free Tier)**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get your connection string
   - Add it as a config var:
   ```bash
   heroku config:set MONGO_URL="mongodb+srv://<username>:<password>@cluster.mongodb.net/sentiment_db?retryWrites=true&w=majority"
   ```

5. **Deploy**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push heroku main
   ```

6. **Open Your App**
   ```bash
   heroku open
   ```

### Option 2: Render (Free Tier)

Render offers free hosting for web services.

1. **Sign up at [render.com](https://render.com)**

2. **Create a MongoDB Atlas Account**
   - Follow the same steps as Heroku for MongoDB

3. **Create a Web Service**
   - Connect your GitHub repository
   - Select "Python" as the runtime
   - Set build command: `cd frontend && npm install && npm run build && cd ..`
   - Set start command: `uvicorn backend.server:app --host 0.0.0.0 --port $PORT`
   - Add environment variables:
     - `MONGO_URL`: Your MongoDB connection string
     - `DB_NAME`: sentiment_db
     - `CORS_ORIGINS`: *

4. **Deploy**
   - Render will automatically deploy when you push to GitHub

### Option 3: Railway (Free Tier)

Railway provides free hosting with easy setup.

1. **Sign up at [railway.app](https://railway.app)**

2. **Create a New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add MongoDB**
   - Click "Add Service"
   - Select "MongoDB"
   - Railway will handle the database setup

4. **Configure Environment Variables**
   - Railway will automatically set `MONGO_URL`
   - Add `DB_NAME=sentiment_db`
   - Add `CORS_ORIGINS=*`

5. **Deploy**
   - Railway will automatically build and deploy

### Option 4: Vercel + MongoDB Atlas (Free)

Vercel is great for frontend, but you'll need a separate backend hosting.

1. **Deploy Frontend to Vercel**
   - Sign up at [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will detect it's a Vite/React project
   - Configure build settings:
     - Build command: `cd frontend && npm install && npm run build`
     - Output directory: `frontend/dist`

2. **Deploy Backend to Render or Railway**
   - Follow the instructions above for backend deployment

3. **Update Environment Variables**
   - In Vercel, add `VITE_API_URL` pointing to your backend URL

## Environment Variables

Required for all deployments:

- `MONGO_URL`: MongoDB connection string
- `DB_NAME`: Database name (default: sentiment_db)
- `CORS_ORIGINS`: Allowed origins (default: *)
- `VITE_API_URL`: Frontend API URL (default: /api)

## Troubleshooting

### Build Fails

- Check that all dependencies are in `requirements.txt` and `package.json`
- Ensure Node.js and Python versions are compatible
- Check build logs for specific errors

### Database Connection Issues

- Verify your MongoDB connection string is correct
- Ensure your IP is whitelisted in MongoDB Atlas
- Check that the database user has proper permissions

### Frontend Not Loading

- Ensure the frontend build completed successfully
- Check that static files are being served correctly
- Verify CORS settings in the backend

## Monitoring

- **Heroku**: `heroku logs --tail`
- **Render**: Check the Logs tab in your dashboard
- **Railway**: View logs in the service dashboard

## Scaling

For production use with more users, consider:

- Upgrading to paid tiers for better performance
- Using a CDN for static assets
- Implementing caching
- Adding rate limiting
- Using a more powerful database

## Support

For issues specific to deployment platforms, check their documentation:
- [Heroku Docs](https://devcenter.heroku.com/)
- [Render Docs](https://render.com/docs)
- [Railway Docs](https://docs.railway.app/)
