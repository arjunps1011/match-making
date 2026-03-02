@echo off
echo 🔥 CLOUDINARY MIGRATION & TEST
cd "dating backend\dating_web"
call ..\djvenv\Scripts\activate

echo 📦 Making migrations...
python manage.py makemigrations

echo 🚀 Applying migrations...
python manage.py migrate

echo 🧪 Testing storage backend...
python manage.py shell -c "from django.conf import settings; print('🔥 STORAGE BACKEND:', settings.DEFAULT_FILE_STORAGE)"

echo ✅ Starting server...
python manage.py runserver
pause