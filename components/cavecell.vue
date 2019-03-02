<template>
  <div  :style="cellSize" :class="cellClass" @click.stop="">
    <div v-if="isNoise">
      <i-wallst v-if="wallStUp" class="wall_st wall_up"/>
      <i-wallst v-if="wallStDn" class="wall_st wall_dn"/>
      <i-wallst v-if="wallStLf" class="wall_st wall_lf"/>
      <i-wallst v-if="wallStRt" class="wall_st wall_rt"/>

      <i-wallcv v-if="wallCvUp" class="wall_cv wall_up"/>
      <i-wallcv v-if="wallCvDn" class="wall_cv wall_dn"/>
      <i-wallcv v-if="wallCvLf" class="wall_cv wall_lf"/>
      <i-wallcv v-if="wallCvRt" class="wall_cv wall_rt"/>
    </div>
      <table v-if="isNoise" class="box_table">
        <tr class="box_row" v-for="lrow in eqpRow">
          <td class="box_digit" v-for="ldig in eqpRow">
            <s-eqp :eqp="eqpCell(lrow,ldig)" :key="JSON.stringify(eqpCell(lrow,ldig))"/>
          </td>
        </tr>
      </table>

  </div>
</template>
<script>

import wallst from '../assets/svg/wall_st.svg';
import wallcv from '../assets/svg/wall_cave.svg';

import equipment from './equipment.vue';

  export default {
    props:['cell','equip',"clSize"],
    components: {
      'i-wallst': wallst,
      'i-wallcv': wallcv,
      "s-eqp":equipment
    },
    data () {
      return {
        eqp:[],
        eqpRow:[],
        boxSize:0
      }
    },
    created()
    {
      this.boxSize=this.eqpSize();
      this.eqpRowFill();
      this.eqpPrepare();
    },
    methods:{
      eqpCell(lrow,ldig){
        return this.eqp[lrow][ldig];
      },
      eqpRowFill(){
        for(let l=0;l<this.boxSize;l++) this.eqpRow.push(l);
      },
      eqpPrepare(){
        let eqpd=[];
        for(let lrow=0; lrow<this.boxSize;lrow++){
          eqpd=[];
          for(let ldig=0; ldig<this.boxSize;ldig++){
            if(lrow*this.boxSize+ldig<this.equip.length)
            {
              eqpd.push(this.equip[lrow*this.boxSize+ldig]);
            }
            else eqpd.push({"empty":true});
          }
          this.eqp.push(eqpd);
        }
        console.log(JSON.stringify(this.eqp));
      },
      eqpSize(){
        return Math.ceil(Math.sqrt(this.equip.length));
      },
    },
    computed:{
      cellSize(){
        return "width:"+this.clSize+";height:"+this.clSize+";"
      },
      cellClass(){
        if(this.cell.indexOf("unknown")>=0) return "cell_main cell_unknown";
        if(this.cell.indexOf("st")>=0) return "cell_main cell_station";
        if(this.cell.indexOf("cl")>=0) return "cell_main cell_cave";
        if(this.cell.indexOf("sp")>=0) return "cell_main cell_space";
      },
      isNoise(){
        if(this.cell.indexOf("unknown")>=0) return false;
        return true;
      },
      wallCvUp(){
        if(this.cell.indexOf("cl")>=0 || this.cell.indexOf("sp")>=0) if(this.cell.indexOf("t")>=0) return true;
        return false;
      },
      wallCvDn(){
        if(this.cell.indexOf("cl")>=0 || this.cell.indexOf("sp")>=0) if(this.cell.indexOf("b")>=0) return true;
        return false;
      },
      wallCvLf(){
        if(this.cell.indexOf("cl")>=0 || this.cell.indexOf("sp")>=0) if(this.cell.indexOf("l")>=0) return true;
        return false;
      },
      wallCvRt(){
        if(this.cell.indexOf("cl")>=0 || this.cell.indexOf("sp")>=0) if(this.cell.indexOf("r")>=0) return true;
        return false;
      },
      wallStUp(){
        if(this.cell.indexOf("st")>=0) if(this.cell.indexOf("t")>=0) return true;
        return false;
      },
      wallStDn(){
        if(this.cell.indexOf("st")>=0) if(this.cell.indexOf("b")>=0) return true;
        return false;
      },
      wallStLf(){
        if(this.cell.indexOf("st")>=0) if(this.cell.indexOf("l")>=0) return true;
        return false;
      },
      wallStRt(){
        if(this.cell.indexOf("st")>=0) if(this.cell.indexOf("r")>=0) return true;
        return false;
      },

    }
  }
</script>

<style scoped>
  .eqp{
    width:100%;
    height:100%;
  }
  .red{ fill:red;}
  .cell_main{
    position:relative;
    padding: 15px;
    /* margin: 1px; */
  }
  .box_table{
    width:100%;
    height:100%;
  }
  .box_row{

  }
  .box_digit {
      position: relative;
  }
  .cell_cave{
    background-image: url(../assets/pattern/cave.jpg);
    background-size:cover;
  }
  .cell_station{
    background-image: url(../assets/pattern/station.jpg);
    background-size:cover;
  }
  .cell_space{
    background-image: url(../assets/pattern/space.jpg);
    background-size:cover;
  }
  .cell_unknown{
    background-image: url(../assets/pattern/noise2.jpg);
    background-size:tile;
  }
  .cell_elem
  {
    font-size: 15px;
    color:blue;
  }
  .wall_st{
    position:absolute;
    width:100%;
    transform-origin: center bottom;
    bottom:0px;
    left:0px;
  }
  .wall_cv{
    position:absolute;
    width:100%;
    transform-origin: center bottom;
    bottom:0px;
    left:0px;
  }
  .wall_up{
    transform: rotate(180deg) translate(0,150px);
  }
  .wall_dn{}
  .wall_lf{
    transform: rotate(90deg) translate(-75px,75px); */
    bottom:0px;
    left:0px;
  }
  .wall_rt{
    transform: rotate(-90deg) translate(75px,75px); ;
  }
/*
  .r{border-right:1px black solid;}
  .l{border-left:1px black solid;}
  .t{border-top:1px black solid;}
  .b{border-bottom:1px black solid;} */

</style>
