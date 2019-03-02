<template>
  <div v-if="ntfShowSign" class="ntf_box" @click.stop="ntfSwitch">
    <icon-ntf class="ntf_icon_ok" />
    <p class="ntf_text">{{ntfLength}}</p>
  </div>
</template>
<script>

import iconntf from '../assets/ntf.svg';
import {mapGetters} from 'vuex';
import { mapMutations } from 'vuex';
import { mapActions } from 'vuex';
import {router} from '../routes.js'

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');

function showNotification() {
  Notification.requestPermission(function(result) {
    if (result === 'granted') {
      navigator.serviceWorker.ready.then(function(registration) {
        registration.showNotification('Vibration Sample', {
          body: 'Buzz! Buzz!',
          // icon: '../images/touch/chrome-touch-icon-192x192.png',
          // vibrate: [200, 100, 200, 100, 200, 100, 200],
          // tag: 'vibration-sample'
        });
      });
    }
  });
}

export default {
  props: [],
  components: {
    'icon-ntf': iconntf,
  },
  data() {
    return {
      ntfShow:false,
      ntfLocalAddress:""
    }
  },
  methods: {
    ...mapActions([]),
    ...mapMutations([]),
    ntfSwitch(){this.$router.push("/"+this.ntfObject.addr);
      this.$emit('noteclicked');
    }
  },
  computed: {
    ...mapGetters(['ntfObject']),
    ntfShowSign(){
      if(this.ntfObject)
        if(this.ntfObject.obj)
          if(this.ntfObject.obj.list)
            if(this.ntfObject.obj.list.objects)
              if(this.ntfObject.obj.list.objects.length>0) return true;

      return false;
    },
    ntfLength(){
      if(this.ntfObject)
        if(this.ntfObject.obj)
          if(this.ntfObject.obj.list)
            if(this.ntfObject.obj.list.objects)
            {  if(this.ntfObject.obj.list.objects.length>0)
                showNotification();
                // this.$notification.show('Babcom opened', {
                //   body: 'hey!'
                // }, {});
               return this.ntfObject.obj.list.objects.length;
            }
      return 0;
    }
  }
}
</script>
<style scoped>

.ntf_box {
  position: fixed;
   /* background: red; */
  height:200px;
  width: 200px;
  top: 0px;
  right: 0px;
  z-index: 3000000;
}

.ntf_icon_ok
{
  height: 100%;
  width: 100%;
  fill:rgba(51, 153, 255, 1);
  position: absolute;
}

.ntf_text
{
  top:10px;
  right:10px;
  font-size: 30px;
  font-weight: bold;
  fill:rgba(51, 153, 255, 1);
  position: absolute;
}

.ntf_icon_cancel
{
  height: 100%;
  width: 100%;
  fill:rgba(51, 153, 255, 0.4);
  position: absolute;
}
</style>
