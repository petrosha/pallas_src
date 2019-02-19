<template>
  <div id="app" class="main_div">
    <b-container fluid >
      <b-row>
        <b-col
          :md="main_md"
          :lg="main_lg"
          :xl="main_xl"
          v-if="main_sw_stat"
          :class="menu_class">
          <div  class="main_screen_inner_box_left" >
            <main-actors/>
            <div class="main_menu_div">
              <main-menu2 :objid="menuObject.obj" :key="menuObject.key" @done="main_sw_change" :small="!decor"/>
            </div>  <!-- <main-menu @objchange="menuAct" :list="menuObjects"/> -->
            <main-settings/>

          </div>

        </b-col>
        <b-col
        :md="12-main_md"
        :lg="12-main_lg"
        :xl="12-main_xl"
        v-if="main_sw_small"
        :class="object_class">
          <div class="main_screen_inner_box" :style="main_screen_inner_box_padding">
            <main-object v-if="oneObject" :objid="oneObject" :decor="decor" :small="!decor" :key="oneObject.object.id"></main-object>
          </div>
        </b-col>
      </b-row>
    </b-container>
    <div class="main_sw_class" @click="main_sw_change">
      <s-svg1 v-if="main_sw_stat" class="main_sw_arr"/>
      <s-svg2 v-if="!main_sw_stat" class="main_sw_arr"/>
    </div>
    <!-- <div class="test">
      {{testwh}}
    </div> -->
    <main-cave/>

  <main-spinner
    v-if="socketGet.wait.show"
    :text="socketGet.wait.note"
    :error="socketGet.wait.error"/>

    <main-warning
      v-if="warningGet.stat"
      :title="warningGet.title"
      :message="warningGet.message"
      @done="mainWrnDone"
    />
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import { mapMutations } from 'vuex';
import { mapActions } from 'vuex';

import MainObject from './components/object.vue';
import MainMenu from './components/menu.vue';
import Settings from './components/settings.vue';
import mainActors from './components/actor.vue';
import mainWarning from './components/warning2.vue';
import mainSpin from './components/spinner.vue';
import mainMenu from './components/menuobject.vue';
import mainCave from './components/cave.vue';

import dblAngLeft from './assets/double-angle-left.svg';
import dblAngRight from './assets/double-angle-right.svg';

export default {
  name: 'app',
  components:{
    'main-object': MainObject,
    'main-menu': MainMenu,
    'main-settings': Settings,
    'main-actors': mainActors,
    'main-spinner':mainSpin,
    'main-menu2':mainMenu,
    'main-warning':mainWarning,
    'main-cave':mainCave,
    "s-svg1": dblAngLeft,
    "s-svg2": dblAngRight,
  },
  data () {
    return {
      main_sw_stat: true,
      testwh:"",
      main_vw: 0,
      main_sw_small:true,
      menu_class: "main_screen_outer_box_left",
      object_class:"main_screen_outer_box_right",
      main_screen_inner_box_padding:"padding-left:0px;",
      decor:true
    }
  },
  methods:
  { ...mapMutations(["objActiveSet","warningReset"]),
    ...mapActions(["sendSubscrWait"]),
    mainWrnDone(){
      this.warningReset();
    },
    main_sw_change(){
      this.main_sw_stat=!this.main_sw_stat;
    },
    mainWinWidth() {
      this.testwh = "W: "+this.main_vw;
      if(this.main_vw <768){
        this.menu_class="main_screen_outer_box_left_small";
        this.object_class="main_screen_outer_box_right_small";
        this.decor=false;
        if(this.main_sw_stat===true){
          this.main_sw_small = false;
        }
        else{
          this.main_sw_small = true;
        }
      }
      else {
       this.menu_class="main_screen_outer_box_left";
       this.object_class="main_screen_outer_box_right";
       this.decor=true;
       this.main_sw_small = true;}

      if(this.main_sw_stat===true) this.main_screen_inner_box_padding="padding-left:0px";
      else this.main_screen_inner_box_padding="padding-left:3.6vh;";
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.main_vw = window.innerWidth;
      window.addEventListener('resize', () => {
        this.main_vw = window.innerWidth;
      });


    })
  },
  watch: {
    main_vw: {
      handler: function(){this.mainWinWidth();},
      deep: true
    },
    main_sw_stat: {
      handler: function(){this.mainWinWidth();},
      deep: true
    },
    '$route' (to,from){
      if(!this.socketGet.wait.req && this.socketGet.isConnected && this.actorsGet.active.length>0 && this.allObjects[this.actorsGet.active]!==undefined)
      {
        if(to.path==="/") this.$router.replace(this.actorsGet.active);
        if(this.allObjects[to.path.substring(1,to.path.length)]===undefined)
      		this.sendSubscrWait(to.path.substring(1,to.path.length));
      }
    }
  },
  computed:
  { ...mapGetters(['menuObjects','menuObject','socketGet','routerPath','oneObject','actorsGet','allObjects','warningGet']),
    mainRouterPath(){
      return JSON.stringify(this.routerPath);
    },
    main_xl(){
      if(this.main_sw_stat) return 3;
      else return 0;
    },
    main_lg(){
      if(this.main_sw_stat) return 4;
      else return 0;
    },
    main_md(){
      if(this.main_sw_stat) return 5;
      else return 0;
    },
  }
}
</script>


<style>
/* montserrat-regular - cyrillic_latin-ext_latin_cyrillic-ext */
@font-face {
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 400;
  src: local('Montserrat Regular'), local('Montserrat-Regular'),
       url('./css/fonts/montserrat-v12-cyrillic_latin-ext_latin_cyrillic-ext-regular.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
       url('./css/fonts/montserrat-v12-cyrillic_latin-ext_latin_cyrillic-ext-regular.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
}

/* montserrat-italic - cyrillic_latin-ext_latin_cyrillic-ext */
@font-face {
  font-family: 'Montserrat';
  font-style: italic;
  font-weight: 400;
  src: local('Montserrat Italic'), local('Montserrat-Italic'),
       url('./css/fonts/montserrat-v12-cyrillic_latin-ext_latin_cyrillic-ext-italic.woff2') format('woff2'), /* Chrome 26+, Opera 23+, Firefox 39+ */
       url('./css/fonts/montserrat-v12-cyrillic_latin-ext_latin_cyrillic-ext-italic.woff') format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */
}


h1, h2, h3, h4, h5, h6, p, div, span html body {
font-family: 'Montserrat', sans-serif;
font-family-sans-serif: 'Montserrat';

/* //font-family: 'Montserrat', sans-serif; */
}

/* h2{font-size: 20px;}
h4{font-size: 17px;}
p {font-size: 15px;}
button{font-size: 15px;} */

</style>
<style scoped>

.main_screen_outer_box_left{
  padding: 15px 0px;
  padding-right: 8px;
  height: 100vh;
}
.main_screen_outer_box_left_small{
  padding-top: 5px;
  padding-bottom: 5px;
  padding-right: 0px;
  padding-left: 0px;
  height: 100vh;
}
.main_screen_outer_box_right{
  padding: 15px 15px;
  padding-left: 8px;

  height: 100vh;
}
.main_screen_outer_box_right_small{
  padding: 5px 5px;
  height: 100vh;
}
.main_screen_inner_box{
  position:relative;
  padding: 0px;
  /* border: 2px green solid; */
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
.main_screen_inner_box_left{
  position: relative;
  padding: 0px;
  padding-left: 0px;
  border: 2px rgba(51, 153, 255, 0.75) solid;
  height: 100%;
  background: rgba(51, 153, 255, 0.11);
  border-radius: 7px;
  overflow-x: hidden;
  overflow-y: auto;
}
.main_div{
  color: white;
  height: 100vh;
  background-image: url(assets/background.jpg);
  background-size:cover;
}
.main_sw_class
{
  position: fixed;
  height:30vh;
  left:0vh;
  width:41px;
  top: 35vh;
  z-index: 250000;
  padding: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.main_sw_arr{
  fill: green;
  height:100%;
  position:absolute;
  top:0px;
  left:0px;
}
.main_menu_div
{
  position: relative;
  width:100%;
  padding: 0px;
  padding-left:4.5vh;
  padding-right:12px;
  overflow-x: hidden;
}
hr
{
  border-top: 1px solid white;
  width:80%;
}

</style>
