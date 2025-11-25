# Telegram Mini App Setup Guide

This guide will help you set up your Vantawin app as a Telegram Mini App.

## Prerequisites

- A Telegram account
- Your app deployed to a public HTTPS URL (required by Telegram)
- Node.js and pnpm installed

## Step 1: Create a Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Start a chat and send `/newbot`
3. Follow the instructions to choose a name and username for your bot
4. Save the bot token (you'll need this for backend validation if you implement it)

## Step 2: Create the Mini App

1. In the chat with BotFather, send `/newapp`
2. Select the bot you just created
3. Provide the following information:
   - **Title**: Vantawin (or your preferred name)
   - **Description**: Your betting platform description
   - **Photo**: Upload a 640x360px image (optional but recommended)
   - **Demo GIF**: Optional animated preview
   - **Web App URL**: Your deployed HTTPS URL (e.g., `https://yourdomain.com`)
   - **Short name**: A unique identifier (e.g., `vantawin`)

4. After creation, BotFather will provide you with a link like: `https://t.me/YourBotName/vantawin`

## Step 3: Set Up Menu Button (Optional)

To make the Mini App accessible from the bot's menu:

1. Send `/mybots` to BotFather
2. Select your bot
3. Choose "Bot Settings" → "Menu Button"
4. Set the button URL to your Mini App URL
5. Optionally customize the button text

## Step 4: Deploy Your Application

### For Production Deployment (Required)

Telegram Mini Apps **must** be served over HTTPS. Deploy your app to any of these platforms:

#### Option A: Vercel (Recommended - Already configured in your project)
```bash
pnpm install -g vercel
vercel login
vercel --prod
```

#### Option B: Netlify
```bash
pnpm build
# Drag and drop the 'dist' folder to Netlify
```

#### Option C: Your own server with SSL certificate
Ensure your server has valid SSL certificates (use Let's Encrypt for free certificates).

### For Local Development (Optional)

If you want to test locally with HTTPS:

1. **Generate self-signed certificates:**
   ```bash
   mkdir certs
   cd certs
   
   # Using OpenSSL (Windows users: use Git Bash or install OpenSSL)
   openssl req -x509 -newkey rsa:2048 -keyout localhost-key.pem -out localhost-cert.pem -days 365 -nodes
   ```

2. **Set environment variable and run dev server:**
   ```bash
   # Windows PowerShell
   $env:VITE_HTTPS="true"
   pnpm dev
   
   # Windows CMD
   set VITE_HTTPS=true
   pnpm dev
   
   # Linux/Mac
   VITE_HTTPS=true pnpm dev
   ```

3. **Expose local server using ngrok or similar:**
   ```bash
   # Install ngrok: https://ngrok.com/
   ngrok http 8080
   ```
   Use the HTTPS URL provided by ngrok as your Mini App URL.

**Note**: Self-signed certificates will show browser warnings. For actual testing, use ngrok or deploy to a proper hosting service.

## Step 5: Test Your Mini App

1. Open the link provided by BotFather in Telegram (e.g., `https://t.me/YourBotName/vantawin`)
2. Click "Start" or "Open Mini App"
3. Your app should load inside Telegram with:
   - Telegram user authentication (no login required)
   - Username/name displayed in the header
   - Full viewport height
   - Telegram theme colors (optional, can be customized)

## Features Enabled

Your app now includes:

✅ **Auto-authentication**: Users are automatically logged in using their Telegram account
✅ **User data**: Access to Telegram username, first name, last name, and profile photo
✅ **No login/signup pages**: When running in Telegram, auth pages are automatically bypassed
✅ **Responsive viewport**: App expands to fill the entire Telegram window
✅ **Protected routes**: Users can access wallet, leaderboard, and other protected features immediately

## How It Works

### User Authentication Flow

1. When user opens your Mini App in Telegram, the app receives `initData` containing:
   - User ID
   - Username
   - First name
   - Last name
   - Profile photo URL
   - Language code
   - Premium status

2. The app detects it's running in Telegram and uses this data instead of Supabase authentication

3. Protected routes are automatically accessible to Telegram users

### Code Structure

- **`src/utils/telegram.ts`**: Utility functions to detect Telegram environment and get user data
- **`src/components/TelegramProvider.tsx`**: Initializes Telegram SDK and manages viewport/theme
- **`src/context/AuthContext.tsx`**: Updated to handle both Supabase and Telegram authentication
- **`src/App.tsx`**: Routes modified to redirect Telegram users away from auth pages
- **`src/components/ProtectedRoute.tsx`**: Accepts Telegram users as authenticated
- **`src/components/MainHeader.tsx`**: Displays Telegram username/name instead of email

## Backend Integration (Optional)

If you want to validate Telegram users on your backend:

1. Send `initDataRaw` with each API request:
   ```typescript
   import { retrieveLaunchParams } from '@telegram-apps/sdk';
   
   const { initDataRaw } = retrieveLaunchParams();
   
   fetch('https://your-api.com/endpoint', {
     headers: {
       'Authorization': `tma ${initDataRaw}`
     }
   });
   ```

2. Validate on your backend using the bot token (see [Telegram docs](https://docs.telegram-mini-apps.com/platform/init-data#validating))

3. Recommended packages:
   - Node.js: [@telegram-apps/init-data-node](https://www.npmjs.com/package/@telegram-apps/init-data-node)
   - Go: [init-data-golang](https://github.com/telegram-mini-apps/init-data-golang)

## Troubleshooting

### App doesn't load in Telegram
- Ensure your URL uses HTTPS
- Check browser console for errors (use Telegram Desktop for debugging)
- Verify the URL in BotFather settings is correct

### User data not showing
- Check if `isTelegram` is true in the AuthContext
- Verify `initData` is present in browser console
- Make sure TelegramProvider is wrapping your app in main.tsx

### "Loading..." stuck on screen
- Check for JavaScript errors in console
- Ensure all imports are correct
- Try clearing browser cache

### Local HTTPS not working
- Use ngrok instead of self-signed certificates for easier setup
- For self-signed certs, you may need to manually accept the certificate warning in browser first

## Resources

- [Telegram Mini Apps Documentation](https://docs.telegram-mini-apps.com/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [BotFather Commands](https://core.telegram.org/bots/features#botfather)
- [@telegram-apps/sdk Documentation](https://docs.telegram-mini-apps.com/packages/telegram-apps-sdk)

## Support

For issues specific to Telegram Mini Apps integration, refer to:
- [Telegram Mini Apps GitHub](https://github.com/Telegram-Mini-Apps)
- [Community Chat](https://t.me/twa_dev)
