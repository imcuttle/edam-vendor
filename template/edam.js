
module.exports = {
  // root: './template' // by default
  prompts: [
    {
      name: 'test',
      type: 'confirm',
      message: 'Do you want to use test (jest)?',
      default: true
    }
  ],
  move: {
    'package.json.js': 'package.json'
  },
  copy: {},
  remove: [],
  hooks: {
    'post': []
  },
  ignore: [],
  variables: {},
  loaders: {},
  mappers: [
    // {
    //   use: '',
    //   loader: ''
    // }
  ],
  usefulHook: {
    gitInit: true,
    installDependencies: true,
    installDevDependencies: true
  }
}