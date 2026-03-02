# Migration Steps

## Changed profile from ImageField to CharField (URL)

Run these commands:

```bash
cd "dating backend/dating_web"
python manage.py makemigrations
python manage.py migrate
```

This changes profile to store URLs instead of file paths, so images persist even when Render restarts.

Default avatar: https://ui-avatars.com/api/?name=User&size=200&background=random
