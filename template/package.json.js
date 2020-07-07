// @loader module?indent=2

module.exports = function ({
     _,
     test,
     lerna,
     changelog,
     documentation,
     description,
     babel,
     language,
     name
   } = {}) {
  const pkg = {
    name,
    version: '1.0.0',
    description: description,
    author: `${_.git.name} <${_.git.email}>`,
    scripts: {
      test: 'npx jest',
      preversion: 'npm test'
    },
    husky: {
      hooks: {
        ['pre-commit']: 'pretty-quick --staged'
      }
    },
    sideEffects: false,
    engines: {
      node: '>=8'
    },
    keywords: [_.git.name].concat(name.split('-')).concat(name),
    main: (babel || language === 'typescript') ? 'lib' : 'src',
    types: language === 'typescript' ? 'types' : 'src/index.d.ts',
    license: 'MIT',
    repository: _.git.name + '/' + name
  }

  if (babel || language === 'typescript') {
    pkg.module = 'es'
  }


  function appendCmd(path, cmd) {
    const old = _.get(pkg, path)
    let newCmd = cmd
    if (old) {
      newCmd = old + ' && ' + cmd
    }
    _.set(pkg, path, newCmd)
  }

  if (lerna) {
    Object.assign(pkg.scripts, {
      bootstrap: 'npx lerna bootstrap',
      release: "npx lerna publish --conventional-commits -m 'chore(release): publish'"
    })
  }

  if (!test) {
    delete pkg.scripts.test
  } else {
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
  }

  if (language === 'typescript') {
    pkg.scripts.build = 'npm run clean && run-p --print-label "build:**"'
    pkg.scripts['build:es'] = 'tsc --outDir es --module ES6'
    pkg.scripts['build:cjs'] = 'tsc --outDir lib'
    pkg.scripts.clean = 'rimraf types es lib'
    pkg.scripts.prepare = 'npm run build'
  }
  else if (babel) {
    // if (test) {
    //   pkg.scripts['test-ci'] = 'npm run clean && npm test'
    // }
    pkg.scripts.prepare = 'npm run build'
    pkg.scripts.clean = 'rimraf es lib'
    pkg.scripts.build = 'npm run clean && run-p --print-label "build:**"'
    pkg.scripts['build:es'] = 'BABEL_ENV=es babel src --out-dir es'
    pkg.scripts['build:cjs'] = 'babel src --out-dir lib'
  }

  if (documentation) {
    pkg.scripts.doc =
      'documentation --github --markdown-toc=false readme index.js -a public -s "API" && git add README.md'
    appendCmd('scripts.version', 'npm run doc')
  }

  if (changelog) {
    appendCmd('scripts.version', 'npm run changelog')
    pkg.husky.hooks['commit-msg'] = 'commitlint -e $HUSKY_GIT_PARAMS'
    pkg.scripts.changelog = 'conventional-changelog -p angular -i CHANGELOG.md -s -r 0 && git add CHANGELOG.md'
    pkg.commitlint = {
      extends: ['@commitlint/config-conventional']
    }
  }

  return pkg
}
