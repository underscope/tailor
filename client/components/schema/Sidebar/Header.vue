<template>
  <div class="header">
    <div @click.stop="$emit('delete')" class="pull-right">
      <div class="btn-delete">
        <span class="mdi mdi-delete"></span>
      </div>
    </div>
    <button @click.stop="$emit('save')" class="btn btn-fab btn-primary">
      <span class="mdi mdi-content-save"></span>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.header {
  position: relative;
  min-height: 70px;
  margin-bottom: 60px;
  padding: 15px 10px;
  background-color: #eee;

  .btn-fab {
    position: absolute;
    bottom: -22px;
    left: 30px;
    padding: 6px;
    color: #fff;
    font-size: 23px;
  }

  .btn-delete {
    padding: 0 20px;
    color: #777;
    font-size: 20px;
    cursor: pointer;

    &:hover {
      color: #555;
    }
  }
}
</style>
