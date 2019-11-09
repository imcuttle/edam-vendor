const co = require('co')
const nps = require('path')
const execa = require('execa')
const prettierLoader = require('edam-prettier-loader')

const PRETTIER_CONFIG_PATH = nps.join(__dirname, 'template/.prettierrc.js')

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
      name: 'documentation',
      type: 'confirm',
      message: 'Do you use documentation(jsdoc generator)?',
      default: false
    },
    {
      name: 'changelog',
      type: 'confirm',
      message: 'Do you use changelog auto-generator(commit-lint)?',
      default: true
    },
    {
      name: 'babel',
      type: 'confirm',
      message: 'Do you use babel?',
      default: true
    },
    {
      name: 'rollup',
      type: 'confirm',
      message: 'Do you use rollup?',
      default: false
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
    },
    {
      name: 'lerna',
      type: 'confirm',
      message: 'Do you want to use lerna (multi-packages)?',
      default: false
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
          rollup,
          documentation,
          changelog,
          lerna,
          language
        } = yield this.variables.get()

        let deps = []
        let pkgs = ['prettier', 'pretty-quick', 'husky']
        if (lerna) {
          pkgs.push('lerna')
        }
        if (rollup) {
          pkgs = pkgs.concat([
            babel && 'rollup-plugin-babel@3',
            'rollup'
          ]).filter(Boolean)
        }
        if (babel) {
          pkgs = pkgs.concat([
            'babel-cli',
            'babel-preset-env',
            'babel-plugin-transform-class-properties',
            'babel-plugin-transform-object-rest-spread',
          ])
        }
        if (rollup && !babel) {
          pkgs = pkgs.concat([
            'rimraf',
            'babel-plugin-transform-es2015-modules-commonjs',
          ])
        }

        if (rollup || babel) {
          pkgs = pkgs.concat(['rimraf'])
        }

        if (test) {
          pkgs.push('jest')
          pkgs.push('@types/jest')
          if (babel) {
            pkgs.push('babel-jest')
          }
          if (language === 'typescript') {
            pkgs.push('ts-jest')
          }
        }

        if (language === 'typescript') {
          pkgs.push('typescript')
          pkgs.push('rimraf')
        }
        if (documentation) {
          pkgs.push('documentation')
        }
        if (changelog) {
          pkgs.push('conventional-changelog-cli')
          pkgs.push('@commitlint/cli')
          pkgs.push('@commitlint/config-conventional')
        }

        if (deps.length) {
          yield install(deps, { cwd: output, dev: false })
        }
        yield install(pkgs, { cwd: output, dev: true })

        if (lerna) {
          execa.shellSync('$(npm bin)/lerna init', { cwd: output })
        }
      })
    ]
  },
  move: ({ test, babel, ci, language }) => {
    if (language === 'typescript') {
      return {
        'lerna.json.js': 'lerna.json',
        'index.js': 'index.ts',
        'package.json.js': 'package.json',
        'babelrc.js': '.babelrc'
      }
    }
    return {
      'lerna.json.js': 'lerna.json',
      'package.json.js': 'package.json',
      'babelrc.js': '.babelrc'
    }
  },
  ignore: ({ test, babel, rollup, ci, lerna, language }) => {
    const ignores = []
    if (!test) {
      ignores.push('__tests__/**')
    }
    if (!rollup) {
      ignores.push('rollup.config.js')
    }
    if (!ci) {
      ignores.push('.travis.yml')
    }
    if (!babel && !rollup) {
      ignores.push('babelrc.js')
    }
    if (language !== 'typescript') {
      ignores.push('tsconfig.json')
    } else {
      ignores.push('index.d.ts')
    }
    if (!lerna) {
      ignores.push('lerna.json.js')
    }
    return ignores
  },
  variables: ({ language }) => ({
    isTs: language === 'typescript'
  }),
  loaders: {
    prettier: prettierLoader
  },
  mappers: [
    {
      // test: /.+?\..+?$/,
      test: '**/*.{md,json,jsx?,tsx?}',
      loader: ['hbs', [prettierLoader, { filePath: PRETTIER_CONFIG_PATH }]]
    }
    // {
    //   test: '**/*.json',
    //   loader: [
    //     'hbs',
    //     [prettierLoader, { filePath: PRETTIER_CONFIG_PATH, parser: 'json' }]
    //   ]
    // },
    // {
    //   test: '**/*.md',
    //   loader: [
    //     'hbs',
    //     [prettierLoader, { filePath: PRETTIER_CONFIG_PATH, parser: 'markdown' }]
    //   ]
    // },
    // {
    //   test: '**/*.tsx?',
    //   loader: [
    //     'hbs',
    //     [
    //       prettierLoader,
    //       { filePath: PRETTIER_CONFIG_PATH, parser: 'typescript' }
    //     ]
    //   ]
    // }
  ],
  usefulHook: {
    gitInit: true
    // installDependencies: true,
    // installDevDependencies: true
  }
}
