const Git = require('./git')
const path = require('path');
const globby = require('globby');
const fs = require('fs-extra')
const getUser = require('./util').getUser;
const copyDir = require('./util').copyDir;

function getRepo(options) {
  if (options.repo) {
    return Promise.resolve(options.repo);
  } else {
    const git = new Git(process.cwd(), options.git);
    return git.getRemoteUrl(options.remote);
  }
}

exports.publish = function(basePath, config, callback){
  const options = Object.assign({}, exports.defaults, config)
  let userPromise = getUser();

  // 包的目录
  const dirPath = path.join(__dirname, '../deploy')
  copyDir(dirPath, basePath, options.space, function(err){
    if(err){
      console.log(err);
    }
    return userPromise.then(user =>{
      if (!user) {
        callback(new Error('Please set your account, then try again later'))
        return
      }
      let repoUrl;
      return getRepo(options)
        .then(repo => {
          repoUrl = repo
          process.chdir(basePath)
          return new Git(process.cwd(), options.git)
        }).then(git => {
          console.log('git init ..')
          return git.init()
        }).then(git => {
          console.log('copy file ...')
          const files = globby
            .sync(options.src, {
              cwd: basePath,
              dot: options.dotfiles
            })
            .filter(file => {
              return !fs.statSync(path.join(basePath, file)).isDirectory();
            });
          console.log('copy file done!')
          console.log('git add ..')
          return git.add(files)
        })
        .then(git => {
          if (!user) {
            return git;
          }
          return git.exec('config', 'user.email', user.email).then(() => {
            if (!user.name) {
              return git;
            }
            return git.exec('config', 'user.name', user.name);
          })
        })
        .then(git => {
          console.log('git commit ..')
          return git.commit(`deploy ${new Date()}`)
        })
        .then(git => {
          console.log('git remote ..')
          return git.exec('remote', 'add', 'origin', repoUrl)
        })
        .then(git => {
          console.log('git checkout ', options.branch)
          return git.exec('checkout', '-b', options.branch)
        }).then(git => {
          console.log('git push ..')
          git.exec('push', '-f', 'origin', options.branch)
        }).then(() => callback())
    })
  })
}

exports.defaults = {
  branch: 'release-sites',
  dist: 'dist',
  git: 'git',
  remote: 'origin',
  src: '**/*',
  dotfiles: false,
}