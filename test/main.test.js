/**
 * @file main
 * @author <%=_.git.name%>
 * @date <%=DATE_TIME%>
 */

const { mockPrompts } = require('edam')
const constant = require('edam/dist/core/constant')
const { join } = require('path')
const co = require('co')

describe('main', function() {
  it(
    'should edam passed when test is true',
    co.wrap(function*() {
      const fp = yield mockPrompts(join(__dirname, '../'), {
        'test': true
      })

      expect(Object.keys(fp.tree)).toEqual(
        expect.arrayContaining(['package.json', 'edam.js', 'test/main.test.js', '.travis.yml'])
      )
    })
  )

  it(
    'should edam passed when test is false',
    co.wrap(function*() {
      const fp = yield mockPrompts(join(__dirname, '../'), {
        'test': false
      })

      expect(Object.keys(fp.tree)).not.toEqual(
        expect.arrayContaining(['test/main.test.js'])
      )
    })
  )

  it(
    'should edam passed when ci is false',
    co.wrap(function*() {
      const fp = yield mockPrompts(join(__dirname, '../'), {
        'test': true,
        ci: false
      })

      expect(Object.keys(fp.tree)).not.toEqual(
        expect.arrayContaining(['.travis.yml'])
      )
    })
  )
})
