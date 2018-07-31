<template>
  <div>
    <item-wrapper 
      :tag="'S'"
      :name="this.schema.name"
      :is-selected="isSelected"
      :collapsible="true"
      :collapsed="collapsed"
      @toggleCollapse="toggleCollapse"
      @focus="focus(index)"
    />
    <div v-if="collapsed" class="sub-items">
      <meta-list
        :parentPath="`${index}.meta`"
        :metas="schema.meta || []"
        :current-selected="currentSelected"
        @create="create"
        @error="error"
        @focus="focus"
        class="meta-list"
      />
    </div>
  </div>
</template>

<script>
import ItemWrapper from '../ItemWrapper';
import Meta from '../Meta';

export default {
  data() {
    return {
      collapsed: false
    };
  },
  props: {
    currentSelected: { type: Object, required: true },
  },
  computed: {
    isSelected() {
      return this.currentSelected.path === this.path;
    }
  },
  methods: {
    create(path, item) {
      this.$emit('create', path, item);
    },
    toggleCollapse() {
      this.collapsed = !this.collapsed;
    },
    error(message) {
      this.$emit('error', message);
    },
    focus(path) {
      this.$emit('focus', String(path));
    }
  },
  components: {
    ItemWrapper,
    MetaList: Meta
  }
};
</script>

<style lang="scss" scoped>
.sub-items {
  margin-left: 40px;
}

.meta-list {
  margin-top: 16px;
}
</style>
