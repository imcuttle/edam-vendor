// @loader module?indent=2

module.exports = () => {
  return {
    presets: [
      ['@babel/env', {loose: true, modules: 'commonjs'}],
      // '@babel/react',
    ],
    plugins: [
      '@babel/proposal-class-properties',
    ],
    env: {
      es: {
        presets: [
          ['@babel/env', {loose: true, modules: false}],
        ],
      }
    },
  }
}
