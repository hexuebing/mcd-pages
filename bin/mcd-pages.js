#!/usr/bin/env node

const mcdPages = require('../lib/index')
const program = require('commander');
const path = require('path');
const pkg = require('../package.json');

function main(args) {
  program
  .version(pkg.version)
  .option('-d, --dist <dist>', 'Base directory for all source files')
  .option('-b, --branch <branch>', 'new branch for mcd', mcdPages.defaults.branch)
  .parse(args);
  console.info(program.dist)
  console.info(program.branch)
}

if (require.main === module) {
  main(process.argv)
}

exports = module.exports = main;
