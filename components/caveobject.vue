<template>
<div>
  <div v-if="!objOneObject" class="objAlign">Дождитесь загрузки объекта...</div>
  <div v-if="objOneObject">
    <!-- <div class="obj_title_subtitle_div"> -->
      <div class="obj_title_div" :style="objSmallTitle">
        <icon-6xright class="icon_6x"/>
            <div>
              <h2 class="obj_title">Шахта</h2>
            </div>
          <icon-dbl-line-title v-if="decor" class="icon_dbl_line_title"/>
      </div>
      <button @click="caveBigSwitch">Cave!</button>
      <br>
      <div class="cave_box">
        <table  class="cave_table">
          <tr v-for="lrow in caveRow(caveZ)">
            <td v-for="ldig in caveCol(caveX)">
              <s-cell
                :cell="cellElem(lrow,ldig)"
                :equip="cellEquip(lrow,ldig)"
                clSize="150px"
                :key="cellKey(lrow,ldig)"/>
              <!-- <div class="cave_elem"></div> -->
            </td>
          </tr>
        </table>
        <div class="caveUp" @click="moveUp"><s-arr class="arr_up"/></div>
        <div class="caveDn" @click="moveDn"><s-arr class="arr_dn"/></div>
        <div class="caveLf" @click="moveLf"><s-arr class="arr_lf"/></div>
        <div class="caveRt" @click="moveRt" ><s-arr class="arr_rt"/></div>

      </div>
      <main-cave v-if="caveBigShow"  @done="caveBigSwitch" :cave="cave"/>
  </div>
</div>
</template>
<script>
import {
  mapGetters
} from 'vuex';
import {
  mapMutations
} from 'vuex';
import {
  mapActions
} from 'vuex';

import {
  convSet
} from './stringlib.js';
const conv = convSet();

import right6x from '../assets/6x_right.svg';
import arrow from '../assets/single-arr-left.svg';
import dblLinesTitle from '../assets/double-lines-title.svg';

import mainCave from './cave.vue';
import caveCell from './cavecell.vue';

import lcave from 'raw-loader!../store/cave.txt';
import lequip from 'raw-loader!../store/equip.txt';

export default {
  props: ['objid','decor','small'],
  components: {
    'icon-6xright': right6x,
    'icon-dbl-line-title': dblLinesTitle,
    'main-cave':mainCave,
    's-arr':arrow,
    's-cell':caveCell,
  },
  data() {
    return {
        caveBigShow:false,
        cave:[],
        equip:[],
        actStat:false,
        actid: false,
        obj: this.objid,
        wrnStat: false,
        wrnMessage:"",
        caveX:10,
        caveZ:10,
    }
  },
  created(){
    this.caveCreate();
    this.equipCreate();
  },
  methods: {
    ...mapActions(['sendAct']),
    caveBigSwitch(){this.caveBigShow=!this.caveBigShow;},
    objActSwitch(actName, event) {
      event.stopPropagation();
      // this.actid = actName;
      // if ("user_params" in this.objOneObject.actions[actName]) {
      //   router.beforeEach((to, from, next) => {
      //     next(false);
      //   });
      //   this.actStat = true;
      // } else {
      //   if("warning" in this.objOneObject.actions[actName]){
      //     router.beforeEach((to, from, next) => {
      //       next(false);
      //     });
      //     this.wrnMessage=this.objOneObject.actions[actName].warning;
      //     this.wrnStat=true;
      //   }
      //   else{
      //     this.sendAct({actid:this.actid,obj:this.objOneObject});
      //     this.actid = false;
      //     this.actStat = false;
      //   }
      // }
      // return false;
    },
    moveUp(){ this.caveZ=this.caveZ-1},
    moveDn(){ this.caveZ=this.caveZ+1},
    moveLf(){ this.caveX=this.caveX-1},
    moveRt(){ this.caveX=this.caveX+1},
    cellEquip(lrow,ldig){
      let leqp=[]
      this.equip.forEach((item)=>{
        if(item.x==ldig && item.y==lrow ) leqp.push(item);
      });
      return leqp;
    },
    cellElem(lrow,ldig)
    {
      if(lrow<0 || lrow>this.cave.length) return ["unknown"];
      if(ldig<0 || lrow>this.cave[0].length) return ["unknown"];
      let l_elem=[].concat(this.cave[lrow][ldig]);
      if(l_elem.indexOf("l")<0 && ldig>0 && this.cave[lrow][ldig-1].indexOf("r")>=0) l_elem.push("l");
      if(l_elem.indexOf("r")<0 && ldig<this.cave[0].length-1 && this.cave[lrow][ldig+1].indexOf("l")>=0) l_elem.push("r");
      if(l_elem.indexOf("t")<0 && lrow>0 && this.cave[lrow-1][ldig].indexOf("b")>=0) l_elem.push("t");
      if(l_elem.indexOf("b")<0 && lrow<this.cave.length-1 && this.cave[lrow+1][ldig].indexOf("t")>=0) l_elem.push("b");

      return l_elem;

    },
    cellKey(lrow,ldig)
    {
      return lrow.toString()+"_"+ldig.toString()+"_"+Math.random().toString();
    },
    caveCol(lx)
    {
      return [lx-2,lx-1,lx,lx+1,lx+2];
    },
    caveRow(lz)
    {
      return [lz-2,lz-1,lz,lz+1,lz+2];
    },
    equipCreate(){
      this.equip=JSON.parse(lequip);
      console.log(JSON.stringify(this.equip));
    },
    caveCreate(){
      let lsprow=[];
      for(let l=0;l<70;l++)
      {
        lsprow.push(["sp"]);
      }
      let lspside=[];
      for(let l=0;l<10;l++)
      {
        lspside.push(["sp"]);
      }

      for(let l=0;l<10;l++)
      {
        this.cave.push(lsprow);
      }

      let ltmp=lcave.split("|");
      let ltmp2=[];
      ltmp.forEach((item)=>{ltmp2.push(item.split(" "))});

      for(let l=0;l<50;l++)
      {
        this.cave.push([].concat(lspside,ltmp2.slice(l*50,l*50+50),lspside));
      }
      for(let l=0;l<10;l++)
      {
        this.cave.push(lsprow);
      }
      // console.log(JSON.stringify(this.cave));
      return false;
    }
  },
  computed: {
    objSmallTitle(){
      if(this.small){
        return "padding-left:25px;"
      }
      return "";
    },
    objOneObject() {
      if(this.obj){
        if('object' in  this.obj){
          return this.obj.object;
        }
        else return this.obj;}
      else return false;
    },
    objAttributes() {
      if ('attributes' in this.objOneObject) return this.objOneObject.attributes;
      else return false;
    },
    objActions() {
      if ('actions' in this.objOneObject) return this.objOneObject.actions;
      else return false;
    }
  }
}
</script>
<style scoped>
.cave_box{
  display: inline-block;
}
.cave_box{
  position: relative;
  width: auto;
  border: 5px rgba(51, 153, 255, 0.75) solid;
  padding: 50px;

}
.caveUp{
  position: absolute;
  width: 40px;
  height: 40px;
  top: 5px;
  left: 420px;
  border: 2px rgba(51, 153, 255, 0.75) solid;
  border-radius: 5px;
}
.caveDn{
  position: absolute;
  width: 40px;
  height: 40px;
  bottom: 5px;
  left: 420px;
  border: 2px rgba(51, 153, 255, 0.75) solid;
  border-radius: 5px;
}
.caveLf{
  position: absolute;
  width: 40px;
  height: 40px;
  left: 5px;
  top: 420px;
  border: 2px rgba(51, 153, 255, 0.75) solid;
  border-radius: 5px;
}
.caveRt{
  position: absolute;
  width: 40px;
  height: 40px;
  right: 5px;
  top: 420px;
  border: 2px rgba(51, 153, 255, 0.75) solid;
  border-radius: 5px;
}
.obj_list_el {
  position: relative;
  border-left: 2px rgba(51, 153, 255, 0.75) solid;
  width: 100%;
  height: 100%;

  padding-left: 10px;
  margin-bottom: 20px;
  background: rgba(51, 153, 255, 0.11);

  cursor: pointer;
}
.arr_lf{
  width:100%;
  height:100%;
   transform: rotate(180deg);
}
.arr_rt{
  width:100%;
  height:100%;

}
.arr_dn{
  width:100%;
  height:100%;
   transform: rotate(90deg);
}
.arr_up{
  width:100%;
  height:100%;
   transform: rotate(-90deg);
}
.obj_btn {
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 30px;
  z-index: 1000;
  padding: 0px;
  color: white;
  border: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.obj_action_btn {
  margin-right: 2px;
  margin-bottom: 2px;
  font-size: 16px;
}
.obj_list {
  width: 100%;
}

.obj_list_hr {
  width: 50%;
  padding-bottom: 20px;
}

.obj_dbl_arr {
  fill: green;
  width: 30px;
}
.obj_title_div {
  position:relative;
  width:100%;
  height:54px;
      background: rgba(51, 153, 255, 0.11);
      border-radius: 8px;
      border: 2px rgba(51, 153, 255, 0.75) solid;
  padding-left: 60px;
  padding-right: 270px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow-x: hidden;
    margin-bottom: 10px;

}
.obj_title{
  white-space: nowrap;
  font-size: 22px;
}
/* .obj_title_subtitle_div{
  position:relative;
  width:100%;
  height:135px;
} */
.icon_6x{
  position:absolute;
  left:0px;
  top: 3px;
  height: 44px;
  fill: rgba(51, 153, 255, 1);
}
.icon_4x{
  position:absolute;
  left:0px;
  top:4px;
  height: 28px;
  fill: rgba(51, 153, 255, 1);
}
.icon_single{
  width: 30px;
  fill: rgba(51, 153, 255, 1);
}
.icon_3x_left{
  position:absolute;
  right:0px;
  top:6px;
  height: 25px;
  width: 15px;
  fill: rgba(51, 153, 255, 1);
}
.icon_3x_right{
  position:absolute;
  left:0px;
  top:6px;
  height: 25px;
  width: 15px;
  fill: rgba(51, 153, 255, 1);
}
.icon_dbl_line_title{
  position:absolute;
  right:0px;
  top: 8px;
  width: 200px;
  fill: transparent;
  stroke-width:2px;
  stroke:rgba(51, 153, 255, 0.75);
}
.icon_dbl_line_temp{
  position:absolute;
  right:0px;
  top: 0px;
  width: 230px;
  fill: transparent;
  stroke-width:2px;
  stroke:rgba(51, 153, 255, 0.75);
}
.obj_subtitle_div{
  padding: 0px 25px 5px 0px;
  width:100%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;

}
.obj_subtitle {
  white-space: nowrap;
    color: lightskyblue;
  /* color: rgba(51, 153, 255, 1); */
  font-size: 14px;
}

.obj_template_body_div {
  padding: 0.65em 30px 0.5em 15px;
  font-size: 16px;
}

.obj_template_title_div {
  position:relative;
  width:100%;
  height:40px;
      background: rgba(28, 43, 81, 0.75);
      border-radius: 8px;
      border: 2px rgba(51, 153, 255, 0.75) solid;
  padding-left: 60px;
  padding-right: 270px;
  display: flex;

  align-items: center;
  justify-content: flex-start;
  overflow-x: hidden;
}

.obj_templategroup {
  position: relative;
  background: rgba(51, 153, 255, 0.26);
  width: 100%;
  margin-bottom: 20px;
  margin-top: 20px;
  border-radius: 8px;
}

.obj_templ_name {
  font-weight: bold;
  white-space: nowrap;
  font-size: 16px;
}

.editor-style {
  height: 300px;
  overflow: auto;
}
.objAlign {
    width:100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .objAlignV {
      width:100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
/deep/ img{width: 50%;}
/deep/ p {
  margin-bottom: 0px;
}
</style>
