<template>
  <component
    :is="resolveComponent(meta.type)"
    :meta="meta"
    @update="(key, value) => $emit('update', key, value)"
    @input="(key, value) => $emit('input', key, value)"
    ref="component">
  </component>
</template>

<script>
import isFunction from 'lodash/isFunction';
import keys from 'lodash/keys';
import Checkbox from './Checkbox';
import ColorPicker from './ColorPicker';
import DatePicker from './DatePicker';
import Input from './Input';
import mapKeys from 'lodash/mapKeys';
import Select from './Select';
import Switch from './Switch';
import Textarea from './Textarea';

const META_TYPES = {
  CHECKBOX: Checkbox,
  COLOR: ColorPicker,
  DATE: DatePicker,
  DATETIME: DatePicker,
  INPUT: Input,
  SELECT: Select,
  SWITCH: Switch,
  TEXTAREA: Textarea
};
const components = mapKeys(META_TYPES, 'name');

export default {
  props: ['meta'],
  methods: {
    resolveComponent(type = '') {
      return META_TYPES[type.toUpperCase()] || META_TYPES.INPUT;
    },
    clearValue() {
      const clear = this.$refs.component.clearValue;
      if (isFunction(clear)) clear();
    }
  },
  components
};

export const metaTypes = keys(META_TYPES);
</script>
