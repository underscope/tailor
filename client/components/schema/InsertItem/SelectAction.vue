<template>
  <div class="select-action">
    <div
      @click="$emit('create')" class="action">
      <span class="mdi mdi-plus"></span>
      <span>Create</span>
    </div>
    <div @click="$emit('close')" class="action">
      <span class="mdi mdi-close"></span>
      <span>Cancel</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.select-action {
  margin: 0 auto;
}

.action {
  display: inline-block;
  margin: 20px 25px;

  &:hover {
    color: #42b983;
    cursor: pointer;
  }

  span {
    display: block;
    font-size: 16px;
  }

  .mdi {
    padding-bottom: 7px;
    font-size: 26px;
  }
}
</style>
