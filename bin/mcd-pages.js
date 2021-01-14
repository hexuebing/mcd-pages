#!/usr/bin/env node

const mcdPages = require('../lib/index')
const program = require('commander');
const path = require('path');
const pkg = require('../package.json');

function publish(config) {
  return new Promise((resolve, reject) => {
    const basePath = path.resolve(process.cwd(), config.dist);
    mcdPages.publish(basePath, config, err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

function main(args) {
  return Promise.resolve().then(() => {
    program
      .version(pkg.version)
      .option('-d, --dist <dist>', 'Base directory for all source files')
      .option('-b, --branch <branch>', 'new branch for mcd', mcdPages.defaults.branch)
      .option('-r, --repo <repo>', 'URL of the repository you are pushing to')
      .requiredOption('-s, --space <space>', 'the site space')
      .parse(args);

      const config = {
        dist: program.dist,
        branch: program.branch,
        repo: program.repo,
        space: program.space
      }
      return publish(config)
  })
  
}

if (require.main === module) {
  main(process.argv)
    .then(() => {
      process.stdout.write('Published\n');
    })
    .catch(err => {
      process.stderr.write(`${err.message}\n`, () => process.exit(1));
    });
}

exports = module.exports = main;
