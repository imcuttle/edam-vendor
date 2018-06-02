const co = require('co')

module.exports = {
  // root: './template' // by default
  prompts: [
    {
      name: 'name',
      type: 'input',
      deniesStore: true,
      message: "What's your package's name?",
      default: '${baseName}'
    },
    {
      name: 'description',
      type: 'input',
      message: "What's your package's description?",
      default: "your package's description"
    },
    {
      name: 'language',
      type: 'list',
      choices: ['javascript', 'typescript'],
      message: 'Which language do you wanted?',
      default: 'javascript'
    },

    {
      name: 'babel',
      type: 'confirm',
      message: 'Do you use babel?',
      default: true
    },
    {
      name: 'test',
      type: 'confirm',
      message: 'Do you want to use test (jest)?',
      default: true
    },
    {
      name: 'ci',
      type: 'confirm',
      when: ({ test }) => test,
      message: 'Do you want to use ci (travis)?',
      default: true
    }
  ],
  copy: {},
  hooks: {
    post: [
      co.wrap(function*(output) {
        const {
          _: { install },
          test,
          babel,
          language
        } = yield this.variables.get()

        let pkgs = []
        if (babel) {
          pkgs = pkgs.concat([
            'babel-cli',
            'babel-preset-env',
            'babel-plugin-add-module-exports',
            'babel-plugin-transform-class-properties',
            'babel-plugin-transform-object-rest-spread',
            'babel-plugin-transform-runtime'
          ])
        }
        if (test) {
          pkgs.push('jest')
          if (babel) {
            pkgs.push('babel-jest')
          }
          if (language === 'typescript') {
            pkgs.push('ts-jest')
          }
        }

        if (language === 'typescript') {
          pkgs.push('typescript')
        }

        yield install(pkgs, { cwd: output, dev: true })
      })
    ]
  },
  move: ({ test, babel, ci, language }) => {
    if (language === 'typescript') {
      return {
        'index.js': 'index.ts',
        'package.json.js': 'package.json',
        'babelrc.json': '.babelrc'
      }
    }
    return {
      'package.json.js': 'package.json',
      'babelrc.json': '.babelrc'
    }
  },
  ignore: ({ test, babel, ci, language }) => {
    const ignores = []
    if (!test) {
      ignores.push('__tests__/**')
    }
    if (!ci) {
      ignores.push('.travis.yml')
    }
    if (!babel) {
      ignores.push('babelrc.json')
    }
    if (language !== 'typescript') {
      ignores.push('tsconfig.json')
    }
    return ignores
  },
  variables: {},
  loaders: {},
  mappers: [],
  usefulHook: {
    gitInit: true,
    // installDependencies: true,
    // installDevDependencies: true
  }
}
