'use strict';

var glob   =  require('glob')
  , path   =  require('path')
  , fs     =  require('fs')
  , runnel =  require('runnel')

function addTransform(front, transform, packfile) {
  var pack = require(packfile);
  if (!pack.browserify) pack.browserify = {};
  if (!pack.browserify.transform) pack.browserify.transform = [];

  transform.forEach(function (tx) {
    // remove previously injected transform (i.e. may have been added at the end, but now needs to be in front)
    // other option would be to only add it if it's not there already, but then front/back switching wouldn' work
    var idx = pack.browserify.transform.indexOf(tx);
    if (~idx) pack.browserify.transform.splice(idx, 1);
  });

  if (front) pack.browserify.transform = transform.concat(pack.browserify.transform);
  else       pack.browserify.transform = pack.browserify.transform.concat(transform);

  return { file: packfile, pack: pack };
}

function packsWithTransforms(root, transform, front, relPaths) {
  return  relPaths
    .map(function (x) { return path.resolve(root, x) })
    .map(addTransform.bind(null, front, transform));
}


var go = module.exports = 

/**
 * Injects the given transform(s) into the `browserify.transform` field of all `package.json`s
 * at and below the given `root`.
 * 
 * @name viralify
 * @function
 * @param {String} root of the package
 * @param {Array.<String>} transform one or more transforms to be added to the transform field
 * @param {Boolean=} front if set transforms are added to the front of the transform field so they run first
 * @param {Function(Error)} cb called when the transform injection is complete
 */
function viralify(root, transform, front, cb) {
  if (!Array.isArray(transform)) transform = [ transform ];

  if (typeof front === 'function') {
    cb = front;
    front = false;
  }

  glob('**/package.json', { cwd: root }, function (err, relPaths) {
    if (err) return cb(err);

    // nothing to do
    if (!relPaths.length) return cb();

    var packs = packsWithTransforms(root, transform, front, relPaths);

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

module.exports.sync = 

/**
 * Same as `viralify` but performed synchronously.
 * 
 * @name viralivy.sync
 * @function
 * @param {String} root of the package
 * @param {Array.<String>} transform one or more transforms to be added to the transform field
 * @param {Boolean=} front if set transforms are added to the front of the transform field so they run first
 */
function sync(root, transform, front) {
  if (!Array.isArray(transform)) transform = [ transform ];

  var relPaths = glob.sync('**/package.json', { cwd: root })
  var packs = packsWithTransforms(root, transform, front, relPaths);
  packs.forEach(function (p) {
    fs.writeFileSync(p.file, JSON.stringify(p.pack, null, 2), 'utf8');
  })
}
