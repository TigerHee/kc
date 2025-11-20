#!/usr/bin/env node


const cli = require('../lib/index');
const scanFile = require('../lib/scanfile');

const args = require('yargs-parser')(process.argv.slice(2), {
    alias: {
      watch: ['w'],
      version: ['v'],
      scan: ['c']
    },
    boolean: ['coverage', 'watch', 'version', 'debug', 'e2e', 'passWithNoTests'],
    default: {
      e2e: true,
      passWithNoTests: true,
      coverage: true,
    },
  });
  
  const toExtend = ['--passWithNoTests', '--coverage'];

;(async () => {
    if(args.scan) {
        await scanFile({ genCSV: true });
        return;
    }
    await cli([...process.argv.slice(2), ...toExtend]);
})();
