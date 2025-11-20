const inquirer = require('inquirer');
const simpleGit = require('simple-git');
const { cwd } = require('process');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const chalk = require('chalk');
const semver = require('semver');
const { execSync } = require('child_process');
const ora = require('ora');

const git = simpleGit();

const workspace = 'packages';
const excludePkg = ['docs'];

const typeColor = {
  major: 'red',
  minor: 'blue',
  patch: 'yellow',
  beta: 'gray',
};

function getPkgs() {
  const folderPath = path.join(cwd(), workspace);
  const files = fs.readdirSync(folderPath, { withFileTypes: true });
  return files.filter((file) => file.isDirectory() && !excludePkg.includes(file.name));
}

async function prompt({ message, choices }) {
  const { projects } = await inquirer.prompt({
    type: 'checkbox',
    name: 'projects',
    message,
    choices,
  });
  return projects;
}

async function pkgPrompt({ type, choices }) {
  const projects = await prompt({
    message: `Which packages should have a ${type} bump?`,
    choices,
  });
  return projects;
}

const execa = (command) => execSync(command).toString();

const hash = execa('git log -1 --pretty=format:%h');

// 调整发布工程下的package.json的版本
function writeVersion({ project, type }) {
  const libPkgPath = path.join(path.join(cwd(), `packages/${project}/package.json`));
  const libPkg = require(libPkgPath);
  let version;
  if (type !== 'beta') {
    version = semver.inc(libPkg.version, type);
  } else {
    // 如果版本号里面已经带了beta
    if (libPkg.version.includes('beta')) {
      const v = semver.coerce(libPkg.version);
      version = `${v}-beta.${hash}`;
    } else {
      const v = semver.inc(libPkg.version, 'patch');
      version = `${v}-beta.${hash}`;
    }
  }
  libPkg.version = version;
  fs.writeFileSync(libPkgPath, JSON.stringify(libPkg, null, 2), 'utf-8');
}

async function getNextType({ projects, type }) {
  return pkgPrompt({
    type: chalk[typeColor[type]](type),
    choices: projects.map((p) => ({ name: p, value: p })),
  });
}

async function generateVersions(projects) {
  let leftProjects = [];
  const versionsMap = {};
  const majorProjects = await getNextType({ type: 'major', projects });
  leftProjects = _.difference(projects, majorProjects);
  majorProjects.forEach((m) => {
    versionsMap[m] = 'major';
  });

  if (leftProjects.length) {
    const minorProjects = await getNextType({ type: 'minor', projects: leftProjects });
    leftProjects = _.difference(leftProjects, minorProjects);
    minorProjects.forEach((m) => {
      versionsMap[m] = 'minor';
    });
  }
  if (leftProjects.length) {
    const patchProjects = await getNextType({ type: 'patch', projects: leftProjects });
    leftProjects = _.difference(leftProjects, patchProjects);
    patchProjects.forEach((m) => {
      versionsMap[m] = 'patch';
    });
  }
  if (leftProjects.length) {
    const betaProjects = await getNextType({ type: 'beta', projects: leftProjects });
    leftProjects = _.difference(leftProjects, betaProjects);
    betaProjects.forEach((m) => {
      versionsMap[m] = 'beta';
    });
  }
  return versionsMap;
}

async function version() {
  const pkgs = getPkgs().map((f) => f.name);

  const projects = await prompt({
    message: 'Which packages would you like to include?',
    choices: [...pkgs.map((p) => p)],
  });

  const versionsMap = await generateVersions(projects);

  const spinner = ora('Upgrade versions...').start();

  const keys = Object.keys(versionsMap);
  if (!keys.length) {
    spinner.stop();
    console.log('\x1B[31m%s\x1B[0m', 'No selected items!');
    process.exit(0);
  }

  try {
    const fWritePath = path.join(cwd(), '.changeset');
    keys.forEach((p) => {
      writeVersion({ project: p, type: versionsMap[p] });
      fs.appendFileSync(fWritePath, `${p},`);
    });
  } catch (e) {
    console.log(e);
    execa('rimraf .changeset');
    spinner.stop();
    console.log('\x1B[31m%s\x1B[0m', 'Write versions failed!');
    process.exit(0);
  }

  await git.add('.');
  await git.commit('chore(t-teams-teach): prepare versions');

  // 自动push改为手动push，用于人工check版本和commit
  // try {
  //   const { current: currentBranch } = await git.branchLocal();
  //   await git.push('origin', currentBranch);
  // } catch (e) {
  //   console.log(e);
  //   spinner.stop();
  //   process.exit(0);
  // }

  spinner.stop();
  console.log('Update versions complete.');
}

version();
