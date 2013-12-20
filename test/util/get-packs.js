'use strict';

var glob =  require('glob')
  , path =  require('path')

function sortByName(arr) {
  return arr.sort(comparator);

  function comparator(a, b) {
    return a.name < b.name;
  }
}

module.exports = function getPacks(copy, cb) {
  glob('**/package.json', { cwd: copy }, function (err, res) {
    if (err) return cb(err);

    var packs = res
      .map(function (x) { return path.resolve(copy, x) })
      .map(require);

    cb(err, sortByName(packs));
  })
}

