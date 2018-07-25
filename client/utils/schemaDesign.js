const yup = require('yup');
const get = require('lodash/get');
const toPairs = require('lodash/toPairs');
const { schemaDesign: design } = require('shared/schema-validation');

export default design;

export function getType(yupObject) {
  return get(yupObject.describe(), 'type');
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

export const reach = yup.reach;
