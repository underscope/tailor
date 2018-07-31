<template>
  <div class="schema-sidebar">
    <div v-if="schemaExists && !selectedIsCollection">
      <sidebar-header
        @save="save"
        @remove="this.delete"
      />
      <sidebar-body
        :parent="currentSelected.parent"
        :initial="currentSelected.value"
        :path="currentSelected.path"
        @update="update"
        @remove="remove"
        @error="error"
        ref="body"
      />
    </div>
    <div v-else-if="selectedIsCollection" class="placeholder">
      <h4>Collection</h4>
      <div class="divider"></div>
      <div class="helper">
        You selected a collection. Please select one of its items to view and
        edit item details here.
      </div>
    </div>
    <div v-else class="placeholder">
      <h4>Outline Sidebar</h4>
      <div class="mdi mdi-arrow-left" />
      <div class="helper">
        Please create your first Schema on the left to view and edit its details
        here.
      </div>
    </div>
  </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import { getType } from 'utils/schemaDesign';
import Header from './Header';
import Body from './Body';

export default {
  props: {
    schemaExists: { type: Boolean, default: true },
    currentSelected: { type: Object, default: {} },
  },
  computed: {
    isSelected() { return !isEmpty(this.currentSelected); },
    selectedIsCollection() {
      return (getType(this.currentSelected.design) === 'array');
    }
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
      this.$refs.body.save();
    },
    delete() {
      this.$refs.body.delete();
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

  .divider {
    float: left;
    width: 52px;
    height: 50px;
  }

  .helper {
    width: 330px;
  }
}
</style>
