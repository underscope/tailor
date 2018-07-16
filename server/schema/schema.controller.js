'use strict';

const { SCHEMAS } = require('../../config/shared/activities');

function index(_, res) {
  return res.json(SCHEMAS);
}

module.exports = {
  index
};
