<template>
<div>
  <div v-if="!objOneObject" class="objAlign">Дождитесь загрузки объекта...</div>
  <div v-if="objOneObject">
    <!-- <div class="obj_title_subtitle_div"> -->
      <div class="obj_title_div" v-if="objTitle" :style="objSmallTitle">
        <icon-6xright class="icon_6x"/>
            <div>
              <h2  v-html="objTitle" class="obj_title"></h2>
                <!-- <div class="obj_subtitle_div" v-if="objSubTitle"  :style="objSmallTitle"> -->
              <h4  v-if="objSubTitle"  v-html="objSubTitle" class="obj_subtitle"></h4>
                <!-- </div> -->
            </div>

          <icon-dbl-line-title v-if="decor" class="icon_dbl_line_title"/>
      </div>
    <!-- </div> -->
    <div v-if="objTemplate">
      <div v-for="templateItem in objTemplate" class="obj_templategroup">
        <div class="obj_template_title_div" v-if="templateItem.name"  :style="objSmallTitle">
          <icon-4xright class="icon_4x"/>
            <p  v-html="templateItem.name" class="obj_templ_name"></p>
          <icon-dbl-line-temp v-if="decor" class="icon_dbl_line_temp"/>
        </div>
        <div class="obj_template_body_div">
          <div v-if="templateItem.attributes">
            <s-attribute v-for="attr in templateItem.attributes" :attr="objOneObject.attributes[attr]" :temporary="objTemporary">
            </s-attribute>
          </div>
        <!-- <b-button-group v-if="templateItem.actions"> -->
        <div v-if="templateItem.actions">
          <button
            v-for="attr in templateItem.actions"
            v-on:click="objActSwitch(attr,$event)"
            :disabled="objOneObject.actions[attr].disabled"
            class="btn btn-outline-warning obj_action_btn">
            <icon-3xright class="icon_3x_right"/>
              <p v-html="objActionNameConv(attr)"></p>
            <icon-3xleft class="icon_3x_left"/>
          </button>
          </div>
        </div>
      </div>
    </div>
    <!-- <div v-if="objAttributes"> -->
      <!-- <s-attribute v-for="attr in objAttrs.unused" :attr="objAttributes[attr]"> -->
      <!-- </s-attribute> -->
    <!-- </div> -->
    <!-- <div v-if="objActions"> -->
      <!-- <b-button variant="danger" v-for="attr in objAttrs.actunused" v-html="objActions[attr].name" v-on:click="objActSwitch(attr)" :disabled="objActions[attr].disabled" /> -->
    <!-- </div> -->
    <div v-if="objListObject" class="obj_list">
      <div class="objAlign"><icon-dbl-hr class="obj_list_hr"/></div>
      <span v-if="objListObjectLength" class="objAlign">Список пуст...</span>
      <div class="obj_list_el" v-for="(lkey,index) in objListObject" @click="objActiveSet(lkey.id)" :style="objSmallList">
        <in-object :objid="lkey" :decor="false" :small="small" :key="objOneObject.id+lkey.id+JSON.stringify(lkey)" />
        <!-- <button
          class="btn btn-outline-primary obj_btn"
          @click="objActiveSet(lkey.id)">
          <icon-single class="icon_single"/>
        </button> -->
      </div>
      <div class="objAlignV" v-if="objListMore"><icon-dbl-hr class="obj_list_hr"/>
        <button
          class="btn btn-outline-primary"
          @click="sendAskMore(objOneObject.id)"
        >
          Загрузить еще?
        </button>
      </div>

    </div>
    <s-action
      v-if="actStat"
      :objid="objOneObject"
      :actid="actid"
      :key="objOneObject.id+actid"
      @done="objActionDone()"/>
      <s-warning
        v-if="wrnStat"
        @done="objWrnDone"
        :title="wrnMessage">
      </s-warning>
  </div>
</div>
</template>
<script>
import singleAttribute from './attribute.vue';
import singleAction from './action.vue';

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

import singleWarning from './warning.vue';
import dblAngRight from '../assets/double-angle-right.svg';
import right6x from '../assets/6x_right.svg';
import dblLinesTitle from '../assets/double-lines-title.svg';
import right4x from '../assets/4x_left.svg';
import left3x from '../assets/3x_left.svg';
import right3x from '../assets/3x_right.svg';
import dblLinesTemp from '../assets/double-lines-template.svg';
import dblHR from '../assets/dbl-hr.svg';
import iconSingleLeft from '../assets/single-angle-left.svg';
import {router} from '../routes.js'

export default {
  props: ['objid','decor','small'],
  name: "in-object",
  components: {
    's-attribute': singleAttribute,
    's-action': singleAction,
    's-dblright': dblAngRight,
    's-warning': singleWarning,
    'icon-6xright': right6x,
    'icon-dbl-line-title': dblLinesTitle,
    'icon-4xright': right4x,
    'icon-3xleft': left3x,
    'icon-3xright': right3x,
    'icon-dbl-line-temp': dblLinesTemp,
    'icon-dbl-hr': dblHR,
    'icon-single': iconSingleLeft,
  },
  data() {
    return {
      AttrList: {
        used: ["title", "subtitle"],
        unused: [],
        actused: [],
        actunused: []
      },
        actStat:false,
        actid: false,
        obj: this.objid,
        wrnStat: false,
        wrnMessage:""
    }
  },
  created(){
    this.objAttrClean();
  },
  methods: {
    ...mapActions(['sendAct','sendOpenList','sendAskMore']),
    objAttrClean(){
      this.AttrList.used = ["title","subtitle"],
      this.AttrList.unused=[],
      this.AttrList.actused=[],
      this.AttrList.actunused=[]
    },
    objActiveSet(listid){
      this.sendOpenList({objid:this.obj.object.id, listid: listid});
    },
    objActSwitch(actName, event) {
      event.stopPropagation();
      this.actid = actName;
      if ("user_params" in this.objOneObject.actions[actName]) {
        router.beforeEach((to, from, next) => {
          next(false);
        });
        this.actStat = true;
      } else {
        if("warning" in this.objOneObject.actions[actName]){
          router.beforeEach((to, from, next) => {
            next(false);
          });
          this.wrnMessage=this.objOneObject.actions[actName].warning;
          this.wrnStat=true;
        }
        else{
          this.sendAct({actid:this.actid,obj:this.objOneObject});
          this.actid = false;
          this.actStat = false;
        }
      }
      return false;
    },
    objWrnDone(reply){
      router.beforeHooks.length=0;
      this.wrnStat=false;
      this.wrnMessage="";
      if(reply==="ok") this.sendAct({actid:this.actid,obj:this.objOneObject});
    },
    objActionDone() {
      router.beforeHooks.length=0;
      this.actid = false;
      this.actStat = false;
      return false;
    },
    objActionNameConv(attr) {
      return conv.makeHtml(this.objOneObject.actions[attr].name);
    },
  },
  computed: {
    objSmallTitle(){
      if(this.small){
        return "padding-left:25px;"
      }
      return "";
    },
    objSmallList(){
      if(this.small){
        return "padding-left:5px;"
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
    objListObject() {
      if ('list' in this.obj){
        if ('objects' in this.obj.list)
          return this.obj.list.objects;
      }
      return false;
    },
    objListMore() {
      if ('list' in this.obj){
        if ('has_more' in this.obj.list)
          return this.obj.list.has_more;
      }
      return false;
    },
    objListObjectLength(){
      if(this.objListObject)
        if(this.objListObject.length===0) return true;
      return false;
    },
    objAttributes() {
      if ('attributes' in this.objOneObject) return this.objOneObject.attributes;
      else return false;
    },
    objTemporary() {
      if(this.objAttributes)
        if ('temporary_object ' in this.objAttributes) return true;

      return false;
    },
    objActions() {
      if ('actions' in this.objOneObject) return this.objOneObject.actions;
      else return false;
    },
    objTitle() {
      if (this.objAttributes)
        if ("template" in this.objOneObject)
          if ("title" in this.objOneObject.template)
            if(this.objAttributes[this.objOneObject.template.title])
            {  let l_title=this.objAttributes[this.objOneObject.template.title];
                if ("value_description" in l_title)
                  return conv.makeHtml(l_title.value_description);
                  else return conv.makeHtml(l_title.value);
            }
      return false;
    },
    objSubTitle() {
      if (this.objAttributes)
        if ("template" in this.objOneObject)
          if ("subtitle" in this.objOneObject.template)
            if(this.objAttributes[this.objOneObject.template.subtitle])
            {  let l_title=this.objAttributes[this.objOneObject.template.subtitle];
                if ("value_description" in l_title)
                  return conv.makeHtml(l_title.value_description);
                  else return conv.makeHtml(l_title.value);
            }
      return false;
    },
    objTemplate() {
      if ("template" in this.objOneObject)
        if ("groups" in this.objOneObject.template) {
          return this.objOneObject.template.groups;
        }
      return false;
    },
    objTemplateItemName() {
      if ("template" in this.objOneObject)
        if ("groups" in this.objOneObject.template) {
          return this.objOneObject.template.groups;
        }
      return false;
    },
    objAttrs() {
      this.objAttrClean();
      if (this.objTemplate) {
        this.objTemplate.forEach(
          l_item => {
            if ("attributes" in l_item) this.AttrList.used.push(...l_item.attributes);
            if ("actions" in l_item) this.AttrList.actused.push(...l_item.actions);
          });
      }
      if (this.objAttributes) {
        for (let lkey in this.objAttributes) {
          if (this.AttrList.used.indexOf(lkey) < 0) this.AttrList.unused.push(lkey);
        }
      }
      if (this.objActions) {
        for (let lkey in this.objOneObject.actions) {
          if (this.AttrList.actused.indexOf(lkey) < 0) this.AttrList.actunused.push(lkey);
        }
      }
      return this.AttrList;
    }
  }
}
</script>
<style scoped>
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
