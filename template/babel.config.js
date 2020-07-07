module.exports = {
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
