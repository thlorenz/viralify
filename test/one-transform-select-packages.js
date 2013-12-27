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

test('\nviralifying one transform for select packages in different situations', function (t) {
  reset(original, copy, runTest);
  // original is not viralified since it is the root, however included as package to verify this behavior
  var packages = [ 'original', 'sub-dep1', 'sub-sub-dep1' ];

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
                browserify: { transform: [ 'unoify', 'browserify-swap' ] } },
              { name: 'sub-dep2',
                description: 'has no transforms',
                main: 'index.js' },
              { name: 'sub-dep1',
                description: 'Has no transforms',
                main: 'index.js',
                browserify: { transform: [ 'browserify-swap' ] } },
              { name: 'original',
                description: 'root project',
                main: 'index.js' },
              { name: 'dep',
                description: 'dep which itself has two transforms already',
                main: 'index.js',
                browserify: { transform: [ 'unoify', 'dosify' ] } } ]
          , 'adds transform to end for select packages when it was not present before'
        )
        addToEndAgain();
      })
    })

    function addToEndAgain() {
      viralify(copy, packages, 'browserify-swap', function (err) {
        if (err) return console.error(err);

        getPacks(copy, function (err, packs) {
          if (err) { t.fail(err); t.end(); }

          t.deepEqual(
              packs
            , [ { name: 'sub-sub-dep1',
                  description: 'has one transform already',
                  main: 'index.js',
                  browserify: { transform: [ 'unoify', 'browserify-swap' ] } },
                { name: 'sub-dep2',
                  description: 'has no transforms',
                  main: 'index.js' },
                { name: 'sub-dep1',
                  description: 'Has no transforms',
                  main: 'index.js',
                  browserify: { transform: [ 'browserify-swap' ] } },
                { name: 'original',
                  description: 'root project',
                  main: 'index.js' },
                { name: 'dep',
                  description: 'dep which itself has two transforms already',
                  main: 'index.js',
                  browserify: { transform: [ 'unoify', 'dosify' ] } } ]
            , 'leaves transform at end for select packages'
          )
          addToFront();
        })
      })
    }

    function addToFront() {
      viralify(copy, packages, 'browserify-swap', true, function (err) {
        if (err) return console.error(err);

        getPacks(copy, function (err, packs) {
          if (err) { t.fail(err); t.end(); }

          t.deepEqual(
              packs
            , [ { name: 'sub-sub-dep1',
                  description: 'has one transform already',
                  main: 'index.js',
                  browserify: { transform: [ 'browserify-swap', 'unoify' ] } },
                { name: 'sub-dep2',
                  description: 'has no transforms',
                  main: 'index.js' },
                { name: 'sub-dep1',
                  description: 'Has no transforms',
                  main: 'index.js',
                  browserify: { transform: [ 'browserify-swap' ] } },
                { name: 'original',
                  description: 'root project',
                  main: 'index.js' },
                { name: 'dep',
                  description: 'dep which itself has two transforms already',
                  main: 'index.js',
                  browserify:
                  { transform:
                      [ 'unoify',
                        'dosify' ] } } ]
            , 'removes transform from end and adds it to front for select packages when it was present before and front flag was set'
          )
          t.end();
        })
      })
    }
  }
})

