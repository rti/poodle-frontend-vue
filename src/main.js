import Vue from 'vue';
import router from '@/core/router';
import cookie from '@/core/cookies';
import store from '@/core/store';
import App from '@/App.vue';

if (process.env.NODE_ENV !== 'production') {
  console.log('Running in development mode!');
}

Vue.prototype.$store = store;

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
