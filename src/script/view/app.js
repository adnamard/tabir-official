import routes from '../routes/routes';

class App {
    constructor({ content }) {
        this._content = content;
        this._handleHashChange = this._handleHashChange.bind(this);
        window.addEventListener('hashchange', this._handleHashChange);
        window.addEventListener('load', this._handleHashChange);
    }

    _handleHashChange() {
        this.renderPage();
    }

    async renderPage() {
        try {
            const url = window.location.hash.slice(1).toLowerCase();
            const page = routes[url] || routes['/'];

            // Check authentication for protected routes
            if (page.needsAuth) {
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    window.location.hash = '#/login';
                    return;
                }

                try {
                    // You can add token validation here if needed
                    if (!token) throw new Error('Invalid token');
                } catch (error) {
                    localStorage.removeItem('auth_token');
                    window.location.hash = '#/login';
                    return;
                }
            }

            // Redirect logged-in users from auth pages to dashboard
            if ((url === '/login' || url === '/register') && localStorage.getItem('auth_token')) {
                window.location.hash = '#/dashboard';
                return;
            }

            const content = await page.render();
            if (this._content) {
                this._content.innerHTML = content;
                await page.afterRender();
            } else {
                console.error('Content element not found');
            }
        } catch (error) {
            console.error('Error rendering page:', error);
        }
    }
}

export default App; 