"""
apps/projects/serializers.py
"""
from rest_framework import serializers
from .models import Project, ProjectDocument, ProjectFavorite
from apps.users.serializers import UserPublicSerializer


class ProjectDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ProjectDocument
        fields = ['id', 'doc_type', 'title', 'file', 'is_public', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']


class ProjectListSerializer(serializers.ModelSerializer):
    """Sérializer léger pour le listing."""
    owner            = UserPublicSerializer(read_only=True)
    funding_percentage = serializers.ReadOnlyField()
    sector_label     = serializers.CharField(source='get_sector_display', read_only=True)
    status_label     = serializers.CharField(source='get_status_display', read_only=True)
    risk_label       = serializers.CharField(source='get_risk_level_display', read_only=True)
    is_favorite      = serializers.SerializerMethodField()

    class Meta:
        model  = Project
        fields = [
            'id', 'title', 'tagline', 'sector', 'sector_label',
            'country', 'city', 'cover_image',
            'amount_needed', 'amount_raised', 'funding_percentage',
            'roi_estimated', 'duration_months', 'min_investment',
            'status', 'status_label', 'risk_level', 'risk_label',
            'views_count', 'interest_count', 'is_favorite',
            'owner', 'created_at',
        ]

    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return ProjectFavorite.objects.filter(investor=request.user, project=obj).exists()
        return False


class ProjectDetailSerializer(ProjectListSerializer):
    """Sérializer complet avec description et documents."""
    documents = serializers.SerializerMethodField()

    class Meta(ProjectListSerializer.Meta):
        fields = ProjectListSerializer.Meta.fields + ['description', 'documents', 'review_notes']

    def get_documents(self, obj):
        request = self.context.get('request')
        qs = obj.documents.all()
        # Documents non publics visibles uniquement pour owner, admin, investisseur vérifié
        if not request or not request.user.is_authenticated:
            qs = qs.filter(is_public=True)
        elif request.user.role not in ('admin',) and request.user != obj.owner:
            if not request.user.is_kyc_verified:
                qs = qs.filter(is_public=True)
        return ProjectDocumentSerializer(qs, many=True, context=self.context).data


class ProjectCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Project
        fields = [
            'title', 'tagline', 'description', 'sector',
            'country', 'city', 'cover_image',
            'amount_needed', 'roi_estimated', 'duration_months', 'min_investment',
            'risk_level',
        ]

    def validate_amount_needed(self, value):
        if value <= 0:
            raise serializers.ValidationError('Le montant recherché doit être positif.')
        return value

    def validate_roi_estimated(self, value):
        if value < 0 or value > 200:
            raise serializers.ValidationError('Le ROI estimé doit être entre 0 et 200%.')
        return value
