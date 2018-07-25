<template>
  <div class="popup">
    <transition name="fade">
      <slot v-if="visible"></slot>
    </transition>
  </div>
</template>

<script>
import Promise from 'bluebird';

export default {
  data() {
    return {
      visible: false,
    };
  },
  props: {
    duration: { type: Number, default: 2 },
  },
  methods: {
    show() {
      const durationMiliseconds = this.duration * 1000;
      this.visible = true;
      return Promise.delay(durationMiliseconds)
        .then(() => {
          this.visible = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
  .popup {
    display: inline-block;
    position: fixed;
    z-index: 100;
    left: 50%;
    transform: translate(-50%, 0);
    bottom: 10%;

    .fade-enter-active, .fade-leave-active {
      transition: opacity .8s;
    }

    .fade-enter, .fade-leave-to {
      opacity: 0;
    }
  }
</style>
