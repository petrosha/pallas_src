<template>
<p class="attr_desc" @click="attrClick($event)" v-if="show" v-html="showValue"></p>
</template>
<script>
import {
  convSet
} from './stringlib.js';
const conv = convSet();

import {router} from '../routes.js';

export default {
  props: ["attr","temporary"],
  data() {
    return {}
  },
  mounted() {
    // let l_par=d
  },
  methods:{
    attrClick(event) {
      if (event.target.localName == 'a') {
        event.stopPropagation();
        if (event.target.href.substring(0,7) === 'babcom:') {
          if(this.temporary) router.repalce(event.target.href.substring(7,event.target.href.length));
          else router.push(event.target.href.substring(7,event.target.href.length));
          event.preventDefault();
        }
      }
    }
  },
  computed: {
    show() {
      if (typeof this.attr.value === "string" ||
        typeof this.attr.value === "number" ||
        typeof this.attr.name === "string" ||
        typeof this.attr.name === "number" ||
        typeof this.attr.value_description === "string" ||
        typeof this.attr.value_description === "number"
       ) return !this.attr.hidden;
      else return false;
    },
    value() {
      let lret;
      if (typeof this.attr.value_description === "string" || typeof this.attr.value_description === "number")
        lret=this.attr.value_description;
      else lret=this.attr.value;

      if(lret===null || lret===undefined ) return ""; else return lret;
    },
    showValue() {
      //убираем спец. символы для HTML
      if ("name" in this.attr) return conv.makeHtml("**" + this.attr.name + ":** " + this.value);
      return conv.makeHtml(" "+this.value);
    }
  }
}
</script>
<style scoped>
.attr_desc {
  position: relative;
  color: white;
  font-style: normal;
  font-weight: normal;
  margin-bottom: 0.5em;
}

/deep/ a {
  color: lightskyblue;
}

/deep/ a:hover {
  color: violet;
}

/deep/ .attr_desc p {
  margin-bottom: 0px;
}

/deep/ p {
  margin-bottom: 0px;
}
</style>
