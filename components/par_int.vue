<template>
  <div class="par_main">
    <b-container fluid >
      <b-row no-gutters>
        <b-col  sd="auto" md="auto" class="parAlign">
          <!-- значок для разметки только  -->
          <div class="par_icon_filler" />
        </b-col>
        <b-col sd="10" md="10">
          <span v-if="parDescrShow" class="par_name" v-html="parDescrShow"></span>
        </b-col>
        <b-col sd="1" md="1"></b-col>
      </b-row>
      <b-row no-gutters>
        <b-col  sd="auto" md="auto" class="parAlign">
          <icon-ok v-if="parSignStyle" class="par_icon_ok" />
          <icon-cancel v-if="!parSignStyle" class="par_icon_cancel" />
        </b-col>
        <b-col sd="10" md="10">
          <b-input
            type="text"
            v-model="parValue"
            ref="parfield"
            :formatter="parInput"
            v-on:keyup.enter.native="parEnter"
            autocomplete="off"
            >
          </b-input>
        </b-col>
        <b-col sd="1" md="1">
          <b-button
            v-show="parDefault"
            variant="outline-info"
            @click="parSetDefault">
            Default
          </b-button>
        </b-col>
      </b-row>
      <b-row no-gutters>
        <b-col  sd="auto" md="auto" class="parAlign">
          <!-- значок для разметки только  -->
        <div class="par_icon_filler" />
        </b-col>
        <b-col sd="10" md="10">
          <span v-if="!parSignStyle" class="par_warning">{{parWarning}}</span>
        </b-col>
        <b-col sd="1" md="1"></b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import iconOk from '../assets/icon-ok.svg';
import iconCancel from '../assets/icon-cancel.svg';
import {convSet} from './stringlib.js';
const conv=convSet();

  export default {
    props:["par"],
    components:{
      'icon-ok': iconOk,
      'icon-cancel':iconCancel
    },
    data () {
      return {
        parValue: "",
        parInt: NaN,
        parValid: 0,
        parMin: -Number.MAX_SAFE_INTEGER,
        parMax: Number.MAX_SAFE_INTEGER,
        parInputState: false
      }
    },
    mounted(){
      //если былоуже что-то введено, то оно сохранится. Иначе значение по умолчанию
      if(!isNaN(this.par.value)) this.parValue=this.par.value;
      else if("default_value" in this.par){
        this.parValue=this.par.default_value;
      }
      if("restrictions" in this.par){
        if("max_value" in this.par.restrictions) this.parMax=this.par.restrictions.max_value;
        if("min_value" in this.par.restrictions) this.parMin=this.par.restrictions.min_value;
      }
      this.parIsChanged();
    },
    methods:{
      parInput(val){
        let lval=val.toString().replace(/[^0-9\-]/gm,"");
        if(lval.length>0) lval=lval[0]+lval.substring(1).replace(/-/gm,"");
        this.parValue=lval;
        this.parIsChanged();
        return this.parValue;
      },
      parIsChanged(){
        let lint=parseInt(this.parValue,10);
        if(this.parInt!=lint){
          this.parInt=lint;
          this.parEmit();
        }
        let lvalid=this.parIsValid();
        if(this.parValid!=lvalid){
          this.parValid=lvalid;
          this.parEmit();
        }
      },
      parIsValid(){
        if(isNaN(this.parInt)) return 0;
        if(this.parMax<this.parInt) return 0;
        if(this.parMin>this.parInt) return 0;
        return 1;
      },
      parEmit(){
        this.$emit("parChange",{
          "code":this.par.code,
          "value": this.parInt,
          "valid": this.parValid
        });
      },
      parEnter(){
        this.$emit('par_done');
      },
      parSetDefault(){
        this.parValue=this.par.default_value;
        this.parIsChanged();
      }
    },
    computed:{
      parDescrShow()
      {
        if("description" in this.par) return conv.makeHtml(this.par.description);
        else return false;
      },
      parSignStyle(){
        if(this.parValid === 0) return false;
        else return true;
      },
      parDefault(){
        if("default_value" in this.par) return this.par.default_value;
        else return false;
      },
      parWarning(){
        let lret="Целое число. ";
        if(this.parMin>-Number.MAX_SAFE_INTEGER) lret=lret+"Минимум: " + this.parMin;
        if(this.parMax<Number.MAX_SAFE_INTEGER) lret=lret+"   Максимум: " + this.parMax;
        return lret;
      },
    }
  }
</script>
<style scoped>
  .parAlign {
    padding-right:5px !important;
    width: 32px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .par_warning
  {
    color:red;
    padding-left:5px;
    font-size: 0.9em;
  	font-style: normal;
  	font-weight: normal;
  }
  .par_name
  {
    color:white;
  	font-size:15px;
  	font-style: normal;
  	font-weight: normal;
  }
  .par_box
  {
    position:relative;
    color:black;
    font-size:16px;
    font-style: normal;
    font-weight: normal;
  }
  .par_icon_ok
  {
    height: 24px;
    width: 24px;
    fill:green;
  }
  .par_icon_cancel
  {
    height: 24px;
    width: 24px;
    fill:red;
  }
  .par_icon_filler
  {
    position:relative;
    height: 24px;
    width: 24px;
  }

</style>
