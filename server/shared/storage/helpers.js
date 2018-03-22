const isString = require('lodash/isString');
const isUrl = require('is-url');
const parseUrl = require('url').parse;
const Promise = require('bluebird');
const storage = require('./storage.service');
const values = require('lodash/values');

const PRIMITIVES = ['HTML', 'TABLE-CELL', 'IMAGE', 'BRIGHTCOVE_VIDEO', 'VIDEO', 'EMBED'];
const isPrimitive = asset => PRIMITIVES.indexOf(asset.type) > -1;

function processStatics(item) {
  return item.type === 'ASSESSMENT'
    ? processAssessment(item)
    : processAsset(item);
}

function processAsset(asset) {
  return isPrimitive(asset) ? processPrimitive(asset) : processComposite(asset);
}

function processAssessment(assessment) {
  let question = assessment.data.question;
  if (!question || question.length < 1) return Promise.resolve(assessment);
  return Promise.each(question, it => processAsset(it));
}

function processPrimitive(primitive) {
  if (!isPrimitive(primitive)) throw new Error('Invalid primitive');
  if (!processor[primitive.type]) return Promise.resolve(primitive);
  return processor[primitive.type](primitive);
}

function processComposite(composite) {
  if (!composite.data.embeds) Promise.resolve(composite);
  return Promise.each(values(composite.data.embeds), it => processPrimitive(it))
    .then(() => composite);
}

let processor = {};

processor.IMAGE = asset => {
  const image = asset.data.url;
  const base64Pattern = /^data:image\/(\w+);base64,/;

  if (!isString(image) || (!isUrl(image) && !image.match(base64Pattern))) {
    return Promise.resolve(asset);
  }

  if (isUrl(image)) {
    const url = parseUrl(image);
    asset.data.url = url.pathname.substr(1, image.length);
    return Promise.resolve(asset);
  }

  const file = Buffer.from(image.replace(base64Pattern, ''), 'base64');
  return storage.saveItem(asset.id, file)
    .then(key => key && (asset.data.url = key))
    .then(() => asset);
};

function resolveStatics(item) {
  return item.type === 'ASSESSMENT'
    ? resolveAssessment(item)
    : resolveAsset(item);
}

function resolveAssessment(assessment) {
  let question = assessment.data.question;
  if (!question || question.length < 1) return Promise.resolve(assessment);
  return Promise.each(question, it => resolveAsset(it)).then(() => assessment);
}

function resolveAsset(element) {
  return isPrimitive(element)
    ? resolvePrimitive(element)
    : resolveComposite(element);
}

function resolvePrimitive(primitive) {
  if (!resolver[primitive.type]) return Promise.resolve(primitive);
  return resolver[primitive.type](primitive);
}

function resolveComposite(composite) {
  return Promise.each(values(composite.data.embeds), resolvePrimitive)
    .then(() => composite);
}

let resolver = {};

resolver.IMAGE = asset => {
  if (!asset.data || !asset.data.url) return Promise.resolve(asset);

  return storage.getItemUrl(asset.data.url)
    .then(url => url && (asset.data.url = url))
    .then(() => asset);
};

module.exports = {
  processStatics,
  resolveStatics
};
