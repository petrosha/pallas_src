import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);
import MainObject from './App.vue';
import Error404 from './components/404.vue';

const  routes = [
  // { path: '*', component:  Error404 },
  // { path: '/:id', component: MainObject },
  // { path: '/:id', component:  MainObject },
];

export const router = new VueRouter({
  // mode: 'history',
   base: '/pallas',
  routes
});
