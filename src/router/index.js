import { createRouter, createWebHistory } from "vue-router";
import Dashboard from '../components/Dashboard.vue';
import AppLayout from '../components/AppLayout.vue';
import Appointment from '../components/Appointment.vue';
import BloodRequest from '../components/BloodRequest.vue';
import Login from '../components/Login.vue';
import NotFound from '../components/NotFound.vue';
import store from '../store/index';

const routes = [
  {
    path: '/',
    name: 'home',
    beforeEnter: (to, from, next) => {
      const isAuthenticated = !!store.getters.getUserToken;
      if (isAuthenticated) {
        next({ name: 'dashboard' });
      } else {
        next({ name: 'login' });
      }
    }
  },
  {
    path: '/user',
    name: 'user',
    component: AppLayout,
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: {
          requireAuth: true
        },
      },
      {
        path: '/appointment',
        name: 'appointment',
        component: Appointment,
        meta: {
          requireAuth: true
        },
      },
      {
        path: '/blood-request',
        name: 'requests',
        component: BloodRequest,
        meta: {
          requireAuth: true
        },
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      requireGuest: true
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requireAuth;
  const requiresGuest = to.meta.requireGuest;
  const isAuthenticated = !!store.getters.getUserToken;

  if (requiresAuth && !isAuthenticated) {
    next({ name: "login" });
  } else if (requiresGuest && isAuthenticated) {
    next({ name: "dashboard" });
  } else {
    next();
  }
});

export default router;
