console.log("APP JS BERHASIL DIMUAT");

let allReports = [];
let editingReportId = null;
let currentTab = 'my_reports';
let currentPage = 1;
let totalPages = 1;

async function loadDashboardData(
    tab = currentTab,
    page = currentPage
) {

    currentTab = tab;
    currentPage = page;

    const response = await requestAPI(
        `/api/v1/report/?tab=${tab}&page=${page}`,
        'GET'
    );

    const data = await response.json();

    console.log("DATA =", data);

    if (response.status === 200) {

        allReports = data.results || [];

        const totalData =
            data.count || 0;

        totalPages =
            Math.ceil(totalData / 10);

        renderList();
        renderPagination();

        loadSummaryStats();

    } else {

        const listContainer =
            document.getElementById(
                'listContainer'
            );

        if (listContainer) {

            listContainer.innerHTML = `
                <div class="col-12 text-center text-muted p-5">
                    <i class="bi bi-exclamation-triangle fs-1"></i>
                    <p>Gagal memuat data laporan.</p>
                </div>
            `;
        }
    }
}

async function loadSummaryStats() {

    const response = await requestAPI(
        '/api/v1/report/?tab=my_reports&page_size=1000',
        'GET'
    );

    const data = await response.json();

    if (response.status === 200) {

        const reports =
            data.results || [];

        const draftCount =
            reports.filter(
                report => report.status === 'DRAFT'
            ).length;

        const reportedCount =
            reports.filter(
                report => report.status === 'REPORTED'
            ).length;

        const verifiedCount =
            reports.filter(
                report => report.status === 'VERIFIED'
            ).length;

        const progressCount =
            reports.filter(
                report => report.status === 'IN_PROGRESS'
            ).length;

        const resolvedCount =
            reports.filter(
                report => report.status === 'RESOLVED'
            ).length;

        const summaryElement =
            document.getElementById(
                'summaryStats'
            );

        if (summaryElement) {

            summaryElement.innerHTML = `
                <div class="mb-2">
                    Draft :
                    <span class="badge bg-secondary">
                        ${draftCount}
                    </span>
                </div>

                <div class="mb-2">
                    Reported :
                    <span class="badge bg-primary">
                        ${reportedCount}
                    </span>
                </div>

                <div class="mb-2">
                    Verified :
                    <span class="badge bg-info">
                        ${verifiedCount}
                    </span>
                </div>

                <div class="mb-2">
                    In Progress :
                    <span class="badge bg-warning text-dark">
                        ${progressCount}
                    </span>
                </div>

                <div class="mb-2">
                    Resolved :
                    <span class="badge bg-success">
                        ${resolvedCount}
                    </span>
                </div>
            `;
        }
    }
}

function renderList() {

    const container =
        document.getElementById(
            'listContainer'
        );

    if (!container) return;

    container.innerHTML = '';

    allReports.forEach(report => {

        container.innerHTML += `
            <div class="col-12">

                <div class="card shadow-sm border-0">

                    <div class="card-body">

                        <h5 class="fw-bold">
                            ${report.title}
                        </h5>

                        <p class="text-muted small">
                            ${report.updated_at}
                        </p>

                        <p class="text-muted mb-2">
                            ${report.location}
                        </p>

                        <p class="text-muted">
                                Pelapor: ${report.reporter_name}
                        </p>

                        <p>
                            ${report.description}
                        </p>

                        <span class="badge ${
                            report.status === 'DRAFT'
                                ? 'bg-secondary'
                                : report.status === 'REPORTED'
                                ? 'bg-primary'
                                : report.status === 'VERIFIED'
                                ? 'bg-info'
                                : report.status === 'IN_PROGRESS'
                                ? 'bg-warning text-dark'
                                : report.status === 'RESOLVED'
                                ? 'bg-success'
                                : 'bg-secondary'
                        }">
                            ${report.status.replace('_', ' ')}
                        </span>

                        ${
                            report.status === 'DRAFT'
                            ?
                            `
                            <button
                                class="btn btn-warning btn-sm ms-2"
                                onclick="editDraft(${report.id})"
                            >
                                Edit
                            </button>
                            `
                            :
                            ''
                        }

                    </div>

                </div>

            </div>
        `;
    });
}

function renderPagination() {

    const container =
        document.getElementById(
            'paginationContainer'
        );

    if (!container) return;

    container.innerHTML = `
        <div
            class="d-flex justify-content-center align-items-center gap-3 mt-4"
        >

            <button
                class="btn btn-outline-primary"
                onclick="loadDashboardData(currentTab, ${currentPage - 1})"
                ${currentPage <= 1 ? "disabled" : ""}
            >
                ← Previous
            </button>

            <span class="fw-bold">
                Halaman ${currentPage} dari ${totalPages}
            </span>

            <button
                class="btn btn-outline-primary"
                onclick="loadDashboardData(currentTab, ${currentPage + 1})"
                ${currentPage >= totalPages ? "disabled" : ""}
            >
                Next →
            </button>

        </div>
    `;
}

async function editDraft(id) {

    const report =
        allReports.find(
            item => item.id === id
        );

    if (!report) return;

    editingReportId = id;

    document.getElementById(
        'reportTitle'
    ).value = report.title;

    document.getElementById(
        'reportCategory'
    ).value = report.category;

    document.getElementById(
        'reportDescription'
    ).value = report.description;

    document.getElementById(
        'reportLocation'
    ).value = report.location;

    const modal =
        new bootstrap.Modal(
            document.getElementById(
                'reportModal'
            )
        );

    modal.show();
}

async function submitReport(status) {

    const payload = {

        title:
            document.getElementById(
                'reportTitle'
            ).value,

        category:
            document.getElementById(
                'reportCategory'
            ).value,

        description:
            document.getElementById(
                'reportDescription'
            ).value,

        location:
            document.getElementById(
                'reportLocation'
            ).value,

        status: status
    };

    let endpoint =
        '/api/v1/report/';

    let method =
        'POST';

    if (
        editingReportId !== null
    ) {

        endpoint =
            `/api/v1/report/${editingReportId}/`;

        method =
            'PUT';
    }

    const response =
        await requestAPI(
            endpoint,
            method,
            payload
        );

    if (
        response.status === 201
        ||
        response.status === 200
    ) {

        const form =
            document.getElementById(
                'reportForm'
            );

        form.reset();

        editingReportId = null;

        const modal =
            bootstrap.Modal.getInstance(
                document.getElementById(
                    'reportModal'
                )
            );

        if (modal) {
            modal.hide();
        }

        loadDashboardData();
    }
}

document.addEventListener(
    'click',
    function() {

        const draftBtn =
            document.getElementById(
                'btnDraft'
            );

        const submitBtn =
            document.getElementById(
                'btnSubmit'
            );

        if (draftBtn) {

            draftBtn.onclick =
                () =>
                submitReport(
                    'DRAFT'
                );
        }

        if (submitBtn) {

            submitBtn.onclick =
                () =>
                submitReport(
                    'REPORTED'
                );
        }

    }
);

window.editDraft = editDraft;
window.submitReport = submitReport;
window.loadDashboardData = loadDashboardData;