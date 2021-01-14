#!/usr/bin/env node

function main(argv) {
  console.info(argv)
  console.info(process.cwd())
  console.log('hello cli')
}

if (require.main === module) {
  main(process.argv)
}

exports = module.exports = main;
