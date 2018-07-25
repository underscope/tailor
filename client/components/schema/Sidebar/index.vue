<template>
  <div class="schema-sidebar">
    <div v-if="schemaExists && isSelected">
      <sidebar-header
        @save="save"
        @remove="remove"
      />
      <sidebar-body
        :design="currentSelected.design"
        :initial="selected"
        :path="currentSelected.path"
        @update="update"
        ref="body"
      />
    </div>
    <div v-else-if="!isSelected" class="placeholder">
      <h4>Outline Sidebar</h4>
      <div class="mdi mdi-arrow-left"></div>
      <div class="helper">
        Please select an object on the left to view and edit its details
        here.
      </div>
    </div>
    <div v-else class="placeholder">
      <h4>Outline Sidebar</h4>
      <div class="mdi mdi-arrow-left"></div>
      <div class="helper">
        Please create your first Schema on the left to view and edit its details
        here.
      </div>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import unset from 'lodash/unset';
import isEmpty from 'lodash/isEmpty';
import Header from './Header.vue';
import Body from './Body.vue';

export default {
  props: {
    schemaExists: { type: Boolean, default: true },
    currentSelected: { type: Object, default: {} },
  },
  computed: {
    selected() { return cloneDeep(this.currentSelected.value || {}); },
    isSelected() { return !isEmpty(this.currentSelected); }
  },
  methods: {
    update(property, value) {
      this.selected[property] = value;
    },
    save() {
      this.$refs.body.validateAll()
        .then((result) => {
          if (!result) return;
          this.$emit(
            'save',
            schemas => set(schemas, this.currentSelected.path, this.selected)
          );
        });
    },
    remove() {
      this.$emit(
        'save',
        schemas => {
          unset(schemas, this.currentSelected.path);
        }
      );
    }
  },
  components: {
    sidebarHeader: Header,
    sidebarBody: Body
  }
};
</script>

<style lang="scss" scoped>
.schema-sidebar {
  position: absolute;
  right: 0;
  width: 420px;
  height: 100%;
  overflow: auto;
  text-align: left;
  border-top: 1px solid #e8e8e8;
  background-color: #fcfcfc;
}

.placeholder {
  margin-top: 50px;
  padding: 0 15px;
  color: #777;

  h4 {
    padding: 8px 0 18px;
    text-align: center;
    font-size: 19px;
  }

  .mdi {
    float: left;
    padding: 5px 20px 5px 12px;
    font-size: 20px;
  }

  .helper {
    width: 330px;
  }
}
</style>
