// @loader module?indent=2

module.exports = ({ test, babel, language, documentation }) => {
  const config = {
    packages: ['packages/*'],
    version: '0.0.0',
    command: {
      publish: {
        conventionalCommits: true,
        message: 'chore(release): publish %s'
      },
      bootstrap: {
        hoist: false,
        npmClientArgs: []
      }
    },
    ignoreChanges: ['**/__fixtures__/**', '**/__tests__/**']
  }

  const appendHoist = name => {
    config.command.bootstrap.hoist = config.command.bootstrap.hoist || []
    config.command.bootstrap.hoist.push(name)
  }

  if (test) {
    appendHoist('jest')
  }
  if (babel) {
    appendHoist('babel-cli')
  }
  if (language === 'typescript') {
    appendHoist('typescript')
  }
  if (documentation) {
    appendHoist('documentation')
  }

  return config
}
