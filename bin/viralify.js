#!/usr/bin/env node
'use strict';

var path     =  require('path')
  , fs       =  require('fs')
  , colors   =  require('ansicolors')
  , viralify =  require('../')

function usage() {
  var usageFile = path.join(__dirname, 'usage.txt');
  fs.createReadStream(usageFile).pipe(process.stdout);
}

var argv    =  require('minimist')(
    process.argv.slice(2)
  , { 'boolean': [ 'f', 'front', 'h', 'help' ] }
  , { 'string': [ 'transform', 't' ] }
);

(function () {

if (argv.h || argv.help) return usage();

var front  =  argv.f || argv.front
  , root   =  argv._[0] && path.resolve(argv._[0]);

if (!root) {
  console.error('\nviralify %s Need to specify root dir i.e. ./root\n', colors.red('ERR'));
  return usage();
}

var transform = [].concat(argv.t).concat(argv.transform).filter(Boolean);

if (!transform.length) {
  console.error('\nviralify %s Need to specify at least one transform\n', colors.red('ERR'));
  return usage();
}

console.log('viralify %s Processing %s', colors.green('INFO'), root);
viralify(root, transform, front, function (err) {
  if (err) return console.error(err);
  console.log('viralify %s Everything is OK', colors.green('INFO'));
})

})()
