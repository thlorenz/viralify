'use strict';

var glob   =  require('glob')
  , path   =  require('path')
  , fs     =  require('fs')
  , runnel =  require('runnel')

function arraysEqual(a, b) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
function addTransform(front, transform, packfile) {

  var pack = require(packfile);
  if (!pack.browserify) pack.browserify = {};

  // "browserify": "index.js" => "browserify": { "index.js": "index.js" } so we can add our transforms
  if (typeof pack.browserify === 'string') { 
    var k = pack.browserify;
    pack.browserify = {};
    pack.browserify[k] = k; 
  }

  if (!pack.browserify.transform) pack.browserify.transform = [];
  
  var before = [].concat(pack.browserify.transform);

  transform.forEach(function (tx) {
    // remove previously injected transform (i.e. may have been added at the end, but now needs to be in front)
    // other option would be to only add it if it's not there already, but then front/back switching wouldn' work
    var idx = pack.browserify.transform.indexOf(tx);
    if (~idx) pack.browserify.transform.splice(idx, 1);
  });

  if (front) pack.browserify.transform = transform.concat(pack.browserify.transform);
  else       pack.browserify.transform = pack.browserify.transform.concat(transform);

  var changed = !arraysEqual(before, pack.browserify.transform);

  return { file: packfile, pack: pack, changed: changed };
}

function packsWithTransforms(root, transform, front, relPaths) {
  return relPaths
    .map(function (x) { return path.resolve(root, x) })
    .map(addTransform.bind(null, front, transform))
    .filter(function (p) { return p.changed });
}

function globify(packnames) {
  var extra = packnames.length === 1 ? ',' : '';
  return '{' + packnames.join(',') + extra + '}';
}

var go = module.exports = 

/**
 * Injects the given transform(s) into the `browserify.transform` field of all `package.json`s
 * of the packages below the given `root` that where specified.
 *
 * If the transform(s) were contained in the `package.json` already, no changes are made and no writes performed.
 * This means that all viralify runs succeeding the first one will be much faster.
 * 
 * @name viralify
 * @function
 * @param {String} root of the package
 * @param {Array.<String>} packages one or more packages to which the transforms should be added
 * @param {Array.<String>} transform one or more transforms to be added to the transform field
 * @param {Boolean=} front if set transforms are added to the front of the transform field so they run first
 * @param {Function(Error)} cb called when the transform injection is complete
 */
function viralify(root, packages, transform, front, cb) {
  if (!Array.isArray(packages)) packages = [ packages ];
  if (!Array.isArray(transform)) transform = [ transform ];

  if (typeof front === 'function') {
    cb = front;
    front = false;
  }

  var globString = '**/node_modules/' + globify(packages) + '/package.json';

  glob(globString, { cwd: root }, function (err, relPaths) {
    if (err) return cb(err);

    // nothing to do
    if (!relPaths.length) return cb();

    var packs = packsWithTransforms(root, transform, front, relPaths);

    // none of the packages changed due to adding the transform, which means they already contained it at the same position
    if (!packs.length) return cb();

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
 * @param {Array.<String>} packages one or more packages to which the transforms should be added
 * @param {Array.<String>} transform one or more transforms to be added to the transform field
 * @param {Boolean=} front if set transforms are added to the front of the transform field so they run first
 * @param {Function(Error)} cb called when the transform injection is complete
 */
function sync(root, packages, transform, front) {
  if (!Array.isArray(packages)) packages = [ packages ];
  if (!Array.isArray(transform)) transform = [ transform ];

  var globString = '**/node_modules/' + globify(packages) + '/package.json';

  var relPaths = glob.sync(globString, { cwd: root })
  var packs = packsWithTransforms(root, transform, front, relPaths);

  packs.forEach(function (p) {
    fs.writeFileSync(p.file, JSON.stringify(p.pack, null, 2), 'utf8');
  })
}
