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
