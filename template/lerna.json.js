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
        "changelogPreset": {
          "name": "conventional-changelog-conventionalcommits"
        },
        conventionalCommits: true,
        message: 'chore(release): publish'
      },
      run: {
        stream: true
      },
      bootstrap: {
        hoist: true,
        npmClientArgs: []
      }
    },
    ignoreChanges: ['**/__fixtures__/**', '**/__tests__/**', '**/package.json']
  }

  return config
}
