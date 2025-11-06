# Firebase Setup Guide for Cure Connect

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `cure-connect`
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"
6. Wait for project creation to complete

## Step 2: Enable Authentication

1. In your Firebase project, click "Authentication" in the left sidebar
2. Go to the "Sign-in method" tab
3. Click on "Email/Password" provider
4. Click the toggle to enable it
5. Click "Save"

## Step 3: Enable Firestore Database

1. Click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database (choose the closest region)
5. Click "Done"

## Step 4: Get Firebase Configuration

1. Click the gear icon (⚙️) next to "Project Overview" → "Project settings"
2. Scroll down to "Your apps" section
3. Click the "</>" icon to add a web app
4. Enter app nickname: `cure-connect-web`
5. Check "Also set up Firebase Hosting" (optional)
6. Click "Register app"
7. Copy the config object (it looks like this):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "cure-connect-xxxxx.firebaseapp.com",
  projectId: "cure-connect-xxxxx",
  storageBucket: "cure-connect-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## Step 5: Update Firebase Config in Your Code

1. Open `cure-connect/frontend/src/firebase.js`
2. Replace the placeholder config with your real Firebase config
3. Save the file

## Step 6: Create Admin User

1. In Firebase Console, go to "Authentication" → "Users"
2. Click "Add user"
3. Enter email: `admin@cureconnect.com`
4. Enter a password (remember this!)
5. Click "Add user"

## Step 7: Seed Initial Data

**Option 1: Using Browser Console (Recommended)**
1. Open your browser and go to your React app (http://localhost:3000)
2. Open developer console (F12 or right-click → Inspect → Console)
3. Copy and paste this code, then press Enter:

```javascript
// First, import the seed function
import('./src/data/seedData.js').then(module => {
  const { seedDoctors } = module;
  seedDoctors().then(result => {
    console.log('Seeding result:', result);
  });
});
```

**Option 2: Temporary Component (Alternative)**
1. Open `src/components/Home.js`
2. Add this temporary code at the top of the component:

```javascript
import { useEffect } from 'react';
import { seedDoctors } from '../data/seedData';

function Home() {
  useEffect(() => {
    seedDoctors().then(result => {
      console.log('Doctors seeded:', result);
    });
  }, []);
  // ... rest of your component
}
```

3. Save and refresh the page
4. Check browser console for success message
5. Remove the temporary code after seeding

## Step 8: Test the Application

1. Try logging in with `admin@cureconnect.com` and your admin password
2. Go to Admin Panel and add some doctors
3. Try booking appointments as a regular user
4. Check that data persists in Firestore

## Troubleshooting

### Common Issues:

1. **"Firebase: Error (auth/invalid-api-key)"**
   - Check that your API key in firebase.js is correct

2. **"Firebase: Error (auth/user-not-found)"**
   - Make sure the user exists in Firebase Authentication

3. **Firestore permission errors**
   - Make sure Firestore is in "test mode" or you've set up proper security rules

4. **CORS errors**
   - Firebase doesn't have CORS issues, so this might be a different problem

### Security Rules for Firestore (Optional - for production)

If you want to secure your database, add these rules in Firestore → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Next Steps

After setup is complete:
- Test all functionality thoroughly
- Consider setting up Firebase Hosting for deployment
- Add proper error handling and loading states
- Implement user roles and permissions if needed

## Need Help?

If you encounter any issues during setup, check:
1. Firebase Console for error messages
2. Browser developer console for JavaScript errors
3. Make sure all Firebase services are enabled
4. Verify your config values are correct
