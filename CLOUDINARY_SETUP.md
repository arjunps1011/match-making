# ☁️ CLOUDINARY SETUP - PERMANENT IMAGE STORAGE

## ✅ What's Done:
1. Added `cloudinary` and `django-cloudinary-storage` to requirements.txt
2. Configured Django settings to use Cloudinary
3. Profile images will now be stored permanently on Cloudinary

## 🔧 Setup Steps:

### 1. Get Cloudinary Credentials (FREE)
1. Go to https://cloudinary.com/users/register_free
2. Sign up (free tier: 25GB storage, 25GB bandwidth/month)
3. After signup, go to Dashboard
4. Copy these values:
   - Cloud Name
   - API Key
   - API Secret

### 2. Update .env File
Replace these in your `.env` file:
```
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

### 3. Add to Render Environment Variables
In Render dashboard → Environment:
```
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

### 4. Run Migrations
```bash
cd "dating backend/dating_web"
python manage.py makemigrations
python manage.py migrate
```

### 5. Deploy
```bash
git add .
git commit -m "Add Cloudinary for persistent image storage"
git push
```

## ✨ Result:
- ✅ All uploaded images stored on Cloudinary (permanent)
- ✅ Images survive Render restarts
- ✅ Default avatar from ui-avatars.com
- ✅ No more missing profile pictures!

## 📝 How It Works:
- When user uploads image → Django saves to Cloudinary → Returns URL
- URL stored in database (not file path)
- Images accessible forever via Cloudinary CDN
