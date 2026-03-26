"""apps/projects/urls.py"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, MyProjectsView, ProjectFavoritesView, create_share_token, public_share_view, update_favorite_note

router = DefaultRouter()
router.register(r'', ProjectViewSet, basename='project')

urlpatterns = [
    path('mine/',                    MyProjectsView.as_view(),       name='project-mine'),
    path('favorites/',               ProjectFavoritesView.as_view(), name='project-favorites'),
    path('<uuid:pk>/share/',         create_share_token,             name='project-share'),
    path('share/<str:token>/',       public_share_view,              name='project-share-public'),
    path('<uuid:pk>/favorite/note/',  update_favorite_note,           name='project-favorite-note'),
    path('', include(router.urls)),
]
