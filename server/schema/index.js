'use strict';

const ctrl = require('./schema.controller');
const router = require('express-promise-router')();

router.get('/schemas', ctrl.index);

module.exports = {
  controller: ctrl,
  router
};
