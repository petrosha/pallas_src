<template>
   <div class="actor_main">
      <div class="actorAlign">
        <icon-6xright class="icon_6x_right"/>
        <div class="actorAlignV">
          <h2 class="actor_title" v-html="actorTitle"></h2>
          <h4 v-if="actorSubTitle" class="actor_subtitle" v-html="actorSubTitle"></h4>
        </div>
        <icon-6xleft class="icon_6x_left"/>
      </div>
      <!-- <div class="actor_subtitle_div" v-if="actorSubTitle">
      </div> -->

      <div class="actor_drop_div" v-show="actorSelect">
          <b-dropdown text="Выбрать..." variant="secondary" class="actor_drop">
            <b-dropdown-item-button
              class="actor_drop_item"
              v-for="item in actorsList"
              v-html="item.title"
              @click="actorSet(item)"/>
          </b-dropdown>
      </div>
   </div>
</template>
<script>
  import {mapGetters} from 'vuex';
  import { mapMutations } from 'vuex';
  import { mapActions } from 'vuex';
  import {convSet} from './stringlib.js';
  import left6x from '../assets/6x_left.svg';
    import right6x from '../assets/6x_right.svg';

  const conv=convSet();

  export default {
    props:[],
    components:{
      'icon-6xleft': left6x,
      'icon-6xright': right6x,
    },
    data () { return {}},
    methods:{
      ...mapMutations(['actorsActiveSet']),
            ...mapActions(['sendSetActor']),
      actorSet(l_item){
        this.sendSetActor(l_item.id);
      },
    },
    computed:{
      ...mapGetters(['actorsGet']),
      actorsList(){
        let l_list=[];
        this.actorsGet.list.forEach(
          l_item => {
            if('title' in l_item) l_list.push({id:l_item.id,title:conv.makeHtml(l_item.title)});
            else l_list.push({id:l_item.id,title:l_item.id});
          });
        return l_list;
      },
      actorTitle(){
        if(this.actorsGet.active === "") return "Неизвестный...";
        else {
          for(let l=0; l<this.actorsGet.list.length;l++){
            if(this.actorsGet.active === this.actorsGet.list[l].id)
              if("title" in this.actorsGet.list[l]) return conv.makeHtml(this.actorsGet.list[l].title);
              else return this.actorsGet.list[l].id;
          }
        }
        return "";
      },
      actorSelect(){
        if(this.actorsGet.active !== "" && this.actorsList.length==1) return false;
        return true;
      },
      actorSubTitle(){
        if(this.actorsGet.active !== "")
        for(let l=0; l<this.actorsGet.list.length;l++){
          if(this.actorsGet.active === this.actorsGet.list[l].id)
            if("subtitle" in this.actorsGet.list[l]) return conv.makeHtml(this.actorsGet.list[l].subtitle);
        }
        return "";
      },
    }
  }
</script>
<style scoped>
  .actor_main
  {
    position:relative;
  	width:100%;
    z-index: 10;
    margin-bottom: 20px;
  }
  .actor_drop_div
  {
    position:relative;
    width:100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 10px;

  }
  .actor_drop
  {
    width:50%;
  }
  .actor_drop_item
  {
    height: 50px;
    width:100%;
  }
  .actorAlign {
    width:100%;
    height:52px;
        background: rgba(51, 153, 255, 0.11);
        border-bottom: 2px rgba(51, 153, 255, 0.75) solid;
    display: flex;
    align-items: center;
    justify-content: space-between;

  }
  .actorAlignV {
    width:100%;
    height:52px;
    display: flex;
    flex-direction:column;
    align-items: center;
    justify-content: center;

  }
  .icon_6x_right{
    height: 44px;
    position: absolute;
    top:3px;
    left: 0px;
    fill: rgba(51, 153, 255, 1);
  }
  .icon_6x_left{
    height: 44px;
    position: absolute;
    top:3px;
    right: 0px;
    fill: rgba(51, 153, 255, 1);
  }
  .actor_title{
    overflow-x:hidden;
    font-size: 22px;
    overflow: hidden;
  }
  .actor_subtitle_div{
    padding: 10px 25px 5px 25px;
    width:100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .actor_subtitle{
    overflow-x:hidden;
    white-space: nowrap;
    color: lightskyblue;
    /* color: rgba(51, 153, 255, 1); */
    font-size:  14px;
        overflow: hidden;
  }

   /deep/ p {margin-bottom: 0px;}
</style>
