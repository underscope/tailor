<template>
  <div
    :class="{ 'selected': isSelected }"
    @click="$emit('focus')"
    class="schema"
  >
    <span class="position">{{ this.tag }}</span>
    <span class="schema-name">{{ this.name }}</span>
    <div class="actions">
      <button
        v-if="collapsible"
        @click.stop="$emit('toggleCollapse')"
        class="collapsible">
        <span :class="collapsibleIcon"></span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tag: { type: String, default: '' },
    name: { type: String, required: true },
    isSelected: { type: Boolean, required: true },
    collapsible: { type: Boolean, default: false },
    collapsed: { type: Boolean, default: false }
  },
  computed: {
    collapsibleIcon() {
      return (this.collapsed)
        ? 'mdi mdi-chevron-up'
        : 'mdi mdi-chevron-down';
    }
  }
};
</script>

<style lang="scss" scoped>
.schema {
  position: relative;
  color: #444;
  font-size: 17px;
  text-align: left;
  background-color: white;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;

  &.selected {
    box-shadow: 0 2px 5px rgba(0,0,0,0.15), 0 2px 5px rgba(0,0,0,0.3);
  }

  .position {
    position: absolute;
    min-width: 44px;
    height: 42px;
    margin-right: 7px;
    padding: 8px 10px 0;
    color: white;
    background-color: #337ab7;
    font-size: 20px;
    text-align: center;
    border-radius: 2px 0 0 2px;
  }

  .collapsible {
    padding: 8px 5px 6px;
    color: #bbb;
    font-size: 26px;
    line-height: 26px;
    background: none;
    border: none;
    outline: none;
  }

  .schema-name {
    display: block;
    position: relative;
    top: 0;
    left: 0;
    height: 42px;
    padding: 10px 60px 0;
    color: #555;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .actions {
    position: absolute;
    top: 0;
    right: 0;
    padding-right: 5px;

    .mdi:hover {
      color: #707070;
    }
  }
}
</style>


