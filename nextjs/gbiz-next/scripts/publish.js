/**
 * Owner: victor.ren@kupotech.com
 */
const execa = require('execa');
const ora = require('ora');
const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');
const { chdir, cwd } = require('process');
const pkg = require('../package.json');

const version = pkg.version;
const isBeta = version.includes('beta');

const git = simpleGit();

async function publish() {
  console.log('Prepare to publish gbiz-next...');

  const spinner = ora('Building...').start();

  try {
    await execa('yarn', ['build']);
    // await execa('yarn', ['build:umd']);
  } catch (e) {
    spinner.stop();
    console.log('\x1B[31m%s\x1B[0m', 'Build failed!');
    console.log(e);
    process.exit(0);
  }

  // await execa('cp', ['package.json', 'dist/']);
  // await execa('cp', ['README.md', 'dist/']);

  spinner.stop();

  console.log('Build success!');

  chdir('dist/');

  // spinner.text = 'Update dist package.json...';

  // 调整lib下的package.json为发布状态
  // const libPkgPath = path.join(path.join(cwd(), 'package.json'));
  // const libPkg = require(libPkgPath);
  // libPkg.main = './node/index.js';
  // libPkg.module = './index.js';
  // libPkg.files = ['*'];
  // delete libPkg.scripts;
  // fs.writeFileSync(libPkgPath, JSON.stringify(libPkg, null, 2), 'utf-8');

  // console.log('Update lib package.json ok!');

  spinner.text = 'Publish...';

  try {
    if (isBeta) {
      await execa('yarn', ['publish', '--tag', 'beta']);
    } else {
      await execa('yarn', ['publish']);
    }  
    console.log(`Publish gbiz-next@${version} success.`);
  } catch (e) {
    spinner.stop();
    console.log('e:', e);
    console.log(`Publish gbiz-next@${version} failed.`);
    process.exit(0);
  }

  // 发包不打tag避免影响kufox的tag读取
  // try {
  //   const tagName = `gbiz-next@${version}`;
  //   await git.tag([tagName]);
  //   console.log(`git tag ${tagName}`);

  //   await git.push('origin', tagName);
  //   console.log(`git push ${tagName}`);
  // } catch (e) {
  //   console.log('e:', e);
  //   console.log('Git actions failed.');
  //   process.exit(0);
  // }

  spinner.stop();
  console.log('Publish gbiz-next completed');
  process.exit(0);
}

publish();
