const co = require('co')

module.exports = {
  // root: './template' // by default

  prompts: [
    {
      name: 'name',
      type: 'input',
      message: 'Please input your template name:\n',
      default: 'edam-template'
    },
    {
      name: 'description',
      type: 'input',
      message: 'Please input your template description:\n',
      default: ''
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
      message: 'Do you want to use ci for test (travis)?',
      default: true
    }
  ],
  move: {
    'package.json.js': 'package.json',
    'gitignore': '.gitignore'
  },
  variables: {
    DATE_TIME: function() {
      const date = new Date()
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    }
  },

  hooks: {
    post: co.wrap(function*(output) {
      const {
        _: { install },
        test
      } = yield this.variables.get()

      if (test) {
        let pkgs = [
          'edam', 'jest', 'co', '@types/jest'
        ]
        yield install(pkgs, { cwd: output, dev: true })
      }
    })
  },

  ignore: ({ test, ci } = {}) => {
    if (!test) {
      return ['test/**', '.travis.yml']
    }
    if (!ci) {
      return ['.travis.yml']
    }
    return []
  },
  usefulHook: {
    installDependencies: false,
    installDevDependencies: false
  }
}
