from .base import *  # noqa

DEBUG = True

# debug_toolbar optionnel en dev
try:
    import debug_toolbar
    INSTALLED_APPS += ['debug_toolbar']  # noqa
    MIDDLEWARE.insert(0, 'debug_toolbar.middleware.DebugToolbarMiddleware')  # noqa
    INTERNAL_IPS = ['127.0.0.1']
except ImportError:
    pass

# Emails en console en dev
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Désactiver le cache Redis en dev (utiliser la mémoire)
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
    }
}

# Celery en mode synchrone en dev (pas besoin de worker)
CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True

# CORS dev — tout accepter
CORS_ALLOW_ALL_ORIGINS = True
