<template>
<div class="stn_menu">
  <div  @click="stnSwitch">
    <icon-stn :class="stnStatus" />
  </div>
  <div class="stn_main " v-if="stnShow">
    <div class="stn_box">
      <div class="stnAlignV">
        <h2 class="stn_warning">Настройки!</h2><br>
        Адрес сервера(host:port)
        <b-input
          type="text"
          v-model="stnLocalAddress"
          />
          {{stnLocalAddress}}
      </div>
    <br>
      <div class="stnAlign">
        <b-button-group style="width:300px;">
          <b-button variant="primary" v-on:click="stnActOk" class="stnyesnobutton" style="width:150px;"> Ok! </b-button>
          <b-button variant="danger" v-on:click="stnActCancel" class="stnyesnobutton" style="width:150px;">Cancel</b-button>
        </b-button-group>
      </div>
    </div>
  </div>
</div>
</template>
<script>

import iconStn from '../assets/settings.svg';
import {mapGetters} from 'vuex';
import { mapMutations } from 'vuex';
import { mapActions } from 'vuex';

export default {
  props: [],
  components: {
    'icon-stn': iconStn,
  },
  data() {
    return {
      stnShow:false,
      stnLocalAddress:""
    }
  },
  methods: {
    ...mapActions(['connectServ']),
    ...mapMutations(['servAddressSet']),
    stnActOk() {
      this.servAddressSet(this.stnLocalAddress);
      this.connectServ();
      this.stnShow=false;
      return false;
    },
    stnActCancel() {
      this.stnShow=false;
      this.stnLocalAddress=this.stnAddress();
      return false;
    },
    stnAddress(){
      return  this.socketGet.serverAddress;
    },
    stnSwitch(){this.stnShow=!this.stnShow}
  },
  mounted(){
    this.stnLocalAddress=this.stnAddress();

  },
  computed: {
    ...mapGetters(['socketGet']),
    stnStatus() {
      if(this.socketGet.isConnected) return "stn_icon_ok";
      else return "stn_icon_cancel";
    },
  }
}
</script>
<style scoped>

.stn_menu {
  position: fixed;
   /* background: red; */
  height: 52px;
  bottom: 10px;
  left: -5px;
  z-index: 3000000;
  borderd: 1px solid red;
}

.stn_main {
  position: fixed;
  display: flex;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(28,43,81,0.95);
  width: 100%;
  padding: 10vh;
  height: 100vh;
  top: 0px;
  left: 0px;
  z-index: 2000000;
}

.stn_box {
  border: 2px rgba(51,153,255,0.75) solid;
  background: rgba(51,153,255,0.11);
  overflow: auto;
  padding: 20px;
}

.stn_title {}

.stn_warning {
  color: red;
}

.stnyesnobutton {
  width: 100px;
}
.stnAlignV {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.stnAlign {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.stn_icon_ok
{
  height: 32px;
  width: 32px;
  fill:rgba(51, 153, 255, 1);
  position: absolute;
  bottom: 10px;
  left: 10px;
}
.stn_icon_cancel
{
  height: 32px;
  width: 32px;
  fill:rgba(51, 153, 255, 0.4);
  position: absolute;
  bottom: 10px;
  left: 10px;
}
</style>
