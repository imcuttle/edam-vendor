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
    'package.json.js': 'package.json'
  },
  variables: {
    DATE_TIME: function() {
      const date = new Date()
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    }
  },

  remove: ({ test, ci } = {}) => {
    if (!test) {
      return ['test/**', '.travis.yml']
    }
    if (!ci) {
      return ['.travis.yml']
    }
    return []
  },
  usefulHook: {
    installDependencies: true,
    installDevDependencies: true
  }
}
