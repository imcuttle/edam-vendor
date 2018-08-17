// @loader module?indent=2

module.exports = function({ _, test, description, babel, language, name } = {}) {
  const pkg = {
    name,
    version: '1.0.0',
    main: 'index.js',
    description: description,
    author: _.git.name,
    scripts: {
      test: 'jest',
      prepublishOnly: 'npm test'
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
  }

  return pkg
}
