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
          @validate="validate"
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
import { getProperties, getInputType } from 'utils/schemaDesign';
import { withValidation } from 'utils/validation';
import isEmpty from 'lodash/isEmpty';

export default {
  mixins: [withValidation()],
  props: {
    show: { type: Boolean, required: true },
    design: { type: Object, required: true }
  },
  data() {
    return { item: {} };
  },
  computed: {
    properties() {
      return getProperties(this.design).map(
        ([propName, propValidator]) => ({
          key: propName,
          value: this.item[propName],
          type: getInputType(propValidator),
          label: propName,
          hasError: !!this.vErrors.first(propName)
        }));
    },
  },
  methods: {
    validate(propName, value) {
      this.vErrors.remove(propName);
      const properties = getProperties(this.design);
      const [, validator] = properties.find(props => props.includes(propName));
      return validator.validate(value)
        .then(() => { this.item[propName] = value; })
        .catch(error => {
          this.vErrors.add({
            field: propName,
            msg: error.message
          });
        });
    },
    create() {
      const errors = this.vErrors.all();
      if (!isEmpty(errors)) return;
      const allValidations = this.properties.map(
        ({key, value}) => (this.validate(key, value))
      );
      Promise.all(allValidations)
      .then(() => (
        (isEmpty(this.vErrors.all()))
          ? this.$emit('create', this.item)
          : false
      ));
    }
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

