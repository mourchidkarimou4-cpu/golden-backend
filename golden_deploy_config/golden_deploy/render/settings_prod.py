"""
config/settings/prod.py — Production (Render + Supabase + Upstash)
"""
from .base import *  # noqa
import dj_database_url

DEBUG = False

# ─── Sécurité HTTPS ───────────────────────────────────────
SECURE_SSL_REDIRECT              = True
SECURE_PROXY_SSL_HEADER          = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_HSTS_SECONDS              = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS   = True
SECURE_HSTS_PRELOAD              = True
SESSION_COOKIE_SECURE            = True
CSRF_COOKIE_SECURE               = True
SECURE_BROWSER_XSS_FILTER        = True
SECURE_CONTENT_TYPE_NOSNIFF      = True
X_FRAME_OPTIONS                  = 'DENY'

# ─── Base de données Supabase ─────────────────────────────
# DATABASE_URL = postgres://user:password@db.xxx.supabase.co:5432/postgres
DATABASES = {
    'default': dj_database_url.config(
        default=config('DATABASE_URL'),
        conn_max_age=600,
        ssl_require=True,
    )
}

# ─── Stockage Supabase Storage (compatible S3) ────────────
USE_S3 = config('USE_S3', default=True, cast=bool)
if USE_S3:
    AWS_ACCESS_KEY_ID       = config('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY   = config('AWS_SECRET_ACCESS_KEY')
    AWS_STORAGE_BUCKET_NAME = config('AWS_STORAGE_BUCKET_NAME', default='golden-files')
    # URL endpoint Supabase Storage (format S3)
    # Exemple : https://xxx.supabase.co/storage/v1/s3
    AWS_S3_ENDPOINT_URL     = config('AWS_S3_ENDPOINT_URL')
    AWS_S3_REGION_NAME      = 'eu-west-1'
    AWS_DEFAULT_ACL         = 'private'
    AWS_S3_FILE_OVERWRITE   = False
    DEFAULT_FILE_STORAGE    = 'storages.backends.s3boto3.S3Boto3Storage'

# ─── Cache Redis (Upstash) ────────────────────────────────
REDIS_URL = config('REDIS_URL')
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': REDIS_URL,
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
            'CONNECTION_POOL_KWARGS': {'ssl_cert_reqs': None},
        },
        'TIMEOUT': 300,
    }
}

# ─── Celery (Upstash Redis) ───────────────────────────────
CELERY_BROKER_URL    = config('CELERY_BROKER_URL', default=REDIS_URL)
CELERY_RESULT_BACKEND = REDIS_URL
CELERY_BROKER_USE_SSL = {'ssl_cert_reqs': 'none'}
CELERY_REDIS_BACKEND_USE_SSL = {'ssl_cert_reqs': 'none'}

# ─── Email (SendGrid) ─────────────────────────────────────
EMAIL_BACKEND       = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST          = 'smtp.sendgrid.net'
EMAIL_PORT          = 587
EMAIL_USE_TLS       = True
EMAIL_HOST_USER     = 'apikey'
EMAIL_HOST_PASSWORD = config('SENDGRID_API_KEY', default='')

# ─── Logs ─────────────────────────────────────────────────
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'WARNING',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'ERROR',
            'propagate': False,
        },
    },
}
