<template>
<div class="par_main">
  <b-container fluid>
    <b-row no-gutters>
      <b-col sd="auto" md="auto" class="parAlign">
        <!-- значок для разметки только  -->
        <div class="par_icon_filler" />
      </b-col>
      <b-col sd="10" md="10">
        <span v-if="parDescrShow" class="par_name" v-html="parDescrShow"></span>
      </b-col>
      <b-col sd="1" md="1"></b-col>
    </b-row>
    <b-row no-gutters>
      <b-col sd="auto" md="auto" :class="parAlignStyle">
        <icon-ok v-if="parSignStyle" class="par_icon_ok" />
        <icon-cancel v-if="!parSignStyle" class="par_icon_cancel" />
      </b-col>
      <b-col sd="10" md="10">
        <b-input v-if="!parMulti"
         :type="parType"
         :value="parValue"
         @input="parInput"
         v-on:keyup.enter.native="parEnter"
         autocomplete="off"
         />
        <div v-if="parMulti" class="form-control par_textarea">
          <s-editor :id="par.code" :value="parValue" @input="parInput" :editorOptions="editorSettings" :editorToolbar="editorToolbar" useCustomImageHandler @imageAdded="handleImageAdded" />
        </div>
      </b-col>
      <b-col sd="1" md="1">
        <b-button v-show="parDefault" variant="outline-info" @click="parSetDefault">
          Default
        </b-button>
      </b-col>
    </b-row>
    <b-row no-gutters>
      <b-col sd="auto" md="auto" class="parAlign">
        <!-- значок для разметки только  -->
        <div class="par_icon_filler" />
      </b-col>
      <b-col sd="10" md="10">
        <span v-if="!parSignStyle" class="par_warning">{{parWarning}}</span>
      </b-col>
      <b-col sd="1" md="1"></b-col>
    </b-row>
  </b-container>
</div>
</template>
<script>
import VueEditor from './vue2-editor/VueEditor.vue';
import {
  swStrip,
  convSet
} from './stringlib.js';
const conv = convSet();
import iconOk from '../assets/icon-ok.svg';
import iconCancel from '../assets/icon-cancel.svg';
import axios from 'axios'
import {mapGetters} from 'vuex';


export default {
  props: ["par"],
  components: {
    's-editor': VueEditor,
    'icon-ok': iconOk,
    'icon-cancel': iconCancel
  },
  data() {
    return {
      parValue: "",
      parInt: "",
      parValid: 0,
      parMin: 0,
      parMax: Number.MAX_SAFE_INTEGER,
      parInputState: "none",
      parMulti: false,
      parType: 'text',
      editorSettings: {},
      editorToolbar: [
        ['bold', 'italic', 'strike'],
        ['image', 'link']
      ]
    }
  },
  mounted() {

    let l_pass=true;
    if ("restrictions" in this.par) {
      if ("max_length" in this.par.restrictions) this.parMax = this.par.restrictions.max_length;
      if ("min_length" in this.par.restrictions) this.parMin = this.par.restrictions.min_length;
      if ("multiline" in this.par.restrictions) this.parMulti = this.par.restrictions.multiline;
      if ("password" in this.par.restrictions)
      {
        if(this.par.restrictions.password) this.parType = 'password';
        l_pass=false;
      }
    }

    //если былоуже что-то введено, то оно сохранится. Иначе значение по умолчанию
    if (this.par.value.length > 0 && l_pass === true ) {
      if (this.parMulti) this.parValue = conv.makeHtml(this.par.value.replace(/\n/gm, "<br>")).replace(/<br><\/p>/gm, "</p>").replace(/<br>/gm, "</p><p>");
      else this.parValue = this.par.value;
    } else if ("default_value" in this.par){
       this.parValue = this.parDefault;
    }
    this.parIsChanged();
  },
  methods: {
    handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      // An example of using FormData
      //  Your key could be different such as:
      // formData.append('file', file)

      var formData = new FormData();
      formData.append('image', file)
      var l_address="http://"+this.socketGet.serverAddress+"/images";
      axios({
          url: l_address,
          method: 'POST',
          data: formData
        })
        .then((result) => {
          let url = result.data.filename; // Get url from response
          Editor.insertEmbed(cursorLocation, 'image', l_address+'/'+url);
          resetUploader();
        })
        .catch((err) => {
          console.log(err);
        })
    },
    parInput(val) {
      this.parValue = val.toString(); //.replace(/[^0-9\-]/gm,"");
      this.parIsChanged();

      return this.parValue;
    },
    parIsChanged() {
      let lstr=this.parValue.replace(/<br>/gm, "").replace(/<p>/gm, "").replace(/<\/p>/gm, "<br>");
      if (this.parMulti) lstr = conv.makeMarkdown(lstr).replace(/<br>\n\n/gm, "\n");//.replace(/<([^>]+)>/gm, "$1");
      else lstr = this.parValue;
      if (this.parInt.localeCompare(lstr) != 0) {
        this.parInt = lstr;

        this.parEmit();
      }
      let lvalid = this.parIsValid();
      if (this.parValid != lvalid) {
        this.parValid = lvalid;
        this.parEmit();
      }
    },
    parIsValid() {
      if (this.parMax < swStrip(this.parValue).length) return 0;
      if (this.parMin > swStrip(this.parValue).length) return 0;
      return 1;
    },
    parEmit() {
      this.$emit("parChange", {
        "code": this.par.code,
        "value": this.parInt,
        "valid": this.parValid
      });
    },
    parEnter() {
      this.$emit('par_done');
    },
    parSetDefault() {
      this.parValue = this.parDefault;
      this.parIsChanged();
    }
  },
  computed: {
    ...mapGetters(['socketGet']),
    parDescrShow() {
      if ("description" in this.par) return conv.makeHtml(this.par.description);
      else return false;
    },
    parAlignStyle() {
      if (this.parMulti) return "parAlignT";
      else return "parAlign";
    },
    parSignStyle() {
      if (this.parValid === 0) return false;
      else return true;
    },
    parWarning() {
      let lret = "Любой текст. ";
      if (this.parMin > 0) lret = lret + "Минимум " + this.parMin + ", ";
      if (this.parMax < Number.MAX_SAFE_INTEGER) lret = lret + "максимум " + this.parMax + " символов.";
      return lret;
    },
    parDefault() {
      console.log("DefaultIN: "+this.par.default_value);
      if ("default_value" in this.par)
        if (this.parMulti){
          let lret=conv.makeHtml(this.par.default_value).replace(/<br><\/p>/gm, "</p>").replace(/<br>/gm, "</p><p>");
          console.log("DefaultIN1: "+lret);
          return lret;
        }
        else return this.par.default_value;
      else return false;
    }
  }
}
</script>
<style scoped>
.parAlign {
  padding-right: 5px !important;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.parAlignT {
  padding: 5px !important;
  padding-top: 6px !important;
  width: 32px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
}

.par_main {}

.par_name {
  color: white;
  font-family: monospace;
  font-size: 15px;
  font-style: normal;
  font-weight: normal;
}

.par_box {
  position: relative;
  color: black;
  font-family: monospace;
  font-size: 16px;
  font-style: normal;
  font-weight: normal;
}

.par_icon_ok {
  height: 24px;
  width: 24px;
  fill: green;
}

.par_icon_cancel {
  height: 24px;
  width: 24px;
  fill: red;
}

.par_icon_filler {
  position: relative;
  height: 24px;
  width: 24px;
}

.par_textarea {
  height: auto;
  padding: 0px;
}

.par_warning {
  color: red;
  padding-left: 5px;
  font-size: 0.9em;
  font-style: normal;
  font-weight: normal;
}
</style>
