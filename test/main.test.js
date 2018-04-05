/**
 * @file main
 * @author imcuttle
 * @date 2018/4/4
 */
const { mockPrompts } = require('edam')
const { join } = require('path')
const fs = require('fs')
const co = require('co')

describe('main', function() {
  it(
    'should edam passed',
    co.wrap(function*() {
      const fp = yield mockPrompts(join(__dirname, '../'), {
        test: true,
        ci: true,
        babel: true,
        language: 'typescript'
      })

      expect(Object.keys(fp.tree)).toEqual(
        expect.arrayContaining([
          'package.json',
          '.travis.yml',
          'index.js',
          'test/main.test.js',
          '.babelrc',
          'tsconfig.json'
        ])
      )
    })
  )

  it(
    'should edam passed when `babel` false',
    co.wrap(function*() {
      const fp = yield mockPrompts(join(__dirname, '../'), {
        test: true,
        ci: true,
        babel: false,
        language: 'typescript'
      })

      expect(Object.keys(fp.tree)).toEqual(
        expect.arrayContaining([
          'package.json',
          'index.js',
          'test/main.test.js',
          'tsconfig.json'
        ])
      )

      expect(Object.keys(fp.tree).includes('.babelrc')).toBeFalsy()
    })
  )

  it(
    'should edam passed when `test` false',
    co.wrap(function*() {
      const fp = yield mockPrompts(join(__dirname, '../'), {
        test: false,
        ci: false,
        babel: true,
        language: 'typescript'
      })

      expect(Object.keys(fp.tree)).toEqual(
        expect.arrayContaining([
          'package.json',
          'index.js',
          '.babelrc',
          'tsconfig.json'
        ])
      )

      expect(Object.keys(fp.tree).includes('.travis.yml')).toBeFalsy()
      expect(Object.keys(fp.tree).includes('test/main.test.js')).toBeFalsy()
    })
  )

  it('should post', co.wrap(function *() {
    jest.setTimeout(60000)
    const fp = yield mockPrompts(join(__dirname, '../'), {
      test: false,
      ci: false,
      babel: true,
      language: 'typescript'
    })

    const output = join(__dirname, 'output')
    yield fp.writeToFile(output, { clean: true, overwrite: true })
    const { devDependencies } = JSON.parse(fs.readFileSync(join(output, 'package.json')).toString())
    expect(Object.keys(devDependencies)).toEqual(
      expect.arrayContaining([
        'typescript',
        'babel-cli',
        'babel-preset-env',
        'babel-plugin-add-module-exports',
        'babel-plugin-transform-class-properties',
        'babel-plugin-transform-object-rest-spread',
        'babel-plugin-transform-runtime'
      ])
    )

    expect(Object.keys(devDependencies)).not.toEqual(
      expect.arrayContaining([
        'jest',
        'babel-jest',
        'ts-jest'
      ])
    )
  }))
})
