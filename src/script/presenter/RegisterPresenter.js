const BASE_URL = process.env.API_BASE_URL;

class RegisterPresenter {
    async register({ fullname, username, password }) {
        try {
            const response = await fetch(`${BASE_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fullname, username, password }),
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
                    return true;
                case 400:
                    throw new Error('Data registrasi tidak valid. Harap periksa masukan Anda.');
                case 409:
                    throw new Error('Username sudah ada');
                default:
                    throw new Error('Terjadi kesalahan server');
            }
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }
}

export default RegisterPresenter;
