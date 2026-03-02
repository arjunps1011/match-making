import os
import sys
import django

# Add the project directory to Python path
sys.path.append(r'c:\Users\arjun\OneDrive\Desktop\dating\dating backend\dating_web')

# Set Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dating_web.settings')
django.setup()

from django.conf import settings
import cloudinary

print("🔥 CLOUDINARY DEBUG REPORT")
print("=" * 50)
print(f"✅ DEFAULT_FILE_STORAGE: {settings.DEFAULT_FILE_STORAGE}")
print(f"✅ STATICFILES_STORAGE: {getattr(settings, 'STATICFILES_STORAGE', 'Not set')}")
print(f"✅ Cloudinary Config: {cloudinary.config()}")
print("=" * 50)

# Test if Cloudinary is properly configured
if settings.DEFAULT_FILE_STORAGE == 'cloudinary_storage.storage.MediaCloudinaryStorage':
    print("🎉 CLOUDINARY IS ACTIVE!")
else:
    print("❌ CLOUDINARY IS NOT ACTIVE!")
    print("Current storage:", settings.DEFAULT_FILE_STORAGE)