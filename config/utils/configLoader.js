'use strict';

const readConfig = require('./readConfig');

module.exports = function configLoader(name) {
  return function () {
    const isWebpack = !!arguments.length;
    if (!isWebpack) return readConfig(name);
    return {code: `module.exports = function() { return {}; };`};
  };
};
