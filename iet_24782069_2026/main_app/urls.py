from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter
from .api_views import ReportViewSet

from .views import (
    home,
    ReportListView,
    ReportDetailView,
    ReportCreateView,
    ReportUpdateView,
    ReportDeleteView,
    ReportUpdateStatusView
)

router = DefaultRouter()
router.register(r'report', ReportViewSet, basename='report')

urlpatterns = [
    path('', home, name='home'),
    path('reports/', ReportListView.as_view(), name='report_list'),
    path('report/<int:pk>/', ReportDetailView.as_view(), name='report_detail'),
    path('add/', ReportCreateView.as_view(), name='add_report'),
    path('update/<int:pk>/', ReportUpdateView.as_view(), name='update_report'),
    path('delete/<int:pk>/', ReportDeleteView.as_view(), name='delete_report'),
    path('update-status/<int:pk>/', ReportUpdateStatusView.as_view(), name='update_status'),
    path('api/report/<int:pk>/', views.report_detail_api, name='report_detail_api'),
]