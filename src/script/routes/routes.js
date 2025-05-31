import Home from '../view/pages/home';
import Login from '../view/pages/login';
import Register from '../view/pages/register';
import Dashboard from '../view/pages/dashboard';
import Detection from '../view/pages/detection';

const routes = {
    '/': {
        render: () => Home.render(),
        afterRender: () => Home.afterRender(),
        needsAuth: false,
    },
    '/login': {
        render: () => Login.render(),
        afterRender: () => Login.afterRender(),
        needsAuth: false,
    },
    '/register': {
        render: () => Register.render(),
        afterRender: () => Register.afterRender(),
        needsAuth: false,
    },
    '/detection': {
        render: () => Detection.render(),
        afterRender: () => Detection.afterRender(),
        needsAuth: true,
    },
    '/dashboard': {
        render: () => Dashboard.render(),
        afterRender: () => Dashboard.afterRender(),
        needsAuth: true,
    },
};

export default routes; 