<template>
<div class="spin_main">
  <!-- <div class="spinAlignV"> -->
    <h2 v-if="!error" class="spin_note" v-html="text"></h2><br><br>
    <h2 v-if="error" class="spin_error" v-html="error"></h2><br><br>
  <!-- </div> -->
  <!-- <div class="spinAlignV"> -->
    <s-spinner  v-if="!error" size="80px"/>
    <i-frown  v-if="error" class="spin_frown"/>
  <!-- </div> -->
</div>
</template>
<script>

import {Circle10} from 'vue-loading-spinner'
import iconFrown from '../assets/frown.svg';

export default {
  props: ['text',"error"],
  components: {
    's-spinner':Circle10,
    'i-frown':iconFrown
  },
  data() {return {}},
}
</script>
<style scoped>

.spin_main {
  position: fixed;
  display: flex;
  flex-direction: column;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(25, 25, 25, 0.75);
  width: 100%;
  padding: 10vh;
  height: 100vh;
  top: 0px;
  left: 0px;
  z-index: 10000000;
}
.spin_note {
  margin: 50px;
}
.spin_error {
  color:red;
  margin: 50px;
}
.spin_frown
{
  height: 80px;
  width: 80px;
  fill:red;
}
</style>
