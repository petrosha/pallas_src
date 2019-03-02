<template>
   <div class="cave_main"  @click.stop="">
     <div class="cave_box">
       <div>
         <div class="row" v-for="lrow in cave">
           <div :class="elm(lelm)" v-for="lelm in lrow">

           </div>
         </div>
       </div>
        <button @click="$emit('done')">Done</button>

     </div>
   </div>
</template>
<script>

  export default {
    props:['cave'],
    data () {
      return {
        length:0
      }
    },
    methods:{
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
    width:800px;
    height:800px;
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
  .sp{
    width:10px;
    height:10px;
    margin: 0px;
    background: black;
    border:1px black solid;
  }

  .st{
    width:10px;
    height:10px;
    margin: 0px;
    background: magenta;
    border:1px black solid;
  }


  .r{border-right:1px black solid;}
  .l{border-left:1px black solid;}
  .t{border-top:1px black solid;}
  .b{border-bottom:1px black solid;}

</style>
