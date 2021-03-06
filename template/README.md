# {{{name}}}

[![Build status](https://img.shields.io/travis/{{{_.git.name}}}/{{{name}}}/master.svg?style=flat-square)](https://travis-ci.com/{{{_.git.name}}}/{{{name}}})
[![Test coverage](https://img.shields.io/codecov/c/github/{{{_.git.name}}}/{{{name}}}.svg?style=flat-square)](https://codecov.io/github/{{{_.git.name}}}/{{{name}}}?branch=master)
{{#if lerna}}
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg?style=flat-square)](https://lernajs.io/)
{{else}}
[![NPM version](https://img.shields.io/npm/v/{{{name}}}.svg?style=flat-square)](https://www.npmjs.com/package/{{{name}}})
[![NPM Downloads](https://img.shields.io/npm/dm/{{{name}}}.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/{{{name}}})
{{/if}}
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://prettier.io/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)

> {{{description}}}

{{#if lerna}}
## Packages
{{else}}
## Installation

```bash
npm install {{{name}}}
# or use yarn
yarn add {{{name}}}
```

## Usage

```javascript
import {{{camelCase name}}} from '{{name}}'
```
{{/if}}

{{#if documentation}}

## API

{{/if}}

## Contributing

- Fork it!
- Create your new branch:  
  `git checkout -b feature-new` or `git checkout -b fix-which-bug`
- Start your magic work now
- Make sure npm test passes
- Commit your changes:  
  `git commit -am 'feat: some description (close #123)'` or `git commit -am 'fix: some description (fix #123)'`
- Push to the branch: `git push`
- Submit a pull request :)

## Authors

This library is written and maintained by {{{_.git.name}}}, <a href="mailto:{{{_.git.email}}}">{{{_.git.email}}}</a>.

## License

MIT - [{{{_.git.name}}}](https://github.com/{{{_.git.name}}}) 🐟
