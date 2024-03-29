// @loader module?indent=2

module.exports = function ({
  _,
  test,
                             monorepo,
  changelog,
  documentation,
  description,
  babel,
  language,
  testType,
  name
} = {}) {
  const pkg = {
    name,
    version: '1.0.0',
    description: description,
    author: `${_.git.name} <${_.git.email}>`,
    scripts: {
      preinstall: 'npx only-allow pnpm',
      test: testType === 'jest' ? 'npx jest' : 'npx ava',
      'test:watch': 'npm test -- --watch',
      preversion: 'npm test',
      postpublish: 'git push --tag origin $(git rev-parse --abbrev-ref HEAD)'
    },
    husky: {
      hooks: {
        ['pre-commit']: monorepo ? 'npx lerna toc && git add README.md && pretty-quick --staged' : 'pretty-quick --staged'
      }
    },
    sideEffects: false,
    engines: {
      node: '>=10'
    },
    files: ['es', 'types', 'lib'],
    keywords: [_.git.name].concat(name.split('-')).concat(name),
    main: babel || language === 'typescript' ? 'lib' : 'src',
    types: language === 'typescript' ? 'types' : 'src/index.d.ts',
    license: 'MIT',
    repository: _.git.name + '/' + name
  }

  if (babel || language === 'typescript') {
    pkg.module = 'es'
  }
  if (!babel && language !== 'typescript') {
    delete pkg.files
  }

  function appendCmd(path, cmd) {
    const old = _.get(pkg, path)
    let newCmd = cmd
    if (old) {
      newCmd = old + ' && ' + cmd
    }
    _.set(pkg, path, newCmd)
  }

  if (monorepo) {
    Object.assign(pkg.scripts, {
      new: 'npx edam',
      release: "npx lerna publish"
    })
    pkg.edam = {
      source: 'pkg',
      alias: {
        pkg: {
          url: './packages/__template',
          type: 'file',
          config: {
            output: './packages/'
          }
        }
      }
    }
  }

  if (!test) {
    delete pkg.scripts.test
  } else {
    if (testType === 'jest') {
      if (language === 'typescript') {
        pkg.jest = {
          transform: {
            '^.+\\.tsx?$': 'ts-jest',
            '^.+\\.jsx?$': 'babel-jest'
          },
          moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
        }
      }
      pkg.jest = pkg.jest || {}
      pkg.jest.testMatch = ['**/__test{s,}__/*.(spec|test).{t,j}s{x,}']
      if (babel) {
        pkg.jest.transform = pkg.jest.transform || {}
        pkg.jest.transform['^.+\\.jsx?$'] = 'babel-jest'
      }
    } else {
      pkg.ava = {}
      if (language === 'typescript') {
        pkg.ava.files = ['__tests__/**/*.test.ts{,x}']
        Object.assign(pkg.ava, {
          extensions: ['ts', 'tsx'],
          require: ['ts-node/register']
        })
      } else {
        pkg.ava.files = ['__tests__/**/*.test.js{,x}']
      }
      if (babel) {
        Object.assign(pkg.ava, {
          babel: {
            extensions: ['js', 'jsx', 'ts', 'tsx']
          }
        })
      }
    }
  }

  if (monorepo) {
    pkg.packagePrefix = `@${name}/`
  }

  if (language === 'typescript' && !monorepo) {
    pkg.scripts.build = 'npm run clean && run-p --print-label "build:**"'
    pkg.scripts.dev = 'TSC_OPTIONS="--watch" npm run build'
    pkg.scripts['build:es'] = 'tsc $TSC_OPTIONS --outDir es --module es6 --sourceMap false'
    pkg.scripts['build:cjs'] = 'tsc $TSC_OPTIONS --outDir lib --sourceMap false'
    pkg.scripts['build:tds'] = 'tsc $TSC_OPTIONS --emitDeclarationOnly -d'
    pkg.scripts.clean = 'rimraf types es lib'
    pkg.scripts.prepare = 'npm run build'
  } else if (babel && !monorepo) {
    // if (test) {
    //   pkg.scripts['test-ci'] = 'npm run clean && npm test'
    // }
    pkg.scripts.prepare = 'npm run build'
    pkg.scripts.clean = 'rimraf es lib'
    pkg.scripts.dev = 'BABEL_CLI_OPTIONS="--watch" npm run build'
    pkg.scripts.build = 'npm run clean && run-p --print-label "build:**"'
    pkg.scripts['build:es'] = 'BABEL_ENV=es babel $BABEL_CLI_OPTIONS src --out-dir es'
    pkg.scripts['build:cjs'] = 'babel $BABEL_CLI_OPTIONS src --out-dir lib'
  }

  if (documentation) {
    pkg.scripts.doc =
      'documentation --github --markdown-toc=false readme index.js -a public -s "API" && git add README.md'
    appendCmd('scripts.version', 'npm run doc')
  }

  if (changelog) {
    if (!monorepo) {
      appendCmd('scripts.version', 'npm run changelog')
      // conventional-changelog-conventionalcommits
      pkg.scripts.changelog = 'conventional-changelog -p conventionalcommits -i CHANGELOG.md -s -r 0 && git add CHANGELOG.md'
    }
    pkg.husky.hooks['commit-msg'] = 'commitlint -e $HUSKY_GIT_PARAMS'
    pkg.commitlint = {
      extends: ['@commitlint/config-conventional']
    }
  }

  return pkg
}
