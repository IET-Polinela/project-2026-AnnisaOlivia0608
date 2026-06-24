from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.views import View
from django.urls import reverse_lazy
from django.contrib import messages
from .models import Report
from .forms import ReportForm
from django.http import JsonResponse, HttpResponseForbidden

def report_detail_api(request, pk):
    report = Report.objects.get(pk=pk)

    data = {
        'title': report.title,
        'location': report.location,
        'status': report.status,
        'description': report.description,
    }

    return JsonResponse(data)

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
    form_class = ReportForm
    template_name = 'main_app/add_report.html'
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
class ReportUpdateView(UpdateView):
    model = Report
    form_class = ReportForm
    template_name = 'main_app/update_report.html'
    success_url = '/reports/'

    def dispatch(self, request, *args, **kwargs):

        report = self.get_object()

        if request.user.is_admin:

            messages.error(
                request,
                "Admin tidak diperbolehkan mengubah isi laporan warga."
            )

            return redirect('report_list')

        if report.reporter != request.user:

            messages.error(
                request,
                "Akses ditolak! Anda hanya dapat mengubah laporan milik sendiri."
            )

            return redirect('report_list')

        if report.status != 'DRAFT':

            messages.error(
                request,
                "Hanya laporan DRAFT yang dapat diubah."
            )

            return redirect('report_list')

        return super().dispatch(
            request,
            *args,
            **kwargs
        )

    def form_valid(self, form):
        messages.success(
            self.request,
            "Laporan berhasil diperbarui!"
        )
        return super().form_valid(form)


# DELETE
class ReportDeleteView(DeleteView):
    model = Report
    template_name = 'main_app/delete_report.html'
    success_url = '/reports/'

    def dispatch(self, request, *args, **kwargs):

        report = self.get_object()

        if request.user.is_admin:

            messages.error(
                request,
                "Akses ditolak! Admin tidak diperbolehkan menghapus laporan warga."
            )

            return redirect('report_list')

        if report.reporter != request.user:

            messages.error(
                request,
                "Akses ditolak! Anda hanya dapat menghapus laporan milik sendiri."
            )

            return redirect('report_list')

        if report.status != 'DRAFT':

            messages.error(
                request,
                "Hanya laporan DRAFT yang dapat dihapus."
            )

            return redirect('report_list')

        return super().dispatch(
            request,
            *args,
            **kwargs
        )

    def post(self, request, *args, **kwargs):

        messages.success(
            self.request,
            "Laporan berhasil dihapus!"
        )

        return super().post(
            request,
            *args,
            **kwargs
        )

# DETAIL
class ReportDetailView(DetailView):
    model = Report
    template_name = 'main_app/report_detail.html'