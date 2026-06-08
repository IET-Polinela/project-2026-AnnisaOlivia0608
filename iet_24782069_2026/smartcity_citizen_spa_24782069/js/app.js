console.log("APP JS BERHASIL DIMUAT");

let allReports = [];
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

                        <p class="text-muted mb-2">
                            ${report.location}
                        </p>

                        <p>
                            ${report.description}
                        </p>

                        <span class="badge bg-primary">
                            ${report.status}
                        </span>

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
        <div class="text-center mt-3">
            Halaman ${currentPage}
            dari ${totalPages}
        </div>
    `;
}