const co = require('co')
const nps = require('path')
const fsExtra = require('fs-extra')
const execa = require('execa')
const prettierLoader = require('edam-prettier-loader')

const PRETTIER_CONFIG_PATH = nps.join(__dirname, 'template/.prettierrc.js')

try {
  execa.shellSync('command -v pnpm >/dev/null 2>&1')
} catch (e) {
  throw new Error('Run `npm i pnpm -g` firstly')
}

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
      name: 'test',
      type: 'confirm',
      message: 'Do you want to use test?',
      default: true
    },
    {
      name: 'testType',
      when: ({test}) => test,
      type: 'list',
      choices: ['jest', 'ava'],
      message: 'Which test framework?',
      default: 'jest'
    },
    {
      name: 'ci',
      type: 'confirm',
      when: ({test}) => test,
      message: 'Do you want to use ci (github workflow)?',
      default: true
    },
    {
      name: 'monorepo',
      type: 'confirm',
      message: 'Do you want to use lerna & pnpm (multi-packages)?',
      default: false
    }
  ],
  copy: {},
  hooks: {
    post: [
      co.wrap(function* (output) {
        const {
          _: {install},
          test,
          babel,
          // rollup,
          documentation,
          changelog,
          monorepo,
          testType,
          language
        } = yield this.variables.get()
      }),
      co.wrap(function* (output) {
        const {
          _: {install},
          test,
          babel,
          // rollup,
          documentation,
          changelog,
          monorepo,
          testType,
          language
        } = yield this.variables.get()

        let deps = []
        let pkgs = ['prettier', 'pretty-quick', 'husky@4']
        if (monorepo) {
          pkgs.push('lerna-cli')
          pkgs.push('lerna-command-toc')
          pkgs.push('edam-cli')
          pkgs.push('commander', 'concurrently', 'human-format', 'change-case')
        }
        if (babel) {
          pkgs = pkgs.concat([
            '@babel/cli',
            '@babel/preset-env',
            '@babel/plugin-proposal-class-properties',
          ])
        }

        if (babel || language === 'typescript') {
          pkgs.push('npm-run-all', 'rimraf')
        }

        if (test) {
          if (testType === 'jest') {
            pkgs.push('jest')
            pkgs.push('@types/jest')
            if (babel) {
              pkgs.push('babel-jest')
            }
            if (language === 'typescript') {
              pkgs.push('ts-jest')
            }
          } else {
            pkgs.push('ava')

            if (babel) {
              pkgs.push('@ava/babel')
            }
            if (language === 'typescript') {
              pkgs.push('ts-node')
              pkgs.push('@types/node')
            }
          }
        }

        if (language === 'typescript') {
          pkgs.push('typescript')
        }
        if (documentation) {
          pkgs.push('documentation')
        }
        if (changelog) {
          if (!monorepo) {
            pkgs.push('conventional-changelog-cli')
          }
          pkgs.push('@commitlint/cli')
          pkgs.push('@commitlint/config-conventional')
        }

        if (deps.length) {
          yield execa.shell(`pnpm add ${deps.join(' ')} -W`, {stdio: 'inherit', cwd: output});
          // yield install(deps, {cwd: output, dev: false})
        }
        if (pkgs.length) {
          yield execa.shell(`pnpm add ${pkgs.join(' ')} -D -W`, {stdio: 'inherit', cwd: output});
          // yield install(pkgs, {cwd: output, dev: true})
        }

        if (monorepo) {
          execa.shellSync('chmod +x scripts/*', {cwd: output})
        }
      })
    ]
  },

  move: ({test, babel, ci, language}) => {
    if (language === 'typescript') {
      return {
        'src/**.js': 'src/[name].ts',
        '__tests__/**.js': '__tests__/[name].ts',
        'lerna.json.js': 'lerna.json',
        'package.json.js': 'package.json',
        'babelrc.js': '.babelrc',
      }
    }
    return {
      'babelrc.js': '.babelrc',
      'lerna.json.js': 'lerna.json',
      'package.json.js': 'package.json',
    }
  },
  ignore: ({test, babel, rollup, ci, monorepo, language}) => {
    const ignores = []
    if (!test) {
      ignores.push('__tests__/**')
    }
    if (!ci) {
      ignores.push('.github/workflows/test.yml')
    }
    if (!babel && !rollup) {
      ignores.push('babelrc.js')
    }
    if (language !== 'typescript') {
      ignores.push('tsconfig.json')
    } else {
      ignores.push('src/index.d.ts')
    }
    if (!monorepo) {
      ignores.push('pnpm-workspace.yaml', 'lerna.json.js', 'packages/**', 'scripts/**')
    }
    else {
      ignores.push('src/**', '__tests__/**')
    }
    return ignores
  },
  variables: ({language, babel, testType}) => ({
    isTs: language === 'typescript',
    isJest: testType === 'jest',
  }),
  loaders: {
    prettier: prettierLoader
  },
  mappers: [
    {
      // test: /.+?\..+?$/,
      test: '**/*.{md,json,jsx?,tsx?}',
      loader: ['hbs', [prettierLoader, {filePath: PRETTIER_CONFIG_PATH}]]
    },
    {
      test: (filename) => {
        return !filename.includes("__template") && !filename.includes("workflows/test.yml");
      },
      mimeTest: "text/*",
      loader: ["hbs"],
    },
    {
      test: '*',
      mimeTest: '*',
      loader: []
    }
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
