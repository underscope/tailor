<template>
  <div class="body">
    <div class="meta-element">
      <meta-input
        v-for="prop in properties"
        :meta="prop"
        :key="`${path}.${prop.key}`"
        @validate="validate">
      </meta-input>
    </div>
  </div>
</template>

<script>
import Meta from 'components/common/Meta';
import { getProperties, getInputType } from 'utils/schemaDesign';
import { withValidation } from 'utils/validation';
import isEmpty from 'lodash/isEmpty';

export default {
  mixins: [withValidation()],
  props: {
    design: { type: Object, required: true },
    initial: { type: Object, required: true },
    path: { type: String, default: '' }
  },
  computed: {
    item() { return this.initial; },
    properties() {
      return getProperties(this.design).map(
        ([propName, propValidator]) => ({
          key: propName,
          value: this.item[propName],
          type: getInputType(propValidator),
          label: propName
        }));
    }
  },
  methods: {
    validate(propName, value) {
      this.$emit('update', propName, value);
      this.vErrors.remove(propName);
      const properties = getProperties(this.design);
      const [, validator] = properties.find(props => props.includes(propName));
      return validator.validate(value)
        .catch(error => {
          this.vErrors.add({
            field: propName,
            msg: error.message
          });
        });
    },
    validateAll() {
      const allValidations = this.properties.map(
        ({key}) => (this.validate(key, this.item[key]))
      );
      return Promise.all(allValidations)
        .then(() => (isEmpty(this.vErrors.all())));
    }
  },
  components: {
    MetaInput: Meta
  }
};
</script>

<style lang="scss" scoped>
.body {
  position: relative;
  padding: 6px 15px;
}

.publish-container {
  min-height: 70px;
  padding: 0 7px;

  .publish-date {
    width: 170px;
    line-height: 44px;
  }

  .btn {
    position: absolute;
    top: 10px;
    right: 24px;
    padding: 6px;
  }

  .circular-progress {
    width: 24px;
    margin: 0 20px;
  }
}

.discussion {
  margin-top: 32px;
  margin-bottom: 8px;
}

.type-label {
  display: inline-block;
  margin: 5px 0 25px 7px;
}
</style>
