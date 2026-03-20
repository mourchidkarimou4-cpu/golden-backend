"""apps/projects/admin.py"""
from django.contrib import admin
from django.utils import timezone
from .models import Project, ProjectDocument, ProjectFavorite


class ProjectDocumentInline(admin.TabularInline):
    model  = ProjectDocument
    extra  = 0
    fields = ['doc_type', 'title', 'file', 'is_public']


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display   = ['title', 'owner', 'sector', 'status', 'amount_needed', 'funding_percentage', 'created_at']
    list_filter    = ['status', 'sector', 'risk_level', 'country']
    search_fields  = ['title', 'tagline', 'owner__email']
    readonly_fields = ['views_count', 'interest_count', 'created_at', 'updated_at', 'funding_percentage']
    raw_id_fields  = ['owner', 'reviewed_by']
    inlines        = [ProjectDocumentInline]
    actions        = ['approve_projects', 'reject_projects']

    @admin.action(description='Approuver les projets sélectionnés')
    def approve_projects(self, request, queryset):
        queryset.filter(status='pending_review').update(
            status='active', reviewed_by=request.user, reviewed_at=timezone.now()
        )
        self.message_user(request, 'Projets approuvés.')

    @admin.action(description='Rejeter les projets sélectionnés')
    def reject_projects(self, request, queryset):
        queryset.update(status='rejected', reviewed_by=request.user, reviewed_at=timezone.now())
        self.message_user(request, 'Projets rejetés.')
