import { createRouter, createWebHistory } from "vue-router";
import Dashboard from '../components/Dashboard.vue';
import AppLayout from '../components/AppLayout.vue';
import Appointment from '../components/Appointment.vue';
import BloodRequest from '../components/BloodRequest.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import Notification from '../components/Notification.vue';
import GoogleLogin from '../components/GoogleLogin.vue';
import Profile from '../components/Profile.vue';
import NotFound from '../components/NotFound.vue';
import EmailVerification from '../components/EmailVerification.vue';
import ResetPassword from '../components/ResetPassword.vue';
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
        path: '/profile',
        name: 'profile',
        component: Profile,
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
      {
        path: '/notification',
        name: 'notification',
        component: Notification,
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
    path: '/register',
    name: 'register',
    component: Register,
    meta: {
      requireGuest: true
    },
  },
  {
    path: '/google/callback',
    name: 'googleLogin',
    component: GoogleLogin,
    meta: {
      requireGuest: true
    },
  },
  {
    path: '/reset',
    name: 'resetPass',
    component: ResetPassword,
    meta: {
      requireGuest: true
    },
  },
  {
    path : '/verify-email',
    name : 'verify',
    component : EmailVerification,
    meta : {
      requireGuest : true
    }
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
