const yup = require('yup');
const get = require('lodash/get');
const invoke = require('lodash/invoke');
const find = require('lodash/find');
const toPairs = require('lodash/toPairs');
const { schemaDesign: design } = require('shared/schema-validation');

export default design;

export function getType(yupObject) {
  return get(invoke(yupObject, 'describe'), 'type');
}

export function getDesignType(yupPath) {
  const path = yupPath.split('.');
  if (path.length === 1) return 'SCHEMA';
  return path[1].toLocaleUpperCase();
}

export function getSubtypes(yupObject) {
  const type = getType(yupObject);
  if (type === 'array') return [yupObject._subType];
  if (type === 'object') return yupObject.fields.values;
  return [];
}

export function getDefault(yupObject) {
  const type = getType(yupObject);
  switch (type) {
    case 'object': return {};
    case 'array': return [];
  }
}

export function getProperties(yupObject, { shallow = true } = {}) {
  const type = getType(yupObject);
  if (type !== 'object') return [];
  if (!shallow) return yupObject.fields;
  const propertyPairs = toPairs(yupObject.fields);
  const excludedTypes = ['array', 'object'];
  return propertyPairs.filter(
    ([_, val]) => (!excludedTypes.includes(getType(val)))
  );
}

export function getInputType(yupObject) {
  const { meta } = yupObject.describe();
  return get(meta, 'inputType', '');
}

export function isRequired(yupObject) {
  const { tests } = yupObject;
  return !!find(tests, { TEST_NAME: 'required' });
}

export function mapPropertiesToInput(design) {
  return getProperties(design).map(
    ([propName, validator]) => ({
      key: propName,
      type: getInputType(validator),
      label: `${propName}${isRequired(validator) ? '*' : ''}`
    }));
}

export function reach() {
  return yup.reach.apply(null, [design, ...arguments]);
}

export function reachDeep(design, relativePath) {
  return yup.reach(design, relativePath);
}
