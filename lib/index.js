const Git = require('./git')
const path = require('path');
const globby = require('globby');
const fs = require('fs-extra')
const getUser = require('./util').getUser;

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

  const files = globby
    .sync(options.src, {
      cwd: basePath,
      dot: options.dotfiles
    })
    .filter(file => {
      return !fs.statSync(path.join(basePath, file)).isDirectory();
    });

  return userPromise.then(user =>{
    if (!user) {
      callback(new Error('Please set your account, then try again later'))
      return
    }
    return getRepo(options)
      .then(repo => {
        process.chdir(basePath)
        const git = new Git(process.cwd(), options.git)
        return git
      }).then(git => {
        return git.init()
      }).then(git => {
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
        return git.commit(`deploy ${new Date()}`)
      })
  })
}

exports.defaults = {
  branch: 'release-sites',
  git: 'git',
  remote: 'origin',
  src: '**/*',
  dotfiles: false,
}