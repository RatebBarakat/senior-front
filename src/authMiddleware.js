import store from './store/index';

export default async function authMiddleware(to, from, next) {
  const requiresAuth = to.meta.requireAuth;
  const requiresGuest = to.meta.requireGuest;

  if (requiresAuth) {
    const token = getTokenFromLocalStorage();
    console.log('token :>> ', token);
    const user = await getUserDataFromStore();

    if (!token || !user) {
      next({ name: "login" });
    } else {
      next();
    }
  } else if (requiresGuest) {
    const token = getTokenFromLocalStorage();
    const user = await getUserDataFromStore();

    if (token && user) {
      next({ name: "dashboard" });
    } else {
      next();
    }
  } else {
    next();
  }
}

function getTokenFromLocalStorage() {
  return localStorage.getItem("token");
}

async function getUserDataFromStore() {
  await store.dispatch("fetchUserData");
  return store.getters["getUserData"];
}
