// @loader module?indent=2

module.exports = function({ _, test, description, name } = {}) {
  const pkg = {
    name,
    version: '1.0.0',
    dependencies: {},
    'edam:main': 'edam.js',
    description: description,
    author: _.git.name,
    scripts: {
      test: 'jest'
    },
    keywords: ['edam-template'],
    repository: _.git.name + '/' + name
  }

  if (!test) {
    delete pkg.scripts.test
  }

  return pkg
}
