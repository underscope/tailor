<template>
  <div
    @click="focus"
    :class="{ focused: isFocused, frame }"
    class="content-element">
    <component
      :is="componentName"
      @add="$emit('add', $event)"
      @save="$emit('save', $event)"
      @delete="$emit('delete')"
      @focus="focus"
      v-bind="$attrs"
      :element="element"
      :is-focused="isFocused"
      :is-dragged="isDragged" />
  </div>
</template>

<script>
import { getComponentName, getElementId } from './utils';
import EventBus from 'EventBus';

export default {
  name: 'content-element',
  inheritAttrs: false,
  props: {
    element: { type: Object, required: true },
    parent: { type: Object, default: null },
    isDragged: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false },
    frame: { type: Boolean, default: true }
  },
  data() {
    return { isFocused: false };
  },
  computed: {
    id() {
      return getElementId(this.element);
    },
    componentName() {
      return getComponentName(this.element.type);
    },
    elementBus() {
      return EventBus.channel(`element:${this.id}`);
    }
  },
  methods: {
    focus(e, element = this.element, parent = this.parent) {
      if (this.isDisabled || e.component) return;
      EventBus.emit('element:focus', element, parent);
      e.component = { name: 'content-element', data: element };
    }
  },
  created() {
    EventBus.on('element:focus', element => {
      this.isFocused = !!element && (getElementId(element) === this.id);
    });
    this.elementBus.on('delete', () => this.$emit('delete'));
  },
  provide() {
    return {
      $elementBus: this.elementBus
    };
  }
};
</script>

<style lang="scss" scoped>
.content-element {
  position: relative;

  &.focused {
    border: 1px solid #90a4ae;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.15);
  }
}

.frame {
  padding: 10px 20px;
  border: 1px dotted #ccc;
}
</style>
