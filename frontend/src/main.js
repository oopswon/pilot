import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { createRouter, createWebHistory } from 'https://unpkg.com/vue-router@4/dist/vue-router.esm-browser.js';

import App from './components/App.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import Dashboard from './pages/Dashboard.js';
import PipelineList from './pages/PipelineList.js';
import PipelineDetail from './pages/PipelineDetail.js';
import PipelineForm from './pages/PipelineForm.js';
import EventForm from './pages/EventForm.js';
import { authGuard } from './utils/auth.js';

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { 
        path: '/dashboard', 
        component: Dashboard,
        beforeEnter: authGuard
    },
    { 
        path: '/pipelines', 
        component: PipelineList,
        beforeEnter: authGuard
    },
    { 
        path: '/pipelines/:id', 
        component: PipelineDetail,
        beforeEnter: authGuard
    },
    { 
        path: '/pipelines/new', 
        component: PipelineForm,
        beforeEnter: authGuard
    },
    { 
        path: '/pipelines/:id/edit', 
        component: PipelineForm,
        beforeEnter: authGuard
    },
    { 
        path: '/pipelines/:id/events/new', 
        component: EventForm,
        beforeEnter: authGuard
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

const app = createApp(App);
app.use(router);
app.mount('#app');
