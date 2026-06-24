from django.views.generic import TemplateView, View
from django.http import JsonResponse, HttpResponseForbidden
from django.contrib.auth.mixins import LoginRequiredMixin
from main_app.models import Report
from django.db.models import Count
from django.contrib import messages
from django.shortcuts import redirect


class DashboardView(LoginRequiredMixin, TemplateView):
    template_name = 'dashboard/index.html'

    def dispatch(self, request, *args, **kwargs):

        if not request.user.is_admin:

            messages.error(
                request,
                "Akses ditolak! Hanya admin."
            )

            return redirect('report_list')

        return super().dispatch(
            request,
            *args,
            **kwargs
        )

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context['latest_reported'] = Report.objects.filter(
            status='REPORTED'
        ).order_by('-id')[:5]

        context['latest_resolved'] = Report.objects.filter(
            status='RESOLVED'
        ).order_by('-id')[:5]

        return context

class DashboardDataView(View):

    def get(self, request):

        if not request.user.is_admin:
            return JsonResponse(
                {'error': 'Akses ditolak'},
                status=403
            )

        status_data = Report.objects.values(
            'status'
        ).annotate(
            total=Count('id')
        )

        category_data = Report.objects.values(
            'category'
        ).annotate(
            total=Count('id')
        )

        return JsonResponse({
            'status': list(status_data),
            'category': list(category_data),
        })