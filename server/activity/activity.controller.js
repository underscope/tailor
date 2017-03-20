'use strict';

const { Activity } = require('../shared/database');
const { createError } = require('../shared/error/helpers');
const { NOT_FOUND } = require('http-status-codes');
const pick = require('lodash/pick');
const { syncOptions } = require('../../config/server').queryParams;

function create({ body, params, user }, res) {
  const attrs = ['name', 'type', 'parentId', 'position'];
  const data = Object.assign(pick(body, attrs), { courseId: params.courseId });
  const opts = { context: { userId: user.id } };
  return Activity
    .create(data, opts)
    .then(activity => res.json({ data: activity }));
}

function show({ params }, res) {
  return Activity
    .findById(params.activityId)
    .then(activity => activity || createError(NOT_FOUND, 'Activity not found'))
    .then(activity => res.json({ data: activity }));
}

function patch({ body, params, user }, res) {
  return Activity
    .findById(params.activityId)
    .then(activity => activity || createError(NOT_FOUND, 'Activity not found'))
    .then(activity => activity.update(body, { context: { userId: user.id } }))
    .then(activity => res.json({ data: activity }));
}

function list({ course, query }, res) {
  const params = query.integration ? syncOptions(query) : { order: 'position ASC' };
  return course.getActivities(params)
    .then(activities => res.json({ data: activities }));
}

function remove({ params, user }, res) {
  return Activity
    .findById(params.activityId)
    .then(activity => activity.destroy({ context: { userId: user.id } }))
    .then(activity => res.json({ data: pick(activity, ['id']) }));
}

function reorder({ body, params }, res) {
  return Activity
    .findById(params.activityId)
    .then(activity => activity.reorder(body.position))
    .then(activity => res.json({ data: activity }));
}

module.exports = {
  create,
  show,
  list,
  patch,
  remove,
  reorder
};
