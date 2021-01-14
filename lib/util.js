const Git = require('./git');

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