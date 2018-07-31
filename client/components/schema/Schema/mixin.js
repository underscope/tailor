import { withValidation } from 'utils/validation';
import mapValues from 'lodash/mapValues';
import find from 'lodash/find';
import isString from 'lodash/isString';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import invoke from 'lodash/invoke';
import isEmpty from 'lodash/isEmpty';
import { mapPropertiesToInput, reach, reachDeep } from 'utils/schemaDesign';

const cleanItem = (item) =>
  mapValues(item, item => (isString(item) ? item.trim() : item));

export default function (inheritData = false) {
  return {
    mixins: [withValidation()],
    props: {
      parent: { type: Array, required: true },
      parentPath: { type: String, required: false },
      index: { type: Number, default: -1 }
    },
    data() {
      const path = `${this.parentPath}.${this.index}`;
      const modifiedSchema = get(this.parent, path, {});
      return {
        design: reach('0'),
        modifiedSchema,
        defaultSchema: {}
      };
    },
    computed: {
      schema: {
        get() { return cloneDeep(this.modifiedSchema); },
        set(schema) { this.modifiedSchema = schema; }
      },
      properties() {
        const properties = mapPropertiesToInput(this.design, true);
        return properties.map(
          prop => ({
            ...prop,
            value: this.schema[prop.key],
            hasError: !!this.vErrors.first(prop.key)
          }));
      },
      path() {
        const path = `${this.parentPath}.${this.index}`;
        return (this.index === -1)
          ? this.parentPath
          : path;
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
        this.schema = cleanItem(this.schema);
        if (!isEmpty(this.vErrors.all())) return Promise.resolve(false);
        const allValidations = this.properties.map(
          ({key}) => (this.validateProperty(key, this.schema[key]))
        );
        return Promise.all(allValidations)
          .then(() => {
            const { id: modifiedId } = this.schema;
            const errorMsg = `Schema with an id ${modifiedId} already exists`;
            const noErrors = isEmpty(this.vErrors.all());
            const uniqueId = !find(this.parent, ({id}, index) => (
              id === modifiedId && index !== this.index
            ));
            if (!uniqueId) this.$emit('error', errorMsg);
            return noErrors && uniqueId;
          });
      },
      clearFields() {
        this.schema = this.defaultSchema;
        this.properties.forEach(
          ({key}) => invoke(this.$refs, `${key}.0.clearValue`)
        );
      },
      create() {
        this.validateAll()
          .then(result => {
            if (result) {
              const schema = cloneDeep(this.schema);
              this.$emit('create', this.parentPath, schema);
              if (!inheritData) this.clearFields();
            }
          });
      },
      update(propName, value) {
        value = value.trim();
        return this.validateProperty(propName, value)
          .then(result => {
            if (!result) return;
            this.schema = { ...this.schema, [propName]: value };
          });
      },
      save() {
        this.validateAll()
        .then(result => {
          const schema = cloneDeep(this.schema);
          if (result) this.$emit('update', this.path, schema);
        });
      },
      remove() {
        this.$emit('remove', this.path);
      }
    }
  };
}
