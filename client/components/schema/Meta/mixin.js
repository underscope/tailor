import { withValidation } from 'utils/validation';
import find from 'lodash/find';
import get from 'lodash/get';
import set from 'lodash/set';
import unset from 'lodash/unset';
import filter from 'lodash/filter';
import last from 'lodash/last';
import cloneDeep from 'lodash/cloneDeep';
import invoke from 'lodash/invoke';
import isEmpty from 'lodash/isEmpty';
import { metaTypes } from 'components/common/Meta';

import { mapPropertiesToInput, reach, reachDeep } from 'utils/schemaDesign';

export default function () {
  return {
    mixins: [withValidation()],
    props: {
      parent: { type: Array, required: true },
      parentPath: { type: String, required: false },
      index: { type: Number, default: -1 }
    },
    data() {
      const defaultMeta = { type: metaTypes[0] };
      const path = `${this.parentPath}.${this.index}`;
      const modifiedMeta = get(this.parent, path, defaultMeta);
      return {
        design: reach('0.meta.0'),
        modifiedMeta,
        defaultMeta
      };
    },
    computed: {
      meta: {
        get() { return cloneDeep(this.modifiedMeta); },
        set(meta) { this.modifiedMeta = cloneDeep(meta); }
      },
      properties() {
        const properties = mapPropertiesToInput(this.design, true);
        Object.assign(
          find(properties, { key: 'type' }),
          { options: metaTypes,
            type: 'select'
          });
        return properties.map(
          prop => ({
            ...prop,
            value: this.meta[prop.key],
            hasError: !!this.vErrors.first(prop.key)
          })
        );
      },
      path() {
        const path = `${this.parentPath}.${this.index}`;
        return (this.index === -1)
          ? this.parentPath
          : path;
      },
      isSelectType() {
        return this.meta['type'] === 'SELECT';
      },
      inheritData() {
        return this.index !== -1;
      }
    },
    methods: {
      validateProperty(name, value) {
        this.vErrors.remove(name);
        const validator = reachDeep(this.design, name);
        return validator.validate(value)
          .then(() => true)
          .catch(error => {
            this.vErrors.add({
              field: name,
              msg: error.message
            });
            return false;
          });
      },
      validateAll() {
        const errors = this.vErrors.all();
        if (!isEmpty(errors)) return Promise.resolve(false);
        const allValidations = this.properties.map(
          ({key}) => (this.validateProperty(key, this.meta[key]))
        );
        return Promise.all(allValidations)
          .then(() => {
            const { key: modifiedKey } = this.meta;
            const errorMsg = `Meta with a key ${modifiedKey} already exists`;
            const noErrors = isEmpty(this.vErrors.all());
            const uniqueId = !find(this.parent, ({key}, index) => (
              key === modifiedKey && index !== this.index
            ));
            if (!uniqueId) this.$emit('error', errorMsg);
            return noErrors && uniqueId;
          });
      },
      clearFields() {
        this.meta = this.defaultMeta;
        this.properties.forEach(
          ({key}) => invoke(this.$refs, `${key}.0.clearValue`)
        );
      },
      create() {
        this.validateAll()
          .then(result => {
            if (!result) return;
            const meta = cloneDeep(this.meta);
            if (!this.inheritData) this.clearFields();
            if (!this.isSelectType) unset(meta, 'options');
            this.$emit('create', this.path, meta);
          });
      },
      update(propName, value) {
        value = value.trim();
        this.validateProperty(propName, value)
          .then(result => {
            if (result) this.meta = { ...this.meta, [propName]: value };
          });
      },
      save() {
        this.validateAll()
          .then(result => {
            const meta = cloneDeep(this.meta);
            if (result) this.$emit('update', this.path, meta);
          });
      },
      remove() {
        this.$emit('remove', this.path);
      },
      updateOptions(index, key, val) {
        val = val.trim();
        const options = cloneDeep(this.meta.options);
        set(options, key, val);
        const option = get(options, index);
        const isLast = last(options) === option;
        const valueIsEmpty = isEmpty(option.value);
        const labelIsEmpty = isEmpty(option.label);
        if (isLast && !isEmpty(val)) options.push({});
        if (!isLast && labelIsEmpty && valueIsEmpty) unset(options, index);
        this.options = filter(options);
      }
    }
  };
}
