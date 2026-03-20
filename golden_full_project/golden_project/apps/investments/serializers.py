"""
apps/investments/serializers.py
"""
from rest_framework import serializers
from .models import Investment
from apps.projects.serializers import ProjectListSerializer
from apps.users.serializers import UserPublicSerializer


class InvestmentSerializer(serializers.ModelSerializer):
    project_detail  = ProjectListSerializer(source='project', read_only=True)
    investor_detail = UserPublicSerializer(source='investor', read_only=True)
    commission_amount = serializers.ReadOnlyField()
    net_amount        = serializers.ReadOnlyField()
    status_label      = serializers.CharField(source='get_status_display', read_only=True)
    payment_label     = serializers.CharField(source='get_payment_method_display', read_only=True)

    class Meta:
        model  = Investment
        fields = [
            'id', 'investor', 'investor_detail', 'project', 'project_detail',
            'amount', 'equity_percent', 'roi_agreed', 'duration_months',
            'status', 'status_label', 'payment_method', 'payment_label', 'payment_ref',
            'commission_rate', 'commission_amount', 'net_amount',
            'contract_url', 'contract_sent_at', 'signed_at', 'paid_at',
            'notes', 'created_at', 'updated_at',
        ]
        read_only_fields = [
            'id', 'investor', 'commission_amount', 'net_amount',
            'contract_sent_at', 'signed_at', 'paid_at', 'created_at', 'updated_at'
        ]


class InvestmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Investment
        fields = ['project', 'amount', 'equity_percent', 'roi_agreed',
                  'duration_months', 'payment_method', 'notes']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('Le montant doit être positif.')
        return value

    def validate(self, data):
        project = data.get('project')
        if project and project.status != 'active':
            raise serializers.ValidationError({'project': 'Ce projet n\'est pas ouvert aux investissements.'})
        min_inv = project.min_investment if project else None
        if min_inv and data['amount'] < min_inv:
            raise serializers.ValidationError({
                'amount': f'Le montant minimum d\'investissement est {min_inv} FCFA.'
            })
        return data
