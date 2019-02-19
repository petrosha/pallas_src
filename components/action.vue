<template>
   <div class="act_main ">
     <b-container fluid >
       <b-row>
         <b-col sd="1" md="2" lg="2" class="act_bcol"></b-col>
         <b-col sd="10" md="8" lg="8" class="act_bcol">
           <div class="act_dialog_box">
              <h2 v-if="actActActiveName" v-html="actActActiveName" class="act_title titleAlign"></h2>
              <div v-for="par in actActActive.user_params">
                <s-parint v-if="par.type==='integer'"
                  :par="par"
                  @parChange="actParChange"
                  @par_done="actParDone">
                </s-parint>
                <s-parflt v-if="par.type==='float'"
                  :par="par"
                  @parChange="actParChange"
                  @par_done="actParDone">
                </s-parflt>
                <s-parstr v-if="par.type==='string'"
                  :par="par"
                  @parChange="actParChange"
                  @par_done="actParDone">
                </s-parstr>
              </div>
              <!-- {{actActActive}} -->
            <div class="btnAlign">
              <b-button-group style="width:300px;">
                  <b-button :disabled="actValid" variant="primary" v-on:click="actOkBtn" style="width:150px;">ОК</b-button>
                <b-button variant="danger" v-on:click="actCancel" style="width:150px;">Отмена</b-button>
              </b-button-group>
            </div>
           </div>
         </b-col>
         <b-col sd="1" md="2" lg="2" class="act_bcol"></b-col>
       </b-row>
     </b-container>
     <s-warning
       v-if="wrnStat"
       @done="actWrnDone"
       :title="actActActive.warning">
      </s-warning>
   </div>
</template>
<script>
import {mapGetters} from 'vuex';
import { mapMutations } from 'vuex';
import { mapActions } from 'vuex';

import singleWarning from './warning.vue';
import parInt from './par_int.vue';
import parFlt from './par_flt.vue';
import parStr from './par_str.vue';

import {convSet} from './stringlib.js';
const conv=convSet();

import {router} from '../routes.js'

  export default {
    props:['objid','actid'],
    components:{
      's-parint': parInt,
      's-parflt': parFlt,
      's-parstr': parStr,
      's-warning': singleWarning
    },
    data () {
      return {
        wrnStat:false,
        objInfo:{
          actid: this.actid,
          obj: this.objid,
        },
      }
    },
    created(){
      this.parSet(this.objInfo);
    },
    methods:{
      ...mapMutations(["parSet","parChange"]),
      ...mapActions(['sendAct']),
      actWrnDone(reply){
        this.wrnStat=false;
        if(reply==="ok") this.actSend();
      },
      actCancel(){
        router.beforeHooks.length=0;
        this.$emit("done","cancel");
        return false;
      },
      actSend(){
        router.beforeHooks.length=0;
        this.sendAct(this.objInfo);
        this.$emit("done","ok");
      },
      actParDone(){
        if(this.actValid){}
        else this.actOkBtn();
      },
      actOkBtn(){
        if("warning" in this.actActActive) this.wrnStat=true;
        else this.actSend();
      },
      actParChange(payload)
      {
        this.parChange({objInfo:this.objInfo,data:payload});
      }
    },
    computed:{
      actOneObject(){
        return this.objInfo.obj;
      },
      actActActive(){
        if(this.objInfo.actid in this.actOneObject.actions)
          return this.actOneObject.actions[this.objInfo.actid];
        else {
          console.log("Action: Wrong Action: "+this.objInfo.actid);
          this.$emit("done");
          return false;
        }
      },
      actActActiveName(){
        if(this.actActActive)
          if("name" in this.actActActive) return  conv.makeHtml(this.actActActive.name);
        return false;
      },
      actValid(){
        if(this.actActActive.valid==0) return true;
        else return false;
      },
      actName(){
        if("name" in this.actActActive){
          return this.actActActive.name;
        }
        else return false;
      },
    }
  }
</script>
<style scoped>
  .act_main
  {
    position: fixed;
  	background: rgba(28,43,81,0.95);
  	width:100%;
    padding: 5vh 1vw 5vh 1vw;
  	height: 100vh;
  	top: 0px;
  	left: 0px;
    z-index: 1000000;
  }
  .act_bcol
  {
  }
  .act_dialog_box
  {
    border: 2px rgba(51,153,255,0.75) solid;
    background: rgba(51,153,255,0.11);
  	height: 90vh;
    width:100%;
  	overflow: auto;
    padding: 20px;
  }
  .act_title
  {
  }
  .btnAlign {
    width:100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom:20px;
  }
  .titleAlign {
    width:100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .actyesnobutton{
    width:100px;
  }
</style>
