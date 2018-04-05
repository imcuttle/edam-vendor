// @loader module?indent=2

module.exports = function({
  _,
  test,
  description,
  babel,
  language,
  name
} = {}) {
  const pkg = {
    name,
    version: '0.0.1',
    main: 'index.js',
    description: description,
    author: _.git.name,
    scripts: {
      test: 'jest'
    },
    keywords: [name],
    repository: _.git.name + '/' + name
  }

  if (!test) {
    delete pkg.scripts.test
  }

  if (language === 'typescript') {
    pkg.jest = {
      transform: {
        '^.+\\.tsx?$': 'ts-jest'
      },
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
    }
  }
  if (babel) {
    pkg.jest = pkg.jest || {}
    pkg.jest.transform = pkg.jest.transform || {}
    pkg.jest.transform['^.+\\.jsx?$'] = 'babel-jest'
  }

  return pkg
}
