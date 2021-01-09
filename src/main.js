import Vue from 'vue';

import router from '@/plugin/router';
import cookie from '@/plugin/cookies';
import buefy from '@/plugin/buefy';
import mdifont from '@/plugin/mdifont';

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
