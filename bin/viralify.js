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
  , { 'string': [ 'transform', 't', 'package', 'p' ] }
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
var packages = [].concat(argv.p).concat(argv.package).filter(Boolean);

if (!transform.length) {
  console.error('\nviralify %s Need to specify at least one transform\n', colors.red('ERR'));
  return usage();
}

if (!packages.length) {
  console.error('\nviralify %s Need to specify at least one package\n', colors.red('ERR'));
  return usage();
}

var vs = colors.magenta('viralify');
console.log('%s %s Processing %s', colors.green('info'), vs, root);
console.log('%s %s Transforms: %s', colors.green('info'), vs, transform.join(', '));
console.log('%s %s Packages:   %s', colors.green('info'), vs, packages.join(', '));

viralify(root, packages, transform, front, function (err) {
  if (err) return console.error(err);
  console.log('%s %s Everything is OK', colors.green('info'), vs);
})

})()
