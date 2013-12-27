'use strict';

var exec = require('child_process').exec

module.exports = function reset(original, copy, cb) {
  exec('rm -rf ' + copy + ' && cp -R ' + original + ' ' + copy, function (err, stdout, stderr) {
    console.log('stdout', stdout);
    console.log('stderr', stderr);
    cb(err);    
  })
}
