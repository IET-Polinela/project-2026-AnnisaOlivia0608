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