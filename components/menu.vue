<template>
   <div class="menu_main">
      <div class="menuAlign">
        <h2>Меню</h2>
      </div>
        <br>
      <div class="menuAlign">
        <b-button-group class="menu_btn_group" vertical>
          <b-button
            v-for="l_item in menuList"
            v-html="l_item.title"
            @click="menuAct(l_item.key)"
            block
            variant="outline-success lg" />
        </b-button-group >
      </div>
   </div>
</template>
<script>
  import {convSet} from './stringlib.js';
  const conv=convSet();

  export default {
    props:['list'],
    data () { return {}},
    methods:{
      menuAct(id){
        this.$emit("objchange",id);
        return false;
      }
    },
    computed:{
      menuList(){
        let l_list=[];
        this.list.forEach(
          l_item => {
            if(l_item.title) {
                l_list.push({key:l_item.key,title:conv.makeHtml(l_item.title)});
            } else l_list.push({key:l_item.key,title:l_item.key});
          }
        );
        return l_list;
      }
    }
  }
</script>
<style scoped>
  .menu_main
  {
  	width:100%;
    z-index: 10;
  }
  .menu_btn_group
  {
    width:100%;
  }
  .menuAlign {
    width:100%;
    display: flex;
    justify-content: center;
  }
   /deep/ p {margin-bottom: 0px;}
</style>
