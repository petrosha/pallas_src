<template>
<div v-if="!eqp.empty" class="eqp_main" @click.stop="">
  <i-drill v-if="ifdriller" :class="iconclass" />
  <i-box v-if="ifbox" :class="iconclass" />
  <i-brill v-if="ifbrill" :class="iconclass" />
  <i-buksir v-if="ifbuksir" :class="iconclass" />
  <i-dron v-if="ifdron" :class="iconclass" />
  <i-digger v-if="ifdigger" :class="iconclass" />
  <i-iron v-if="ifiron" :class="iconclass" />
  <i-loader v-if="ifloader" :class="iconclass" />
  <i-stealer v-if="ifstealer" :class="iconclass" />
  <i-stone v-if="ifstone" :class="iconclass" />
  <i-ship v-if="ifship" :class="iconclass" />
  <i-barge v-if="ifbarge" :class="iconclass" />
  <i-train v-if="iftrain" :class="iconclass" />
</div>
</template>
<script>
import driller from '../assets/svg/prohodchik.svg';
import box from '../assets/svg/box.svg';
import brill from '../assets/svg/brill.svg';
import buksir from '../assets/svg/buksir.svg';
import dron from '../assets/svg/dron.svg';
import digger from '../assets/svg/digger.svg';
import iron from '../assets/svg/iron.svg';
import loader from '../assets/svg/loader.svg';
import stealer from '../assets/svg/stealer.svg';
import stone from '../assets/svg/stone.svg';
import ship from '../assets/svg/ship.svg';
import barge from '../assets/svg/barge.svg';
import train from '../assets/svg/train.svg';

export default {
  props: ['eqp'],
  components: {
    'i-drill': driller,
    'i-box': box,
    'i-brill': brill,
    'i-buksir': buksir,
    'i-dron': dron,
    'i-digger': digger,
    'i-iron': iron,
    'i-loader': loader,
    'i-stealer': stealer,
    'i-stone': stone,
    'i-ship': ship,
    'i-barge': barge,
    'i-train': train
  },
  data() {
    return {
      iconclass:"iconclass"
    }
  },
  methods: {},
  created(){
    if(this.eqp.firm === "TM") this.iconclass=this.iconclass.concat(" red");
    if(this.eqp.firm === "DB") this.iconclass=this.iconclass.concat(" green");
    if(this.eqp.firm === "AC") this.iconclass=this.iconclass.concat(" orange");
    if(this.eqp.firm === "SH") this.iconclass=this.iconclass.concat(" blue");
    if(this.eqp.firm === "TO") this.iconclass=this.iconclass.concat(" magenta");
    if(this.eqp.broken) this.iconclass=this.iconclass.concat(" broken");
    if(this.eqp.work) this.iconclass=this.iconclass.concat(" blink_me");
  },
  computed: {
    ifdriller() {
      if (this.eqp.type === "driller") return true;
      return false;
    },
    ifbox() {
      if (this.eqp.type === "box") return true;
      return false;
    },
    ifbrill() {
      if (this.eqp.type === "brill") return true;
      return false;
    },
    ifbuksir() {
      if (this.eqp.type === "buksir") return true;
      return false;
    },
    ifdron() {
      if (this.eqp.type === "dron") return true;
      return false;
    },
    ifdigger() {
      if (this.eqp.type === "digger") return true;
      return false;
    },
    ifiron() {
      if (this.eqp.type === "iron") return true;
      return false;
    },
    ifloader() {
      if (this.eqp.type === "loader") return true;
      return false;
    },
    ifstealer() {
      if (this.eqp.type === "stealer") return true;
      return false;
    },
    ifstone() {
      if (this.eqp.type === "stone") return true;
      return false;
    },
    ifship() {
      if (this.eqp.type === "ship") return true;
      return false;
    },
    ifbarge() {
      if (this.eqp.type === "barge") return true;
      return false;
    },
    iftrain() {
      if (this.eqp.type === "train") return true;
      return false;
    },
  }
}
</script>
<style scoped>
.iconclass {
  position:relative;
  /* width: 100%; */
  height: 100%;
}
.red{fill:red;}
.blue{fill:blue;}
.orange{fill:orange;}
.green{fill:green;}
.magenta{fill:magenta;}

.broken{border:2px solid red;}

.blink_me {
  animation: blinker 3s linear infinite;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}

.eqp_main {
  position: relative;
  width: 100%;
  height: 100%;
  /* display: flex;
  align-items: center;
  justify-content: center; */

}
</style>
