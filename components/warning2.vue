<template>
   <div class="wrn_main "  @click.stop="" >
     <div class="wrn_box">
        <div class="wrnAlign">
          <h1 class="wrn_warning" v-html="wrnTitle"></h1>
        <br>
        </div>
        <div class="wrnAlign">
          <h2 class="wrn_title" v-html="wrnMessage"></h2>
        </div>
        <br>
        <div  class="wrnAlign">
          <b-button-group style="width:300px;">
            <b-button variant="primary" v-on:click="wrnActOk" class="wrnyesnobutton" style="width:150px;"> ОК </b-button>
          </b-button-group>
        </div>
     </div>
   </div>
</template>
<script>
import {convSet} from './stringlib.js';
const conv=convSet();
import {router} from '../routes.js'

  export default {
    props:['title','message'],
    components:{
    },
    data () {
      return {
      }
    },
    methods:{
      wrnActOk(){
      router.beforeHooks.length=0;
        this.$emit("done","ok");
        return false;
      }
    },
    computed:{
      wrnTitle(){
        return conv.makeHtml(this.title);
      },
      wrnMessage(){
        return conv.makeHtml(this.message);
      }
    }
  }
</script>
<style scoped>
  .wrn_main
  {
    position: fixed;
    display: flex;
    width:100%;
    display: flex;
    align-items: center;
    justify-content: center;

  	background: rgba(28,43,81,0.95);
  	width:100%;
    padding: 10vh;
  	height: 100vh;
  	top: 0px;
  	left: 0px;
    z-index: 2000000;
  }
  .wrn_box
  {
    border: 2px rgba(51,153,255,0.75) solid;
    background: rgba(51,153,255,0.11);
  	overflow: auto;
    padding: 20px;
  }
  .wrn_title
  {
  }
  .wrn_warning
  {
    color:red;
  }
  .wrnyesnobutton
  {
    width:100px;
  }
  .wrnAlign {
    width:100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
