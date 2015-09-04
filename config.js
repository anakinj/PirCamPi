'use strict';
function getConfig() {
  return require(__dirname + '/config.json') || {};
}

module.exports = getConfig();
