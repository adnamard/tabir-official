import 'regenerator-runtime';
import App from './view/app';

const app = new App({
    content: document.querySelector('#content'),
});

window.addEventListener('hashchange', () => {
    app.renderPage();
});

window.addEventListener('load', async () => {
    app.renderPage();
}); 