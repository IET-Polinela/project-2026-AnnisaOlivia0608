from rest_framework import serializers
from .models import Report

class ReportSerializer(serializers.ModelSerializer):

    reporter = serializers.SerializerMethodField()
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
            'reporter',
            'is_owner',
            'reporter_name'
        ]

    def get_is_owner(self, obj):
        request = self.context.get('request')

        if request and request.user.is_authenticated:
            return obj.reporter == request.user

        return False

    def get_reporter_name(self, obj):
        request = self.context.get('request')

        if (
            request and
            request.user.is_authenticated and
            obj.reporter == request.user
        ):
            return obj.reporter.username

        return "Warga Anonim"

    def get_reporter(self, obj):
        return "Warga Anonim"