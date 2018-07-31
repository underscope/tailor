<template>
    <modal :show="show" :focus="false">
      <div slot="header">
        <h4 class="modal-title">Create schema</h4>
      </div>
      <div slot="body">
        <meta-input
          v-for="(prop, index) in properties"
          :key="index"
          :meta="prop"
          @input="update"
          :ref="prop.key"
          class="meta-input"/>
      </div>
      <div slot="footer">
        <button
          @click.stop="$emit('hide-modal')"
          class="btn btn-material btn-default"
          type="button">
          Cancel
        </button>
        <button
          @click.stop="create"
          class="btn btn-material btn-primary"
          type="button">
          Create
        </button>
      </div>
    </modal>
</template>

<script>
import Modal from 'components/common/Modal';
import Meta from 'components/common/Meta';
import schemaMixin from './mixin.js';

export default {
  mixins: [schemaMixin()],
  props: {
    show: { type: Boolean, required: true },
  },
  components: {
    Modal,
    MetaInput: Meta
  }
};
</script>

<style lang="scss" scoped>
.meta-input {
    margin: 20px 0;
}
</style>

