# 🚀 Analytics Deployment Checklist

## ✅ Completed Steps
- [x] Upgraded to Firebase Blaze plan
- [x] Created Functions code and configuration  
- [x] Deployed Firebase Functions successfully
- [x] Function URL: `https://us-central1-edmondmiuportfolio.cloudfunctions.net/trackVisit`

## 🔧 Manual Setup Required

### 1. Enable Firestore API
Visit: https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=edmondmiuportfolio
- Click "Enable" button

### 2. Create Firestore Database  
Visit: https://console.firebase.google.com/project/edmondmiuportfolio/firestore
- Click "Create database"
- Choose "Start in production mode"
- Select "eur3 (europe-west)" region (better for Europe-based users)

### 3. Enable Firebase Authentication
Visit: https://console.firebase.google.com/project/edmondmiuportfolio/authentication/providers
- Click "Get started" if not already enabled
- Go to "Sign-in method" tab
- Enable "Google" provider
- Add your domains (edmondmiu.com, localhost) to authorized domains

### 4. Get Firebase Web App Config
Visit: https://console.firebase.google.com/project/edmondmiuportfolio/settings/general
- Scroll to "Your apps" section
- Click "Add app" > Web app icon
- Name it "Analytics Dashboard"
- Copy the config object

### 5. Update Dashboard Config
Edit `admin/dashboard.js` and replace the config:
```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key-here",
    authDomain: "edmondmiuportfolio.firebaseapp.com",
    projectId: "edmondmiuportfolio", 
    storageBucket: "edmondmiuportfolio.appspot.com",
    messagingSenderId: "636761626976",
    appId: "your-actual-app-id-here"
};
```

## 🧪 Testing After Setup

Run these commands once manual setup is complete:

```bash
# Test function endpoint
curl -X POST https://us-central1-edmondmiuportfolio.cloudfunctions.net/trackVisit \
  -H "Content-Type: application/json" \
  -d '{"path": "/test", "referrer": "https://google.com"}'

# Deploy Firestore rules and indexes  
firebase deploy --only firestore

# Deploy your website
firebase deploy --only hosting

# Check function logs
firebase functions:log
```

## 🎯 Final Verification

1. Visit your website - analytics should track automatically
2. Check `/test-analytics.html` for system validation
3. Visit `/admin/` and sign in with Google to see dashboard
4. Verify data appears in Firebase Console > Firestore

## 🐛 Troubleshooting

If function still returns "Internal server error":
1. Check `firebase functions:log` for detailed errors
2. Ensure all APIs are enabled and propagated (wait 5-10 minutes)
3. Verify Firestore database exists and is in "eur3" region

Your analytics system is 95% deployed! Just need these manual Firebase Console steps.