/**
 * @file helper
 */

const nps = require('path')

function fixture() {
  return nps.join.apply(nps, [__dirname, 'fixture'].concat(arguments))
}

module.exports = {
  fixture
}
