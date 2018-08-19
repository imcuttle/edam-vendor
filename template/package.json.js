// @loader module?indent=2

module.exports = function({ _, test, changelog, documentation, description, babel, language, name } = {}) {
  const pkg = {
    name,
    version: '1.0.0',
    main: 'index.js',
    description: description,
    author: _.git.name,
    scripts: {
      test: 'jest',
      prepublishOnly: 'npm test',
      precommit: 'pretty-quick --staged'
    },
    keywords: [name],
    license: 'MIT',
    repository: _.git.name + '/' + name
  }

  if (!test) {
    delete pkg.scripts.test
  } else {
    if (language === 'typescript') {
      pkg.jest = {
        transform: {
          '^.+\\.tsx?$': 'ts-jest'
        },
        moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
      }
    }
    pkg.jest = pkg.jest || {}
    pkg.jest.testMatch = ['**/__test{s,}__/*.(spec|test).{t,j}s{x,}']
    if (babel) {
      pkg.scripts.build = 'rimraf lib && babel src/ -Dd lib'
      pkg.scripts.dev = 'npm run build -- -w'

      pkg.jest.transform = pkg.jest.transform || {}
      pkg.jest.transform['^.+\\.jsx?$'] = 'babel-jest'
    }
    if (documentation) {
      pkg.scripts.doc = 'documentation --github --markdown-toc=false readme index.js -a public -s "API"'
      pkg.scripts.prepublishOnly = 'npm test && npm run doc'
    }
  }

  if (changelog) {
    pkg.scripts.version = 'npm run changelog'
    pkg.scripts.commitmsg = 'commitlint -e $GIT_PARAMS'
    pkg.scripts.changelog = 'conventional-changelog -p angular -i CHANGELOG.md -s -r 0 && git add CHANGELOG.md'
    pkg.commitlint = {
      extends: ['@commitlint/config-conventional']
    }
  }

  return pkg
}
