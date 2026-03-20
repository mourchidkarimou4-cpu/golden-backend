"""
apps/users/serializers.py
"""
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .models import KYCDocument

User = get_user_model()


class GoldenTokenObtainPairSerializer(TokenObtainPairSerializer):
    """JWT enrichi avec les infos de base de l'utilisateur."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['role'] = user.role
        token['is_kyc_verified'] = user.is_kyc_verified
        token['full_name'] = user.get_full_name()
        return token


class RegisterSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, label='Confirmer le mot de passe')

    class Meta:
        model = User
        fields = ['email', 'password', 'password2', 'first_name', 'last_name', 'role', 'phone_number']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password2': 'Les mots de passe ne correspondent pas.'})
        if data.get('role') == 'admin':
            raise serializers.ValidationError({'role': 'Impossible de s\'inscrire comme administrateur.'})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='get_full_name', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'full_name', 'first_name', 'last_name',
            'phone_number', 'avatar', 'country', 'city', 'bio', 'role',
            'is_email_verified', 'is_kyc_verified', 'kyc_status',
            'preferred_sectors', 'preferred_countries',
            'min_investment', 'max_investment', 'risk_profile',
            'created_at',
        ]
        read_only_fields = ['id', 'email', 'role', 'is_kyc_verified', 'kyc_status', 'created_at']


class UserPublicSerializer(serializers.ModelSerializer):
    """Vue publique minimale d'un utilisateur (pour listing projets, etc.)."""
    full_name = serializers.CharField(source='get_full_name', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'full_name', 'avatar', 'country', 'city', 'role']


class KYCSubmitSerializer(serializers.ModelSerializer):
    class Meta:
        model = KYCDocument
        fields = ['doc_type', 'file']


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Mot de passe actuel incorrect.')
        return value
