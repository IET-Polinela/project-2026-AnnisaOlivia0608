const routes = {

'#login': `

<div id="welcomePage" class="container text-center mt-5 pt-5">

    <h1 class="display-3 fw-bold">
        Selamat Datang di Smart City Portal
    </h1>

    <p class="lead text-muted mt-3">
        Silakan masuk atau mendaftar untuk mengelola laporan fasilitas kota.
    </p>

    <button
        class="btn btn-primary btn-lg px-5 mt-3"
        onclick="
            document.getElementById('welcomePage').style.display='none';
            document.getElementById('loginCard').style.display='flex';
        "
    >
        Login Warga
    </button>

</div>

<div
    id="loginCard"
    style="
        display:none;
        min-height:80vh;
        justify-content:center;
        align-items:center;
    "
>

    <div style="width:450px;">

        <div class="card shadow border-0 p-4">

            <h3 class="fw-bold text-center mb-4">
                Login Warga
            </h3>

            <form id="loginForm">

                <input
                    type="text"
                    id="loginUsername"
                    class="form-control mb-3"
                    placeholder="Username"
                    required
                >

                <input
                    type="password"
                    id="loginPassword"
                    class="form-control mb-3"
                    placeholder="Password"
                    required
                >

                <button
                    type="submit"
                    class="btn btn-primary w-100"
                >
                    Masuk
                </button>

            </form>

        </div>

    </div>

</div>

`,

'#register': `

<div id="registerWelcome" class="container text-center mt-5 pt-5">

    <h1 class="display-3 fw-bold">
        Selamat Datang di Smart City Portal
    </h1>

    <p class="lead text-muted mt-3">
        Silakan membuat akun baru untuk menggunakan layanan portal warga.
    </p>

    <button
        class="btn btn-success btn-lg px-5 mt-3"
        onclick="
            document.getElementById('registerWelcome').style.display='none';
            document.getElementById('registerCard').style.display='flex';
        "
    >
        Daftar Sekarang
    </button>

</div>

<div
    id="registerCard"
    style="
        display:none;
        min-height:80vh;
        justify-content:center;
        align-items:center;
    "
>

    <div style="width:500px;">

        <div class="card shadow border-0 p-4">

            <h2 class="fw-bold text-center mb-4">
                Daftar Akun Baru
            </h2>

            <form id="registerForm">

                <input
                    type="text"
                    class="form-control mb-3"
                    placeholder="Username"
                    required
                >

                <input
                    type="email"
                    class="form-control mb-3"
                    placeholder="Email"
                    required
                >

                <input
                    type="password"
                    class="form-control mb-3"
                    placeholder="Password"
                    required
                >

                <button
                    type="submit"
                    class="btn btn-success w-100"
                >
                    Daftar Sekarang
                </button>

            </form>

        </div>

    </div>

</div>

`,

    '#dashboard': `
        <div class="row g-4">

            <!-- SIDEBAR KIRI -->
            <aside class="col-12 col-lg-3">

                <div
                    class="card border-0 p-3 shadow-sm sticky-top"
                    style="top:20px;"
                >

                    <button
                        class="btn btn-primary btn-lg w-100 fw-bold mb-3"
                        data-bs-toggle="modal"
                        data-bs-target="#reportModal"
                    >
                        <i class="bi bi-plus-circle-fill me-2"></i>
                        Laporan Baru
                    </button>

                    <hr>

                    <h6 class="fw-bold">
                        <i class="bi bi-bar-chart-fill me-2"></i>
                        Rekap Status
                    </h6>

                    <div id="summaryStats">
                        Memuat data...
                    </div>

                </div>

            </aside>

            <!-- KONTEN TENGAH -->
            <section class="col-12 col-lg-6">

                <div class="card border-0 shadow-sm p-3 mb-3">

                    <div class="btn-group w-100">

                        <button
                            class="btn btn-outline-primary"
                            onclick="loadDashboardData('my_reports',1)"
                        >
                            Laporan Saya
                        </button>

                        <button
                            class="btn btn-outline-primary"
                            onclick="loadDashboardData('feed',1)"
                        >
                            Feed Kota
                        </button>

                    </div>

                </div>

                <!-- LIST LAPORAN -->
                <div
                    id="listContainer"
                    class="row g-3"
                >
                </div>

                <!-- PAGINATION -->
                <div
                    id="paginationContainer"
                    class="mt-4"
                >
                </div>

            </section>

            <!-- SIDEBAR KANAN -->
            <aside class="col-lg-3 d-none d-lg-block">

                <div
                    class="card border-0 p-3 shadow-sm sticky-top"
                    style="top:20px;"
                >

                    <h6 class="fw-bold">

                        <i class="bi bi-info-circle-fill text-primary me-2"></i>

                        Pengumuman

                    </h6>

                    <p class="small text-muted">
                        Belum ada pengumuman.
                    </p>

                </div>

            </aside>

        </div>
    `
};

function handleRouting() {

    const hash =
        window.location.hash || '#login';

    document.getElementById(
        'app-content'
    ).innerHTML =
        routes[hash] || routes['#login'];

    if (
        hash === '#login' &&
        typeof setupLoginForm === 'function'
    ) {
        setupLoginForm();
    }

    if (hash === '#dashboard') {

        if (
            typeof loadDashboardData === 'function'
        ) {
            loadDashboardData(
                'my_reports',
                1
            );
        }

        if (
            typeof loadSummaryStats === 'function'
        ) {
            loadSummaryStats();
        }

    }

}

window.addEventListener(
    'hashchange',
    handleRouting
);

window.addEventListener(
    'DOMContentLoaded',
    handleRouting
);