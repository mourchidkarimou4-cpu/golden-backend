"""apps/matching/admin.py"""
from django.contrib import admin
from .models import Match


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display  = ['investor', 'project', 'score', 'is_dismissed', 'created_at']
    list_filter   = ['is_dismissed']
    search_fields = ['investor__email', 'project__title']
    ordering      = ['-score']
