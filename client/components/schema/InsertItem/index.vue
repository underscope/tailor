<template>
  <div>
    <div v-if="!open" @click.stop="show" class="divider-wrapper">
      <div class="divider">
        <div class="action">
          <span class="mdi mdi-plus plus"></span>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="select-action">
          <div
            @click="create" class="action">
            <span class="mdi mdi-plus"></span>
            <span>{{ this.createLabel }}</span>
          </div>
          <div @click="hide" class="action">
            <span class="mdi mdi-close"></span>
            <span>Cancel</span>
          </div>
        </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return { open: false };
  },
  props: {
    createLabel: { type: String, default: 'Create' }
  },
  methods: {
    show() {
      this.open = true;
    },
    hide() {
      this.open = false;
    },
    create() {
      this.$emit('create');
      this.open = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.divider-wrapper {
  width: 100%;
  padding: 7px 0;
  cursor: pointer;
  opacity: 0;

  &:hover {
    opacity: 1;
  }

  .divider {
    position: relative;
    width: 100%;
    height: 2px;
    background-color: #aaa;
    opacity: inherit;

    .action {
      position: absolute;
      top: -8px;
      right: -27px;
      height: 0;
      color: #aaa;
      font-size: 16px;
      text-align: left;
    }
  }

  .plus {
    padding: 0 5px;
    font-size: 20px;
    line-height: 20px;
  }
}

.select-action {
  margin: 0 auto;

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
}
</style>
