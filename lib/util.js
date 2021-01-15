const Git = require('./git');
const fs = require('fs');
const path = require('path');

exports.getUser = function(cwd) {
  return Promise.all([
    new Git(cwd).exec('config', 'user.name'),
    new Git(cwd).exec('config', 'user.email')
  ])
    .then(results => {
      return {name: results[0].output.trim(), email: results[1].output.trim()};
    })
    .catch(err => {
      // git config exits with 1 if name or email is not set
      return null;
    });
};

function copyYaml(source, target, space, callback){
  fs.readFile(`${source}/app.yaml`, 'utf8', function (err,data) {
    var formatted = data.replace(/spaceName/g, space);
    fs.writeFile(`${target}/app.yaml`, formatted, 'utf8', function (err) {
        if (err) return console.log(err);
        callback()
    });
  });
}
function copyDockerfile(source, target, space, callback){
  fs.readFile(`${source}/Dockerfile`, 'utf8', function (err,data) {
    var formatted = data.replace(/spaceName/g, space);
    fs.writeFile(`${target}/Dockerfile`, formatted, 'utf8', function (err) {
        if (err) return console.log(err);
        callback()
    });
  });
}

function copyNginxConf(source, target, callback){
  fs.readFile(`${source}/conf.d/default.conf`, 'utf8', function (err,data) {
    fs.mkdirSync(`${target}/conf.d`)
    fs.writeFile(`${target}/conf.d/default.conf`, data, 'utf8', function (err) {
        if (err) return console.log(err);
        callback()
    });
  });
}

exports.copyDir = function copyDir(dirPath, basePath, space, callback) {
  const source = path.join(dirPath)
  const target = path.join(basePath)
  copyYaml(source, target, space, () => {
    copyDockerfile(source, target, space,() => {
      copyNginxConf(source, target, () => {
        callback()
      })
    })
  })
}
