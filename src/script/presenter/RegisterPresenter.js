import TabirIdb from '../utils/db';

class RegisterPresenter {
    async register({ name, email, password }) {
        try {
            // First, register the user
            const registerResponse = await fetch('https://tabir-backend-service-production.up.railway.app/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const registerData = await registerResponse.json();

            switch (registerResponse.status) {
                case 201:
                    // If registration successful, proceed with login
                    const loginResponse = await fetch('https://tabir-backend-service-production.up.railway.app/authentications', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password }),
                    });

                    const loginData = await loginResponse.json();

                    if (loginResponse.status === 200) {
                        await TabirIdb.putUserData({
                            id: 'currentUser',
                            email: email,
                            name: name,
                            token: loginData.token,
                        });
                        window.location.hash = '#/dashboard';
                    } else {
                        throw new Error('Login failed after registration');
                    }
                    break;
                case 400:
                    alert('Invalid registration data. Please check your inputs.');
                    break;
                case 409:
                    alert('Email already exists');
                    break;
                default:
                    throw new Error('Server error during registration');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Failed to register. Please check your connection and try again.');
        }
    }
}

export default RegisterPresenter; 