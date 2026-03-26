import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.prod')
django.setup()
from apps.users.models import User
if not User.objects.filter(email='admin@golden.com').exists():
    User.objects.create_superuser(
        email='admin@golden.com',
        password='Golden2026!'
    )
    print('Superuser créé !')
else:
    print('Superuser existe déjà.')
