# 🚀 Quick Start - Telegram Mini App

Your app is now ready to work as a Telegram Mini App! Follow these steps to launch.

## ⚡ Fast Track (5 minutes)

### Step 1: Deploy to Vercel (2 min)
```bash
# Install Vercel CLI (if not already installed)
pnpm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

After deployment, copy your HTTPS URL (e.g., `https://vantawin.vercel.app`)

### Step 2: Create Telegram Bot (2 min)
1. Open Telegram and search for `@BotFather`
2. Send: `/newbot`
3. Enter bot name: `Vantawin Bot` (or your choice)
4. Enter username: `vantawin_bot` (must end with _bot)
5. Save the token for later (optional, for backend integration)

### Step 3: Create Mini App (1 min)
1. Send to BotFather: `/newapp`
2. Select your bot from the list
3. Fill in:
   - **Title**: `Vantawin`
   - **Description**: `Sports betting platform`
   - **Photo**: Upload 640x360px image (or skip for now)
   - **Web App URL**: Paste your Vercel URL
   - **Short name**: `vantawin` (lowercase, no spaces)

### Step 4: Launch! 🎉
1. BotFather gives you a link like: `https://t.me/vantawin_bot/vantawin`
2. Click the link in Telegram
3. Press "START" or "Open"
4. **You're live!** No login needed 🎊

## ✨ What You'll See

When users open your Mini App in Telegram:
- ✅ No login/signup page
- ✅ Instant access to all features
- ✅ Their Telegram username in the header
- ✅ Profile photo displayed
- ✅ Full-screen viewport
- ✅ All betting features work immediately

## 🌐 For Local Testing

If you want to test locally before deploying:

### Option 1: Using ngrok (Recommended)
```bash
# In one terminal, start your app
pnpm dev

# In another terminal, expose it
# Install ngrok from: https://ngrok.com/
ngrok http 8081

# Use the HTTPS URL from ngrok in BotFather
```

### Option 2: Test in Browser
```bash
# Just run the app
pnpm dev

# Open http://localhost:8081
# Works like normal web app (with Supabase login)
```

## 📱 User Experience

### In Telegram:
```
User opens bot → Clicks "Start" → App loads instantly
↓
Shows: "@username" or "First Last"
↓
Full access to: Wallet, Leaderboard, Pools, Games
↓
Zero friction betting experience!
```

### In Browser (Normal Web):
```
User visits URL → See login page → Enter credentials
↓
Same experience as before
↓
Supabase authentication
```

## 🎯 Verification Checklist

After setup, verify these work:

**In Telegram:**
- [ ] App opens without login page
- [ ] Header shows `@username` or name
- [ ] Profile photo appears
- [ ] Can access Wallet page
- [ ] Can access Leaderboard
- [ ] Can view Pools
- [ ] Can place bets
- [ ] Viewport fills full screen

**In Browser:**
- [ ] Shows login page
- [ ] Can register new account
- [ ] Can login with email
- [ ] All features work normally

## 🔄 Update Workflow

When you make changes:

```bash
# 1. Make your code changes
# 2. Test locally
pnpm dev

# 3. Build to verify
pnpm build

# 4. Deploy update
vercel --prod

# No need to update BotFather - URL stays the same!
```

## 🎨 Customization Tips

### Change Theme Colors
Edit `src/components/TelegramProvider.tsx` to customize how Telegram theme is applied.

### Add Bot Commands
In BotFather:
```
/setcommands
# Add commands like:
start - Open Vantawin
help - Get help
stats - View your stats
```

### Customize Menu Button
```
/mybots → Your Bot → Bot Settings → Menu Button
Set URL to: https://your-app.com
```

## 📞 Need Help?

**Detailed guides:**
- Full setup: [TELEGRAM_SETUP.md](./TELEGRAM_SETUP.md)
- Technical details: [TELEGRAM_INTEGRATION_SUMMARY.md](./TELEGRAM_INTEGRATION_SUMMARY.md)

**Common issues:**
- App won't load → Check HTTPS is enabled
- Login page still shows → Clear cache, check console
- User data missing → Verify TelegramProvider is loaded

**Resources:**
- [Telegram Mini Apps Docs](https://docs.telegram-mini-apps.com/)
- [Vercel Deployment](https://vercel.com/docs)
- [ngrok Setup](https://ngrok.com/docs/getting-started)

## 💡 Pro Tips

1. **Test in Telegram Desktop** - Has better dev tools
2. **Use ngrok for quick testing** - Easier than setting up local HTTPS
3. **Deploy to Vercel** - Free tier is perfect for Mini Apps
4. **Check browser console** - Most issues show up there first
5. **Start with test bot** - Create separate bot for testing before production

---

**Ready to go live?** Start with Step 1 above! 🚀

*Estimated time to launch: 5 minutes*
