/**
 * Owner: iron@kupotech.com
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'bug',
        'docs',
        'style',
        'refactor',
        'test',
        'chore',
        'version',
        'build',
        'ci',
        'perf',
        'revert',
        'merge',
      ],
    ],
    'scope-case': [2, 'always', ['lower-case', 'snake-case', 'upper-case', 'kebab-case']],
    'subject-case': [0],
  },
};
