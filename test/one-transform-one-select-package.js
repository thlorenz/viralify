
'use strict';
/*jshint asi: true */

var test     =  require('tap').test
  , getPacks =  require('./util/get-packs')
  , reset    =  require('./util/reset')
  , viralify =  require('../')

var original =  __dirname + '/original'
  , copy     =  __dirname + '/copy'

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

test('\nviralifying one transform for one select package in different situations', function (t) {
  reset(original, copy, runTest);
  // original is not viralified since it is the root, however included as package to verify this behavior
  var packages = [ 'dep' ];

  function runTest(err) {
    if (err) { t.fail(err); t.end(); }
    
    viralify(copy, packages, 'browserify-swap', function (err) {
      if (err) return console.error(err);

      getPacks(copy, function (err, packs) {
        if (err) { t.fail(err); t.end(); }

        t.deepEqual(
            packs
          , [ { name: 'sub-sub-dep1',
              description: 'has one transform already',
              main: 'index.js',
              browserify: { transform: [ 'unoify' ] } },
            { name: 'sub-dep2',
              description: 'has no transforms',
              main: 'index.js' },
            { name: 'sub-dep1',
              description: 'Has no transforms',
              main: 'index.js' },
            { name: 'original',
              description: 'root project',
              main: 'index.js' },
            { name: 'dep',
              description: 'dep which itself has two transforms already',
              main: 'index.js',
              browserify:
              { transform:
                  [ 'unoify',
                    'dosify',
                    'browserify-swap' ] } } ]
            , 'adds transform to end of the one select package when it was not present before'
          )
          t.end()
      })
    })
  }
})
