<template>
    <div>
      <create-modal
        :title="'Create meta'"
        :show="modalOpen"
        :parent="metas"
        :parent-path="path"
        @create="create"
        @error="error"
        @hide-modal="toggleModal"
      />
      <item-wrapper 
        :tag="'MC'"
        :name="'Metas'"
        :is-selected="isSelected(path)"
        :collapsible="hasMetas"
        :collapsed="collapsed"
        @toggleCollapse="toggleCollapse"
        @focus="$emit('focus', path)"
      />
      <item-wrapper
        v-if="collapsed"
        v-for="(meta, index) in metas"
        :key="meta.key"
        :tag="'M'"
        :name="meta.label"
        :is-selected="isSelected(`${path}.${index}`)"
        @focus="$emit('focus', `${path}.${index}`)"
        class="meta"
      />
      <insert-item
        :create-label="'Create meta'"
        @create="toggleModal"
      />
    </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import ItemWrapper from '../ItemWrapper';
import InsertItem from '../InsertItem';
import CreateModal from './Modal';

export default {
  data() {
    return {
      modalOpen: false,
      collapsed: false,
    };
  },
  props: {
    path: { type: String, required: true },
    currentSelected: { type: Object, required: true },
    metas: { type: Array, required: true }
  },
  computed: {
    hasMetas() {
      return !isEmpty(this.metas);
    },
  },
  methods: {
    create(path, meta) {
      this.$emit('create', path, meta);
      this.modalOpen = false;
      this.collapsed = true;
    },
    error(message) {
      this.$emit('error', message);
    },
    toggleModal() {
      this.modalOpen = !this.modalOpen;
    },
    toggleCollapse() {
      this.collapsed = !this.collapsed;
    },
    isSelected(path) {
      return this.currentSelected.path === path;
    },
  },
  components: {
    ItemWrapper,
    InsertItem,
    CreateModal
  }
};
</script>

<style lang="scss" scoped>
.meta {
  margin-top: 16px;
  margin-left: 40px;
}
</style>
