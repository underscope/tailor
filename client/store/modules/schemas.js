import schemaApi from '../../api/schema';
import isEmpty from 'lodash/isEmpty';
import VuexCollection from '../helpers/collection.js';
import * as config from 'shared/activities';

const { state, build, getter, action, mutation } = new VuexCollection('schemas');

state({
  schemas: []
});

getter(function getSchemas() {
  return this.state.schemas;
});

wrapConfigMethods();

action(function fetch() {
  return new Promise(resolve => {
    if (!isEmpty(this.state.schemas)) resolve();
    return schemaApi.getSchemas()
      .then(schemas => {
        this.commit('setSchemas', schemas);
        resolve();
      });
  });
});

mutation(function setSchemas(schemas) {
  config.loadRemoteSchemas(schemas);
  this.state.schemas = schemas;
});

export default build();

function wrapConfigMethods() {
  const excludedMethods = [
    'loadRemoteSchemas'
  ];
  Object.values(config)
    .forEach(value => {
      if (typeof value !== 'function') return;
      if (excludedMethods.includes(value.name)) return;
      function wrapedMethod() { return value; }
      Object.defineProperty(wrapedMethod, 'name', { value: value.name });
      getter(wrapedMethod);
    });
}
