<template>
   <div class="cave_main">
     <div class="cave_box">
       <div>
         <div class="row" v-for="lrow in cave">
           <div :class="elm(lelm)" v-for="lelm in lrow">

           </div>
         </div>
       </div>
        {{length}}
        <button @click="caveCreate">ЖМИ</button>
        <button @click="caveStringify">ЖМИ2</button>
     </div>
   </div>
</template>
<script>

import lcave from 'raw-loader!../store/cave.txt';
import _ from 'lodash';

  export default {
    data () {
      return {
        length:0,
        cave:[]
      }
    },
    methods:{
      caveCreate(){
        let ltmp=lcave.split("|");
        let ltmp2=[];
        ltmp.forEach((item)=>{ltmp2.push(item.split(" "))});
        for(let l=0;l<50;l++)
        {
          this.cave.push(ltmp2.slice(l*50,l*50+50));
        }
        this.length=this.cave.length;
        return false;
      },
      caveStringify(){
        console.log(JSON.stringify(JSON.parse(JSON.stringify(this.cave))));
        return false;
      },
      elm(lelm){
        return lelm.join(" ");
      }
    },
    computed:{
      caveStr(){
        return lcave;
      }
    }
  }
</script>
<style scoped>
  .cave_main
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
  .cave_box
  {
    width:700px;
    height:700px;
    border: 2px rgba(51,153,255,0.75) solid;
    background: rgba(51,153,255,0.11);
  	overflow: auto;
    padding: 50px;
  }
  .row{
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }
  .cl{
    width:10px;
    height:10px;
    margin: 0px;
    background: grey;
    border:1px grey solid;
  }
  .r{border-right:1px black solid;}
  .l{border-left:1px black solid;}
  .t{border-top:1px black solid;}
  .b{border-bottom:1px black solid;}

</style>
