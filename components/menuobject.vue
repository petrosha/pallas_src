<template>
<div>
  <div v-if="!objOneObject" class="objAlign">Дождитесь загрузки объекта...</div>
  <div v-if="objOneObject">
    <div class="objAlign" v-if="objTitle">
      <h2  v-html="objTitle" class="obj_title"></h2>
    </div>
    <div class="objAlign" v-if="objSubTitle">
      <h5  v-html="objSubTitle" class="obj_subtitle"></h5>
    </div>
    <div v-if="objTemplate">
      <div v-for="templateItem in objTemplate" class="obj_templategroup">
        <div class="objAlign" v-if="templateItem.name">
          <u>
            <p  v-html="templateItem.name" class="obj_templ_name"></p>
          </u>
        </div>
        <div v-if="templateItem.attributes">
          <s-attribute v-for="attr in templateItem.attributes" :attr="objOneObject.attributes[attr]" :temporary="objTemporary">
          </s-attribute>
        </div>
        <!-- <b-button-group v-if="templateItem.actions"  class="menu_action_btn_group" vertical> -->
        <div v-if="templateItem.actions">
          <button
            v-for="attr in templateItem.actions"
            v-html="objActionNameConv(attr)"
            @click="objActSwitch(attr,$event)"
            :disabled="objOneObject.actions[attr].disabled"
            class="btn btn-outline-primary menu_action_btn lg"/>
        <!-- </b-button-group> -->
        </div>
      </div>
    </div>
    <!-- <div v-if="objAttributes">
      <s-attribute v-for="attr in objAttrs.unused" :attr="objAttributes[attr]">
      </s-attribute>
    </div>
    <b-button-group class="menu_action_btn_group" vertical v-if="objActions">
      <b-button
        variant="outline-primary lg"
        class="menu_action_btn"
        v-for="attr in objAttrs.actunused"
        v-html="objActions[attr].name"
        v-on:click="objActSwitch(attr)"
        :disabled="objActions[attr].disabled" />
    </b-button-group> -->
    <div v-if="objListObject" class="obj_list">
      <hr class="obj_list_hr">
      <span v-if="objListObjectLength" class="objAlign2">Список пуст...</span>
      <div class="obj_list_el" v-for="(lkey,index) in objListObject" @click="objActiveSet(lkey.id)">
        <in-object :objid="lkey" :lkey="objOneObject.id+lkey.id+Math.random()" />
        <!-- <b-button block variant="outline-success lg" class="obj_btn" @click="objActiveSet(lkey.id)">
          <s-dblright class="obj_dbl_arr" />
        </b-button> -->
      </div>
    </div>

    <s-action
      v-if="actStat"
      :objid="objOneObject"
      :actid="actid"
      :key="objOneObject.id+actid"
      @done="objActionDone"/>
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
import {router} from '../routes.js'


export default {
  props: ['objid','small'],
  name: "in-object",
  components: {
    's-attribute': singleAttribute,
    's-action': singleAction,
    's-warning': singleWarning
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
    ...mapActions(['sendAct','sendOpenList']),
    objAttrClean(){
      this.AttrList.used = ["title","subtitle"],
      this.AttrList.unused=[],
      this.AttrList.actused=[],
      this.AttrList.actunused=[]
    },
    objActiveSet(listid){
      this.sendOpenList({objid:this.obj.object.id, listid: listid});
    },
    objActSwitch(actName,event){
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

      if (this.actStat === false && this.wrnStat === false )
        if(this.small) this.$emit('done');
      return false;
    },
    objWrnDone(reply){
      router.beforeHooks.length=0;
      this.wrnStat=false;
      this.wrnMessage="";
      if(reply==="ok") {
        this.sendAct({actid:this.actid,obj:this.objOneObject});
        if(this.small) this.$emit('done');
      }
    },
    objActionDone(reply) {
      router.beforeHooks.length=0;
      this.actid = false;
      this.actStat = false;
      if(reply==="ok"){
        if(this.small){
          this.$emit('done');
        }
      }
      return false;
    },
    objActionNameConv(attr) {
      return conv.makeHtml(this.objOneObject.actions[attr].name);
    },
  },
  computed: {
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
  /* border-left: 2px rgba(51, 153, 255, 0.75) solid; */
  width: 100%;
  height: 100%;

  /* padding-left: 10px; */
  margin-bottom: 10px;
  background: rgba(51, 153, 255, 0.11);
  cursor: pointer;

}

.menu_action_btn_group {
  width: 100%;
}

.menu_action_btn {
  width: 100%;
  margin-top:2px;
  margin-bottom: 2px;
  padding-left: 10px;
  padding-right: 10px;
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
}

.obj_list {
  width: 100%;
}

.obj_list_hr {
  border-top: 1px solid rgba(51, 153, 255, 0.75);
  width: 80%;
}

.obj_dbl_arr {
  fill: green;
  width: 20px;
  height: 20px;
}

.obj_title {
  white-space: nowrap;
  font-size: 20px;
}

.obj_subtitle {
  white-space: nowrap;
  margin-left: 10px;
  font-style: italic;
  font-size: 18px;
  color:rgba(51, 153, 255, 1);
}

.obj_templategroup {
  position: relative;
  background: rgba(51, 153, 255, 0.11);
  width: 100%;
  padding: 5px 5px;
  margin-bottom: 5px;

  border-radius:5px;

  font-size: 16px;
  font-weight: bold;
  font-style: italic;
  overflow-x: hidden;
}

.obj_templ_name {
  white-space: nowrap;
  font-weight: bold;
  margin-bottom: 0.5em;
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
    padding-right: 5px;
    padding-left:5px;
    overflow-x: hidden;
  }
  .objAlign2 {
      width:100%;
      display: flex;
      align-items: center;
      justify-content: center;
  }
/deep/ p {
  margin-bottom: 0px;
}
</style>
