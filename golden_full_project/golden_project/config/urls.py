"""GOLDEN Investissement — URLs racines"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

api_v1 = [
    path('auth/',        include('apps.users.urls.auth')),
    path('users/',       include('apps.users.urls.users')),
    path('projects/',    include('apps.projects.urls')),
    path('matching/',    include('apps.matching.urls')),
    path('messages/',    include('apps.messaging.urls')),
    path('investments/', include('apps.investments.urls')),
    path('reporting/',   include('apps.reporting.urls')),
    path('core/',        include('apps.core.urls')),
]

urlpatterns = [
    path('admin/',       admin.site.urls),
    path('api/v1/',      include(api_v1)),
    path('api/schema/',  SpectacularAPIView.as_view(),                      name='schema'),
    path('api/docs/',    SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/',   SpectacularRedocView.as_view(url_name='schema'),   name='redoc'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,  document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    try:
        import debug_toolbar
        urlpatterns = [path('__debug__/', include(debug_toolbar.urls))] + urlpatterns
    except ImportError:
        pass
