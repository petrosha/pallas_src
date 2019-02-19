<template>
  <div class="wrnAlign">
    <h1 class="wrn_warning">Ошибка!</h1>
  </div>
</template>
<script>

export default {
  data() {
    return {}
  }
}
</script>
<style scoped>
.wrn_warning {
  color: red;
}
.wrnAlign {
  width: 100%;
  height:100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
