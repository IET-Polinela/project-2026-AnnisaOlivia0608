let allReports = [];
let currentTab = 'my_reports';
let currentPage = 1;
let totalPages = 1;

async function loadDashboardData(tab = currentTab, page = currentPage) {
    currentTab = tab;
    currentPage = page;

    const response = await requestAPI(
        `/report/?tab=${tab}&page=${page}`,
        'GET'
    );

    if (response && response.status === 200) {

        allReports = response.data.results || [];

        const totalData = response.data.count || 0;

        totalPages = Math.ceil(totalData / 10);

        renderList();
        renderPagination();

    } else {

        const listContainer = document.getElementById('listContainer');

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

function renderList() {
    console.log("Render laporan:", allReports);
}

function renderPagination() {
    console.log("Render pagination:", totalPages);
}