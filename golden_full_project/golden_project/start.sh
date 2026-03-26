#!/bin/bash
set -e
cd /opt/render/project/src/golden_full_project/golden_project
python manage.py makemigrations --noinput
python manage.py migrate contenttypes --noinput
python manage.py migrate auth --noinput
python manage.py migrate --noinput
python manage.py collectstatic --noinput
python create_admin.py || true
gunicorn config.asgi:application --bind 0.0.0.0:$PORT --workers 2 --worker-class uvicorn.workers.UvicornWorker --timeout 120
