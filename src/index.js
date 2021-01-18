import Vue from 'vue';

import router from './plugin/router.js';
import cookie from './plugin/cookies.js';
import bulma from './plugin/bulma.js';
import buefy from './plugin/buefy.js';
import mdifont from './plugin/mdifont.js';

// import store from './core/store.js';

import App from './App.vue';

// Vue.prototype.$store = store;

if(PRODUCTION === undefined || CORDOVA === undefined) {
  throw Error('missing build settings');
}

console.log('POODLE BUILD SETTINGS');
console.log('  production:   ' + PRODUCTION);
console.log('  cordova:      ' + CORDOVA);
console.log('  content mode: ' + CONTENT_MODE);

if(CORDOVA) {
  // Wait for the deviceready event before using any of Cordova's device APIs.
  // See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
  document.addEventListener('deviceready', () => {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
  }, false);
}

new Vue({
  el: '#app',
  router: router,
  render: (h) => h(App),
});
