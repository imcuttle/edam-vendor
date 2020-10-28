/**
 * @file main
 * @author imcuttle
 * @date 2018/4/4
 */
{{#if isTs}}
import {{camelCase name}} from '../src'
{{else}}
const {{camelCase name}} = require('../src')
{{/if}}

{{#if isJest}}
describe('{{camelCase name}}', function() {
  it(
    'should spec',
    function () {
    }
  )
})
{{else}}
{{#if isTs}}
import test from 'ava'
{{else}}
const test = require('ava')
{{/if}}

test('spec', (t) => {
})
{{/if}}
