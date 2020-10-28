/**
 * @file helper
 */

{{#if isTs}}
import * as nps from 'path'

function fixture(...argv: string[]) {
  return nps.join.apply(nps, [__dirname, 'fixture'].concat(argv))
}

export {
  fixture
}
{{else}}
const nps = require('path')

function fixture(...argv) {
  return nps.join.apply(nps, [__dirname, 'fixture'].concat(argv))
}

module.exports = {
  fixture
}
{{/if}}


