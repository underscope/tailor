<template>
    <modal
      :show="show"
      :focus="false"
    >
      <div slot="header">
        <h4 class="modal-title">Create meta</h4>
      </div>
      <div
        slot="body"
        class="body"
      >
        <div
          v-for="(prop, index) in properties"
          :key="index"
        >
          <meta-input
            :meta="prop"
            @validate="validateProperty"
            @update="validateProperty"
            :ref="prop.key"
            class="meta-input"
          />
          <options-editor
            v-if="isSelectType && prop.key === 'type'"
            :options="options"
            @updateOptions="updateOptions"
          />
        </div>
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
import OptionsEditor from './OptionsEditor';
import metaMixin from './mixin.js';

export default {
  mixins: [metaMixin()],
  props: {
    show: { type: Boolean, required: true },
  },
  components: {
    Modal,
    OptionsEditor,
    MetaInput: Meta
  }
};
</script>

<style lang="scss" scoped>
.body {
  height: 55vh;
  overflow-y: scroll;
}

.meta-input {
    margin: 20px 0;
    width: 100%;
}
</style>

