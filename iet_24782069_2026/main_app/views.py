from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.views import View
from django.urls import reverse_lazy
from django.contrib import messages  # ✅ TAMBAHAN
from .models import Report
from .forms import ReportForm

class AdminOnlyMixin:
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated or not request.user.is_admin:
            messages.error(request, "Akses ditolak! Hanya admin.")
            return redirect('report_list')  # sesuaikan dengan nama URL kamu
        return super().dispatch(request, *args, **kwargs)

# WORKFLOW STATUS
class ReportUpdateStatusView(AdminOnlyMixin, View):
    def post(self, request, pk):
        report = get_object_or_404(Report, pk=pk)
        new_status = request.POST.get('status')

        if report.status == 'REPORTED' and new_status == 'VERIFIED':
            report.status = 'VERIFIED'

        elif report.status == 'VERIFIED' and new_status == 'IN_PROGRESS':
            report.status = 'IN_PROGRESS'

        elif report.status == 'IN_PROGRESS' and new_status == 'RESOLVED':
            report.status = 'RESOLVED'

        report.save()
        messages.info(request, "Status laporan berhasil diubah!")  # ✅ ALERT
        return redirect('report_list')


# HOME
def home(request):
    return render(request, 'main_app/home.html')


# CREATE
class ReportCreateView(AdminOnlyMixin, CreateView):
    model = Report
    fields = ['title', 'content', 'location']
    template_name = 'report_form.html'
    success_url = '/reports/'

    def form_valid(self, form):
        messages.success(self.request, "Laporan berhasil ditambahkan!")  # ✅ ALERT
        return super().form_valid(form)


# READ (LIST)
class ReportListView(ListView):
    model = Report
    template_name = 'main_app/report_list.html'
    context_object_name = 'reports'


# UPDATE
class ReportUpdateView(AdminOnlyMixin, UpdateView):
    model = Report
    fields = ['title', 'content', 'location']
    template_name = 'report_form.html'
    success_url = '/reports/'

    def form_valid(self, form):
        messages.success(self.request, "Laporan berhasil diperbarui!")  # ✅ ALERT
        return super().form_valid(form)


# DELETE
class ReportDeleteView(AdminOnlyMixin, DeleteView):
    model = Report
    template_name = 'report_confirm_delete.html'
    success_url = '/reports/'

    def post(self, request, *args, **kwargs):
        messages.success(self.request, "Laporan berhasil dihapus!")  # ✅ PINDAH KE SINI
        return super().post(request, *args, **kwargs)


# DETAIL
class ReportDetailView(DetailView):
    model = Report
    template_name = 'main_app/report_detail.html'