#!/usr/bin/env node
const parse = require('yargs-parser');
const { build } = require('build-scripts');
const log = require('build-scripts/lib/utils/log');
const path = require('path');

module.exports = async () => {
  process.env.NODE_ENV = 'production';
  const rawArgv = parse(process.argv.slice(2), {
    configuration: { 'strip-dashed': true }
  });

  const { rootDir = process.cwd() } = rawArgv;

  delete rawArgv.rootDir;
  // ignore _ in rawArgv
  delete rawArgv._;

  try {
    await build({
      plugins: [require.resolve('../../build-plugin-react-app')],
      rootDir: path.isAbsolute(rootDir) ? rootDir : path.join(process.cwd(), rootDir),
      args: { ...rawArgv }
    });
  } catch (err) {
    log.error(err.message);
    console.error(err);
    process.exit(1);
  }
};
