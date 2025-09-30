# 🏃‍♂️ Sui Run Club

A Next.js application for minting SBT (Soul Bound Tokens) NFTs on the Sui blockchain with Twitter authentication.

## ✨ Features

- **User Authentication**: Twitter/X OAuth integration
- **Blockchain Integration**: Sui NFT minting with PTB
- **Modern UI**: DaisyUI components with smooth animations
- **Form Validation**: Multi-step form with validation

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <your-repo>
cd sui-run-club
npm install
```

### 2. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env.local
```

### 3. Configure Environment Variables
Update your `.env.local` file with:

#### Twitter OAuth:
```env
TWITTER_CLIENT_ID="your-twitter-client-id"
TWITTER_CLIENT_SECRET="your-twitter-client-secret"
```

#### Sui Blockchain:
```env
SUI_PACKAGE_ID="0x1234567890abcdef..."
USER_SECRET_KEY="suiprivkey1..."
SUI_NUMBER_TABLE_ID="0x..."
SUI_ADDRESS_TABLE_ID="0x..."
```

### 4. Start Development
```bash
npm run dev
```

## 📁 Project Structure

```
sui-run-club/
├── app/
│   ├── api/
│   │   └── mint/route.ts        # NFT minting API
│   ├── auth/
│   └── layout.tsx
├── components/
│   └── StepForm.tsx            # Main form component
├── lib/
│   ├── sui.ts                  # Blockchain integration
│   └── auth.ts                 # NextAuth config
└── nft/
    └── sources/nft.move        # Sui NFT contract
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## 🌐 API Endpoints

### POST `/api/mint`
Mint NFT on Sui blockchain
```javascript
fetch('/api/mint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    suiAddress: '0x...',
    sbtNumber: 42
  })
});
```

## 🔐 Environment Variables

See `.env.example` for all required environment variables:

- `NEXTAUTH_SECRET` - NextAuth secret key
- `TWITTER_CLIENT_ID` - Twitter OAuth client ID
- `TWITTER_CLIENT_SECRET` - Twitter OAuth client secret
- `SUI_PACKAGE_ID` - Sui package ID
- `USER_SECRET_KEY` - Sui user secret key
- `SUI_NUMBER_TABLE_ID` - Sui number table object ID
- `SUI_ADDRESS_TABLE_ID` - Sui address table object ID

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, DaisyUI
- **Authentication**: NextAuth.js
- **Blockchain**: Sui, @mysten/sui
- **Deployment**: Vercel (recommended)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure Sui blockchain credentials are correct
4. Check Twitter OAuth configuration