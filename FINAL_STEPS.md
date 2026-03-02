# ✅ FINAL STEPS

## 1. Update .env with your actual Cloudinary credentials
Replace in `dating_web/.env`:
```
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key  
CLOUDINARY_API_SECRET=your_actual_api_secret
```

## 2. Run migrations
```bash
cd "dating backend/dating_web"
python manage.py makemigrations
python manage.py migrate
```

## 3. Deploy
```bash
git add .
git commit -m "Add Cloudinary for persistent images"
git push
```

## ✨ Done!
- All images now stored on Cloudinary (permanent)
- Profile pictures won't disappear on Render restart
- Navbar will show profile images instantly from localStorage
