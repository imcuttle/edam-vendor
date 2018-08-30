/**
 * @file main
 * @author imcuttle
 * @date 2018/4/4
 */
process.env.DEBUG = 'edam:*'

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
          'index.ts',
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
        documentation: true,
        language: 'typescript'
      })

      console.error(fp.tree['package.json'])
      expect(Object.keys(fp.tree)).toEqual(
        expect.arrayContaining([
          'package.json',
          'index.ts',
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
        name: 'abv',
        language: 'typescript'
      })

      expect(Object.keys(fp.tree)).toEqual(
        expect.arrayContaining([
          'package.json',
          'index.ts',
          '.babelrc',
          'tsconfig.json'
        ])
      )

      expect(Object.keys(fp.tree).includes('.travis.yml')).toBeFalsy()
      expect(Object.keys(fp.tree).includes('test/main.test.js')).toBeFalsy()
    })
  )

  it(
    'should post',
    co.wrap(function*() {
      jest.setTimeout(60000)
      const fp = yield mockPrompts(join(__dirname, '../'), {
        test: false,
        ci: true,
        babel: true,
        name: 'abv',
        language: 'typescript',
        lerna: false
      })

      const output = join(__dirname, 'output')
      yield fp.writeToFile(output, { clean: false, overwrite: true })
      const { devDependencies } = JSON.parse(
        fs.readFileSync(join(output, 'package.json')).toString()
      )

      expect(fs.readFileSync(join(output, 'README.md')).toString()).toEqual(
        expect.stringContaining('# abv\n')
      )

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
        expect.arrayContaining(['jest', 'babel-jest', 'ts-jest'])
      )
    })
  )

  it(
    'should post learn',
    co.wrap(function*() {
      jest.setTimeout(600000)

      const fp = yield mockPrompts(join(__dirname, '../'), {
        test: true,
        ci: true,
        babel: true,
        name: 'abv',
        language: 'typescript',
        lerna: true
      })

      const output = join(__dirname, 'output')
      yield fp.writeToFile(output, { clean: true, overwrite: true })
      const { devDependencies } = JSON.parse(
        fs.readFileSync(join(output, 'package.json')).toString()
      )

      expect(Object.keys(devDependencies)).toEqual(
        expect.arrayContaining(['lerna'])
      )
    })
  )
})
