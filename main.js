
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './css/icons.css'

//components
import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'

import { sync } from 'vuex-router-sync'
import {store} from './store/'
//css


Vue.use(BootstrapVue);

import VueNativeSock from 'vue-native-websocket'
Vue.use(VueNativeSock, 'ws://123', {connectManually: true});

import {router} from './routes.js'

const unsync = sync(store, router);

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})

if(store.getters.socketGet.serverAddress.length>0) store.dispatch('connectServ');

  // window.onclick = function(e) {
  //       if (e.target.localName == 'a') {
  //         if (e.target.href.substring(0,7) === 'babcom:') {
  //           router.push(e.target.href.substring(7,e.target.href.length));
  //           return false;
  //         }
  //       }
  //     }

  // if (typeof window.event != 'undefined')
  //   document.onkeydown = function()
  //   	{
  //   		if (event.srcElement.tagName.toUpperCase() != 'INPUT')
  //   			return (event.keyCode != 8);
  //   	}
  //   else
    	document.onkeypress = function(e)
    	{
    		if (e.target.nodeName.toUpperCase() != 'INPUT')
    			return (e.keyCode != 8);
      }
