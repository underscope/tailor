<template>
  <component
    :is="currentComponent"
    :initial="initial"
    :parent="parent"
    :path="path"
    @update="update"
    @remove="remove"
    @error="error"
    ref="component"
  />
</template>

<script>
import { getDesignType } from 'utils/schemaDesign';
import Schema from '../Schema/Sidebar';
import Meta from '../Meta/Sidebar';

export default {
  props: {
    parent: { type: Array, required: true },
    initial: { type: Object, required: true },
    path: { type: String, default: '' }
  },
  computed: {
    currentComponent() {
      const type = getDesignType(this.path);
      if (type === 'META') return 'MetaBody';
      return 'Schema';
    },
  },
  methods: {
    update(path, item) {
      this.$emit('update', path, item);
    },
    remove(path) {
      this.$emit('remove', path);
    },
    error(message) {
      this.$emit('error', message);
    },
    save() {
      this.$refs.component.update();
    },
    delete() {
      this.$refs.component.remove();
    }
  },
  components: {
    Schema,
    MetaBody: Meta
  }
};
</script>

