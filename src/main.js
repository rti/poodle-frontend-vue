import Vue from 'vue';
import router from './plugins/router';
import App from './App.vue';
import store from '@/plugins/store.js'

if (process.env.NODE_ENV !== 'production') {
  console.log('Running in development mode!');
}

Vue.prototype.$store = store;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
