import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import store from './store/index';
import Toast, { POSITION } from "vue-toastification";
import './css/tailwind.css';
import './assets/tailwind.css';
import './css/modal.css';
import "vue-toastification/dist/index.css";
import './css/index.css';
import './css/sniper.css';

const app = createApp(App);
app.use(store);
app.use(Toast, {
    position: POSITION.TOP_RIGHT,
    defadefaultDuration: 4000,
});
app.use(router);
app.mount('#app');
