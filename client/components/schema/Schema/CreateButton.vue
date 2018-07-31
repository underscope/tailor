<template>
  <div>
    <create-modal
      :show="modalOpen"
      :path="''"
      :parent="this.schemas"
      @hide-modal="hideModal"
      @create="create"
      @error="error"
    />
    <div v-if="schemaExists" class="divider"/>
    <div class="well">
      <div class="row">
        <div class="col-md-12">
          <button
            @click="showModal"
            class="btn btn-block btn-primary btn-material">
            Create schema
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CreateModal from './Modal';
import InsertItem from '../InsertItem';

export default {
  data() {
    return { modalOpen: false };
  },
  props: {
    schemas: { type: Array, required: true },
    schemaExists: { type: Boolean, required: true },
  },
  methods: {
    showModal() {
      this.modalOpen = true;
    },
    hideModal() {
      this.modalOpen = false;
    },
    create(parentPath, schema) {
      this.modalOpen = false;
      this.$emit('create', parentPath, schema);
    },
    error(message) {
      this.$emit('error', message);
    }
  },
  components: {
    CreateModal,
    InsertItem
  }
};
</script>

<style lang="scss" scoped>
.well {
  background-color: white;
  border: 1px solid #ccc;
  margin-left: auto;
  margin-right: auto;
  width: 40%;
}

.divider {
  height: 60px;
}
</style>
