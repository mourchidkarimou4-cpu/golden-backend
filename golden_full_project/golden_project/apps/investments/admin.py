"""apps/investments/admin.py"""
from django.contrib import admin
from .models import Investment


@admin.register(Investment)
class InvestmentAdmin(admin.ModelAdmin):
    list_display   = ['investor', 'project', 'amount', 'status', 'payment_method', 'created_at']
    list_filter    = ['status', 'payment_method']
    search_fields  = ['investor__email', 'project__title', 'payment_ref']
    readonly_fields = ['commission_amount', 'net_amount', 'created_at', 'updated_at']
    raw_id_fields  = ['investor', 'project']

from .models import InvestmentRating
from apps.core.models import StatusHistory

@admin.register(InvestmentRating)
class InvestmentRatingAdmin(admin.ModelAdmin):
    list_display = ('investment', 'investor', 'score', 'created_at')
    list_filter  = ('score',)

@admin.register(StatusHistory)
class StatusHistoryAdmin(admin.ModelAdmin):
    list_display = ('investment', 'old_status', 'new_status', 'changed_at')
    readonly_fields = ('changed_at',)
