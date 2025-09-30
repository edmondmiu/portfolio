# Analytics Setup Instructions

## 🎯 Overview
Your minimal analytics system has been successfully implemented! Here's what you need to do to get it running.

## 📁 Files Created

### Backend (Firebase Functions)
- `functions/index.js` - Cloud Function to track visits
- `functions/package.json` - Dependencies for functions
- `firestore.rules` - Security rules for Firestore
- `firestore.indexes.json` - Database indexes for performance

### Frontend (Client Tracking)
- `assets/js/analytics.js` - Client-side tracking script
- All HTML pages updated with analytics script imports

### Admin Dashboard
- `admin/index.html` - Analytics dashboard interface
- `admin/dashboard.js` - Dashboard logic with Charts.js

## 🚀 Deployment Steps

### 1. Upgrade Firebase Plan (Required for Functions)
⚠️ **Important**: Firebase Functions require the Blaze (pay-as-you-go) plan.

1. Go to [Firebase Console](https://console.firebase.google.com/project/edmondmiuportfolio/usage/details)
2. Click "Upgrade" to switch to Blaze plan
3. Note: Free tier limits still apply, so cost will be $0 for normal usage

### 2. Deploy Firebase Functions & Firestore
```bash
# Deploy functions and Firestore rules
firebase deploy --only functions,firestore

# This will:
# - Deploy your trackVisit function
# - Set up Firestore security rules
# - Create database indexes
```

### 2. Enable Firebase Authentication
```bash
# Enable Google Sign-In in Firebase Console
# 1. Go to Firebase Console > Authentication > Sign-in method
# 2. Enable "Google" provider
# 3. Add your domain (edmondmiu.com) to authorized domains
```

### 3. Create Firebase Web App & Get Config
```bash
# Create web app for dashboard
firebase apps:create web "Analytics Dashboard"

# Get the configuration
firebase apps:sdkconfig web
```

### 4. Update Dashboard Configuration
Update `admin/dashboard.js` with your actual Firebase config:
```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "edmondmiuportfolio.firebaseapp.com", 
    projectId: "edmondmiuportfolio",
    storageBucket: "edmondmiuportfolio.appspot.com",
    messagingSenderId: "636761626976",
    appId: "your-actual-app-id"
};
```

### 5. Update Analytics Function URL
After deployment, update the function URL in `assets/js/analytics.js`:
```javascript
const ANALYTICS_FUNCTION_URL = 'https://us-central1-edmondmiuportfolio.cloudfunctions.net/trackVisit';
```

### 6. Deploy Website
```bash
# Build and deploy your website
npm run build
firebase deploy --only hosting
```

## 🧪 Testing

### 1. Test Function Endpoint
```bash
# Test the function locally first
cd functions
npm run serve

# Test with curl
curl -X POST http://localhost:5001/edmondmiuportfolio/us-central1/trackVisit \
  -H "Content-Type: application/json" \
  -d '{"path": "/test", "referrer": "https://google.com"}'
```

### 2. Test Client Tracking
1. Visit your website
2. Check browser developer console for any errors
3. Check Firebase Console > Firestore to see if visits are being logged

### 3. Test Dashboard
1. Go to `https://yourdomain.com/admin/`
2. Sign in with Google
3. Verify data is loading and charts are rendering

## 📊 Dashboard Features

### Real-time Stats
- Total page views in selected time range
- Number of unique pages visited
- Top visiting country
- Today's view count

### Visualizations  
- Page views over time (line chart)
- Top pages distribution (doughnut chart)

### Data Tables
- Recent visits with timestamps, countries, referrers
- Page counters with total counts and last visit times

### Time Filters
- Last 24 hours, 7 days, 30 days, 90 days

## 🛡️ Privacy & GDPR Compliance

### What's Tracked (GDPR-Safe)
✅ Page paths (e.g., `/`, `/about`)
✅ Visit timestamps  
✅ Referrer domains (e.g., `google.com`)
✅ Country from request headers
✅ Truncated user agent strings
✅ Platform information (e.g., `MacIntel`)

### What's NOT Tracked
❌ No IP addresses stored
❌ No user identifiers or cookies
❌ No personal information
❌ No cross-site tracking
❌ No consent required

### Bot Protection
- Automatically excludes common bots/crawlers
- Skips tracking on localhost/development

## 🔧 Troubleshooting

### Analytics Not Working
1. Check browser console for JavaScript errors
2. Verify function URL is correct in `analytics.js`
3. Check Firebase Console > Functions for error logs
4. Test function endpoint manually with curl

### Dashboard Not Loading Data
1. Verify Firebase Auth is configured correctly
2. Check Firestore security rules allow authenticated reads
3. Ensure user is signed in with Google account
4. Check browser console for authentication errors

### No Data Showing
1. Visit your website first to generate test data
2. Check Firestore Console to see if documents exist
3. Verify time range filter includes recent visits
4. Check function logs for any tracking errors

## 💰 Cost Estimate (Firebase Free Tier)

With Firebase Free Tier limits:
- **Functions**: 125K invocations/month (more than enough for personal site)
- **Firestore**: 20K writes/day + 50K reads/day (very generous)
- **Hosting**: 10GB storage + 360MB/day transfer (plenty)
- **Auth**: Unlimited Google Sign-In

**Expected monthly cost: $0** for most personal websites

## 🚀 Optional Enhancements

1. **Email Notifications**: Get notified when specific pages are viewed
2. **Export Data**: Add CSV export functionality to dashboard  
3. **Webhook Integration**: Send data to Slack/Discord
4. **Geolocation Maps**: Add world map visualization
5. **A/B Testing**: Track different page versions
6. **Performance Metrics**: Add page load time tracking

Your analytics system is now ready! 🎉