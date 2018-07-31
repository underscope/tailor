<template>
  <div>
    <span class="title">options:</span>
    <div
      v-for="(option, index) in getOptions"
      v-if="option"
      :key="index"
      class="options-container"
    >
      <meta-input 
        :meta="option.label"
        @validate="updateValue"
        class="meta-input"
      />
      <meta-input
        :meta="option.value"
        @validate="updateValue"
        class="meta-input"
      />
    </div>
  </div>
</template>

<script>
import Meta from 'components/common/Meta';

export default {
  props: {
    options: { type: Array, required: true }
  },
  computed: {
    getOptions() {
      return this.options.map(
        (option, index) => {
          if (!option) return undefined;
          const {label, value} = option;
          return {
            label: {
              key: `${index}.label`,
              label: 'label',
              type: 'INPUT',
              value: label || '',
            },
            value: {
              key: `${index}.value`,
              label: 'value',
              type: 'INPUT',
              value: value || '',
            },
          };
        });
    }
  },
  methods: {
    updateValue(key, value) {
      const index = key.split('.')[0];
      this.$emit('updateOptions', index, key, value);
    }
  },
  components: {
    MetaInput: Meta
  }
};
</script>


<style lang="scss" scoped>
.title {
  font-weight: 400;
  font-size: 14px;
  color: #808080;
  margin-left: 8px;
}

.options-container {
  margin: 10px 15px;
  display: flex;

  .meta-input {
    width: 50%;
  }
}

</style>
