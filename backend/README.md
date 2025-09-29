# Sui Run Club Backend

Express.js server with TypeScript for the Sui Run Club application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run watch` - Watch mode for TypeScript compilation

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check endpoint

## Environment Variables

Create a `.env` file in the backend directory with:

```env
PORT=3001
NODE_ENV=development
LOG_LEVEL=info

# Auth.js
AUTH_SECRET=your_auth_secret_here

# Twitter OAuth
AUTH_TWITTER_ID=your_twitter_client_id
AUTH_TWITTER_SECRET=your_twitter_client_secret
```

- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Winston log level (error, warn, info, debug)
- `AUTH_SECRET` - Auth.js secret (generate with `npx auth secret`)
- `AUTH_TWITTER_ID` - Twitter OAuth client ID
- `AUTH_TWITTER_SECRET` - Twitter OAuth client secret

## Setup Instructions

### 1. Generate Auth Secret
```bash
npx auth secret
```

### 2. Twitter Authentication Setup
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app
3. Set callback URL to: `http://localhost:3001/auth/callback/twitter`
4. Copy Client ID and Secret to your `.env` file
