<template>
  <div>
    <create-modal
      v-if="!schemaExists"
      :show="modalActive"
      :design="design"
      @hide-modal="hideModal"
      @create="create"
    />
    <div v-if="schemaExists">
      <div
        :class="{ 'selected': isSelected }"
        @click="focusschema(path)"
        class="schema">
        <span class="position">S</span>
        <span class="schema-name">{{ this.schema.name }}</span>
      </div>
    </div>
    <div
      v-else
      class="well"
    >
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
import isEmpty from 'lodash/isEmpty';
import CreateModal from './CreateModal.vue';

export default {
  data() {
    return {
      modalActive: false
    };
  },
  props: {
    design: { type: Object, required: true },
    schema: { type: [Object, Array], required: true },
    currentSelected: { type: Object, required: true },
    schemaExists: { type: Boolean, required: true },
    path: { type: String, required: true }
  },
  computed: {
    contentContainers() {
      if (this.isRoot) return true;
    },
    activityTypes() {
      if (this.isRoot) return true;
    },
    isSelected() {
      return this.currentSelectedPath === this.path;
    }
  },
  methods: {
    isEmpty,
    create(schema) {
      this.modalActive = false;
      this.$emit('create', schema);
    },
    update(schema) {
      this.$emit('create', schema);
    },
    showModal() {
      this.modalActive = true;
    },
    hideModal() {
      this.modalActive = false;
    },
    focusschema(path) {
      this.$emit('focus', path);
    }
  },
  components: {
    CreateModal
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

.sub-schema {
  margin-left: 40px;
}
.well {
  background-color: white;
  border: 1px solid #ccc;
  margin-left: auto;
  margin-right: auto;
  width: 40%;

  input {
    margin: 6px;
    padding-left: 5px;
  }
}
</style>


