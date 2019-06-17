'use strict';

const { renderHtml, renderText } = require('./render');
const { origin, mail: config } = require('../../../config/server');
const email = require('emailjs');
const fecha = require('fecha');
const logger = require('../logger');
const path = require('path');
const pick = require('lodash/pick');
const { promisify } = require('util');
const urlJoin = require('url-join');
const { URL } = require('url');
const wrap = require('word-wrap');

const from = `${config.sender.name} <${config.sender.address}>`;
const server = email.server.connect(config);
logger.debug(getConfig(server), '📧  SMTP client created');

const templatesDir = path.join(__dirname, './templates/');
const resetUrl = user => urlJoin(origin, '/#/reset-password/', user.token);
const send = promisify(server.send.bind(server));

function invite(user) {
  const href = resetUrl(user);
  const { hostname } = new URL(href);
  const recipient = user.email;
  const data = { href, origin, hostname, recipient, wrap: () => wrapText };
  const html = renderHtml(path.join(templatesDir, 'welcome.mjml'), data);
  const text = renderText(path.join(templatesDir, 'welcome.txt'), data);
  logger.debug({ recipient, sender: from }, '📧  Sending invite email to:', recipient);
  return send({
    from,
    to: recipient,
    subject: 'Invite',
    text,
    attachment: [{ data: html, alternative: true }]
  });
}

function resetPassword(user) {
  const href = resetUrl(user);
  const recipient = user.email;
  const data = { href, recipient, wrap: () => wrapText };
  const html = renderHtml(path.join(templatesDir, 'reset.mjml'), data);
  const text = renderText(path.join(templatesDir, 'reset.txt'), data);
  logger.debug({ recipient, sender: from }, '📧  Sending reset password email to:', recipient);
  return send({
    from,
    to: recipient,
    subject: 'Reset password',
    text,
    attachment: [{ data: html, alternative: true }]
  });
}

function getConfig(server) {
  // NOTE: List public keys: https://git.io/fxV4j
  return pick(server.smtp, [
    'host', 'port', 'domain',
    'authentication', 'ssl', 'tls',
    'timeout'
  ]);
}

function commentsList({ email, comments, since }) {
  const recipient = email;
  const data = { comments, recipient, since, format: () => format, wrap: () => wrapText };
  const html = renderHtml(path.join(templatesDir, 'comments.mjml'), data);
  const text = renderText(path.join(templatesDir, 'comments.txt'), data);
  logger.debug({ recipient, sender: from }, '📧  Sending comments email to:', recipient);
  return send({
    from,
    to: recipient,
    subject: 'Comments list',
    text,
    attachment: [{ data: html, alternative: true }]
  });
}

function format(date, render) {
  return fecha.format(new Date(render(date)), 'M/D/YY HH:mm');
}

function wrapText(content, render) {
  return wrap(render(content), { width: 50 });
}

module.exports = {
  invite,
  resetPassword,
  commentsList
};
