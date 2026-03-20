"""apps/projects/urls.py"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, MyProjectsView, ProjectFavoritesView

router = DefaultRouter()
router.register(r'', ProjectViewSet, basename='project')

urlpatterns = [
    path('mine/',      MyProjectsView.as_view(),      name='project-mine'),
    path('favorites/', ProjectFavoritesView.as_view(), name='project-favorites'),
    path('', include(router.urls)),
]
