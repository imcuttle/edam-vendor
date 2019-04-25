// @loader module?indent=2

module.exports = ({ rollup }) => {
  return {
    presets: [
      [
        'env',
        {
          targets: {
            node: '6',
            browsers: ['last 2 versions']
          },
          exclude: ['transform-regenerator'],
          loose: true,
          modules: rollup ? false : 'commonjs',
          useBuiltIns: true
        }
      ]
    ],
    plugins: ['transform-class-properties', 'transform-object-rest-spread']
  }
}
