import TabirIdb from '../utils/db';

class LoginPresenter {
    async login({ email, password }) {
        try {
            const response = await fetch('https://tabir-backend-service-production.up.railway.app/authentications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            switch (response.status) {
                case 200:
                    await TabirIdb.putUserData({
                        id: 'currentUser',
                        email: email,
                        token: data.token,
                    });
                    window.location.hash = '#/dashboard';
                    break;
                case 400:
                    alert('Invalid email or password format');
                    break;
                case 401:
                    alert('Invalid credentials');
                    break;
                case 404:
                    alert('User not found');
                    break;
                default:
                    throw new Error('Server error');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Failed to login. Please check your connection and try again.');
        }
    }
}

export default LoginPresenter; 