// @loader module?indent=2

module.exports = function({ _, test, description, name } = {}) {
  const pkg = {
    name,
    version: '0.0.1',
    dependencies: {},
    main: 'edam.js',
    description: description,
    author: _.git.name,
    scripts: {
      test: 'jest'
    },
    keywords: ['edam-template'],
    devDependencies: {
      edam: '^0.0.8',
      jest: '^22.4.3',
      co: '^4.6.0'
    },
    repository: _.git.name + '/' + name
  }

  if (!test) {
    delete pkg.devDependencies
    delete pkg.scripts.test
  }

  return pkg
}
