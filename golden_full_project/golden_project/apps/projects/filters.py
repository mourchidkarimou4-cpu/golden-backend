"""
apps/projects/filters.py
"""
import django_filters
from .models import Project


class ProjectFilter(django_filters.FilterSet):
    sector      = django_filters.MultipleChoiceFilter(choices=Project.Sector.choices)
    status      = django_filters.MultipleChoiceFilter(choices=Project.Status.choices)
    risk_level  = django_filters.MultipleChoiceFilter(choices=Project.RiskLevel.choices)
    country     = django_filters.CharFilter(lookup_expr='icontains')
    amount_min  = django_filters.NumberFilter(field_name='amount_needed', lookup_expr='gte')
    amount_max  = django_filters.NumberFilter(field_name='amount_needed', lookup_expr='lte')
    roi_min     = django_filters.NumberFilter(field_name='roi_estimated', lookup_expr='gte')
    duration_max = django_filters.NumberFilter(field_name='duration_months', lookup_expr='lte')

    class Meta:
        model  = Project
        fields = ['sector', 'status', 'risk_level', 'country',
                  'amount_min', 'amount_max', 'roi_min', 'duration_max']
