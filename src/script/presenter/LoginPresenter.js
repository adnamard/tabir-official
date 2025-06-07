const BASE_URL = process.env.API_BASE_URL;

class LoginPresenter {
    async login({ username, password }) {
        try {
            const response = await fetch(`${BASE_URL}/authentications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const rawBody = await response.text();

            let data;
            try {
                data = JSON.parse(rawBody);
            } catch (e) {
                console.error('Response is not valid JSON');
                throw new Error('Unexpected server response');
            }

            switch (response.status) {
                case 201:
                    localStorage.setItem('auth_token', data.data.accessToken);
                    window.location.hash = '#/dashboard';
                    return true;
                case 400:
                    throw new Error('Format username atau password tidak valid');
                case 401:
                    throw new Error('Kredensial tidak valid');
                case 404:
                    throw new Error('Pengguna tidak ditemukan');
                default:
                    throw new Error('Terjadi kesalahan server');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }
}

export default LoginPresenter;
