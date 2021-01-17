import Vue from 'vue';

import router from './plugin/router.js';
import cookie from './plugin/cookies.js';
import bulma from './plugin/bulma.js';
import buefy from './plugin/buefy.js';
import mdifont from './plugin/mdifont.js';

// import store from './core/store.js';

import App from './App.vue';

// Vue.prototype.$store = store;

console.log('poodle starting up...');
console.log('  production:   ' + PRODUCTION);
console.log('  cordova:      ' + CORDOVA);

new Vue({
  el: '#app',
  router: router,
  render: (h) => h(App),
});
