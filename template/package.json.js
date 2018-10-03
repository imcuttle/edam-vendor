// @loader module?indent=2

module.exports = function({ _, test, lerna, changelog, documentation, description, babel, language, name } = {}) {
  const pkg = {
    name,
    version: '1.0.0',
    main: 'index.js',
    description: description,
    author: `${_.git.name} <${_.git.email}>`,
    scripts: {
      test: 'jest',
      prepublishOnly: 'npm test'
    },
    husky: {
      hooks: {
        ['pre-commit']: 'pretty-quick --staged'
      }
    },
    sideEffects: false,
    engines: {
      node: '>=6'
    },
    files: ['lib', 'src'],
    keywords: [_.git.name, name],
    typings: language === 'typescript' ? 'lib/index.d.ts' : 'index.d.ts',
    license: 'MIT',
    repository: _.git.name + '/' + name
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
      bootstrap: 'lerna bootstrap',
      prerelease: 'npm test',
      release: "lerna publish --conventional-commits -m 'chore(release): publish %s'"
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
    pkg.scripts.build = 'rimraf lib && tsc'
    pkg.scripts.dev = 'npm run build -- -w'
  }

  if (babel) {
    pkg.scripts.build = 'rimraf lib && babel src/ -Dd lib'
    pkg.scripts.dev = 'npm run build -- -w'
  }

  if (documentation) {
    pkg.scripts.doc =
      'documentation --github --markdown-toc=false readme index.js -a public -s "API" && git commit -am "chore: update readme"'
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
