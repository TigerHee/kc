const { execSync } = require('child_process');
const semver = require('semver');
const chalk = require('chalk');

exports.checkNodeVersion = (requireNodeVersion, frameworkName = 'natasha-cli') => {
  if (!semver.satisfies(process.version, requireNodeVersion)) {
    console.log(chalk.red(`You are using Node ${process.version}`));
    console.log(
      chalk.red(`${frameworkName} requires Node ${requireNodeVersion}, please upgrade your Node version.`)
    );
    process.exit(1);
  }
};

let _hasGit;

exports.hasGit = () => {
  if (_hasGit != null) {
    return _hasGit;
  }
  try {
    execSync('git --version', { stdio: 'ignore' });
    return (_hasGit = true);
  } catch (error) {
    return (_hasGit = false);
  }
};
