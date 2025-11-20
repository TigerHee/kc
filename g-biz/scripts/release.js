/**
 * Owner: iron@kupotech.com
 */
const execa = require('execa');
const minimist = require('minimist');

const argvs = minimist(process.argv);

const getCommitHash = async () => {
  const { stdout: commitHash } = await execa('git', ['rev-parse', '--short', 'HEAD']);
  return commitHash;
};

const release = async () => {
  let lernaArgvs = [
    'publish',
    '--conventional-commits',
    '--conventional-graduate',
    '--message=chore(release): publish',
  ];

  if (argvs.pkg) {
    lernaArgvs.push('from-package');
  }

  if (argvs.beta) {
    const commitHash = await getCommitHash();
    lernaArgvs = ['publish'];
    const preId = `beta.${commitHash}`;

    if (argvs.pkg) {
      lernaArgvs.push('from-package');
    }

    lernaArgvs = [
      ...lernaArgvs,
      '--conventional-commits',
      '--conventional-prerelease',
      '--no-changelog',
      '--no-commit-hooks',
      '--no-private',
      '--dist-tag',
      'beta',
      '--preid',
      preId,
      '--message=chore(release): publish beta',
    ];
  }

  await execa(require.resolve('lerna/cli'), lernaArgvs, { stdio: 'inherit' });
};

release();
