from rest_framework import serializers
from .models import Report

class ReportSerializer(serializers.ModelSerializer):

    is_owner = serializers.SerializerMethodField()
    reporter_name = serializers.SerializerMethodField()

    class Meta:
        model = Report
        fields = [
            'id',
            'title',
            'category',
            'description',
            'location',
            'status',
            'updated_at',
            'is_owner',
            'reporter_name'
        ]

    def get_is_owner(self, obj):
        request = self.context.get('request')

        if request and request.user.is_authenticated:
            return obj.reporter == request.user

        return False

    def get_reporter_name(self, obj):
        return "Warga Anonim"