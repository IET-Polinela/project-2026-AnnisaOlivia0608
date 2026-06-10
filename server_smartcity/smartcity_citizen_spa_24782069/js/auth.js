function setupLoginForm() {

    const loginForm =
        document.getElementById(
            "loginForm"
        );

    if (!loginForm) return;

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const username =
                document.getElementById(
                    "loginUsername"
                ).value;

            const password =
                document.getElementById(
                    "loginPassword"
                ).value;

            try {

                const response =
                    await requestAPI(
                        "/api/token/",
                        "POST",
                        {
                            username,
                            password
                        }
                    );

                const data =
                    await response.json();

                    if (response.status === 200) {

                        localStorage.setItem(
                            "access_token",
                            data.access
                        );

                        localStorage.setItem(
                            "refresh_token",
                            data.refresh
                        );

                        localStorage.setItem(
                            "username",
                            username
                        );

                        updateNavbar(username);

                        alert(
                            "Login berhasil!"
                        );

                        window.location.hash =
                            "#dashboard";

                } else {

                    alert(
                        "Username atau password salah!"
                    );

                }

            } catch (error) {

                console.error(error);

                alert(
                    "Terjadi kesalahan koneksi!"
                );

            }

        }
    );
}

function updateNavbar(username) {

    const navbar =
        document.getElementById(
            "navbar-user"
        );

    if (!navbar) return;

    navbar.innerHTML = `
        <span class="text-white me-3">
            👤 ${username}
        </span>

        <button
            class="btn btn-outline-light me-2"
            onclick="window.location.hash='#dashboard'"
        >
            Dashboard
        </button>

        <button
            class="btn btn-danger"
            onclick="logoutUser()"
        >
            Logout
        </button>
    `;
}

function logoutUser() {

    localStorage.removeItem(
        "access_token"
    );

    localStorage.removeItem(
        "refresh_token"
    );

    localStorage.removeItem(
        "username"
    );

    location.hash = "#login";

    location.reload();
}

window.addEventListener(
    "DOMContentLoaded",
    () => {

        const username =
            localStorage.getItem(
                "username"
            );

        if (username) {
            updateNavbar(username);
        }

    }
);