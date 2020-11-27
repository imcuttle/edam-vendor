// @loader module?indent=2

module.exports = ({ test, babel, language, documentation }) => {
  const config = {
    packages: ['packages/*'],
    version: '0.0.0',
    extendCommands: [
      'lerna-command-toc'
    ],
    command: {
      publish: {
        conventionalCommits: true,
        message: 'chore(release): publish'
      },
      bootstrap: {
        hoist: true,
        npmClientArgs: []
      }
    },
    ignoreChanges: ['**/__fixtures__/**', '**/__tests__/**', '**/package.json']
  }

  const appendHoist = name => {
    if (!Array.isArray(config.command.bootstrap.hoist)) {
      config.command.bootstrap.hoist = []
    }
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
