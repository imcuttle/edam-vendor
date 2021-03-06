// @loader module?indent=2

module.exports = () => {
  return {
    presets: [
      ['@babel/env', {
        targets: {
          node: '>=10',
          browsers: ['defaults']
        },
        exclude: ['transform-regenerator'],
        loose: true, modules: 'commonjs'
      }],
      // '@babel/react',
    ],
    plugins: [
      '@babel/proposal-class-properties',
    ],
    env: {
      es: {
        presets: [
          ['@babel/env', {
            exclude: ['transform-regenerator'], loose: true, modules: false
          }],
        ],
      }
    },
  }
}
