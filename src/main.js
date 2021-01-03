import Vue from 'vue';
import router from './plugins/router';
import App from './App.vue';

if (process.env.NODE_ENV !== 'production') {
  console.log('Running in development mode!');
}

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
