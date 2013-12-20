'use strict';

var glob = require('glob')
  , path = require('path')
  , fs   = require('fs')
  , runnel = require('runnel')

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

function addTransform(front, transform, packfile) {
  var pack = require(packfile);
  if (!pack.browserify) pack.browserify = {};
  if (!pack.browserify.transform) pack.browserify.transform = [];

  transform.forEach(function (tx) {
    // remove previously injected transform (i.e. may have been added at the end, but now needs to be in front)
    // other option would be to only add it if it's not there already, but then front/back switching wouldn' work
    var idx = pack.browserify.transform.indexOf(tx);
    if (~idx) pack.browserify.transform.splice(idx, 1);

    if (front) pack.browserify.transform = [tx].concat(pack.browserify.transform);
    else       pack.browserify.transform = pack.browserify.transform.concat(tx);
  });

  return { file: packfile, pack: pack };
}

var go = module.exports = 

function (root, transform, front, cb) {
  if (!Array.isArray(transform)) transform = [ transform ];

  if (typeof front === 'function') {
    cb = front;
    front = false;
  }

  glob('**/package.json', { cwd: root }, function (err, res) {
    if (err) return cb(err);

    var packs = res
      .map(function (x) { return path.resolve(root, x) })
      .map(addTransform.bind(null, front, transform));

    var tasks = packs
      .map(function (p) {
        return function (cb) {
          fs.writeFile(p.file, JSON.stringify(p.pack, null, 2), 'utf8', cb);
        }
      })
      .concat(cb);

    runnel(tasks);
  });
};

// Test
if (!module.parent && typeof window === 'undefined') {
  var root= __dirname + '/test/copy';

  go(root, 'browserify-swap', function (err) {
    if (err) return console.error(err);
    // package.json's found in root and below now have 'browserify-swap' added to their 'browserify.transform' field

    glob('**/package.json', { cwd: root }, function (err, res) {
      if (err) return console.error(err);

      var packs = res
        .map(function (x) { return path.resolve(root, x) })
        .map(require);

      inspect(packs);
    })
  })
}
