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

test('\nviralifying one transform synchronously in different situations', function (t) {
  reset(original, copy, runTest);

  function runTest(err) {
    if (err) { t.fail(err); t.end(); }
    
    viralify.sync(copy, 'browserify-swap');

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
              main: 'index.js',
              browserify: { transform: [ 'browserify-swap' ] } },
            { name: 'sub-dep1',
              description: 'Has no transforms',
              main: 'index.js',
              browserify: { transform: [ 'browserify-swap' ] } },
            { name: 'original',
              description: 'root project',
              main: 'index.js',
              browserify: { transform: [ 'browserify-swap' ] } },
            { name: 'dep',
              description: 'dep which itself has two transforms already',
              main: 'index.js',
              browserify:
              { transform:
                  [ 'unoify',
                    'dosify',
                    'browserify-swap' ] } } ]
        , 'adds transform to end when it was not present before'
      )
      addToEndAgain();
    })

    function addToEndAgain() {
      viralify.sync(copy, 'browserify-swap')

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
                main: 'index.js',
                browserify: { transform: [ 'browserify-swap' ] } },
              { name: 'sub-dep1',
                description: 'Has no transforms',
                main: 'index.js',
                browserify: { transform: [ 'browserify-swap' ] } },
              { name: 'original',
                description: 'root project',
                main: 'index.js',
                browserify: { transform: [ 'browserify-swap' ] } },
              { name: 'dep',
                description: 'dep which itself has two transforms already',
                main: 'index.js',
                browserify:
                { transform:
                    [ 'unoify',
                      'dosify',
                      'browserify-swap' ] } } ]
          , 'leaves one transform at end when it was present before'
        )
        addToFront();
      })
    }

    function addToFront() {
      viralify.sync(copy, 'browserify-swap', true)

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
              main: 'index.js',
              browserify: { transform: [ 'browserify-swap' ] } },
            { name: 'sub-dep1',
              description: 'Has no transforms',
              main: 'index.js',
              browserify: { transform: [ 'browserify-swap' ] } },
            { name: 'original',
              description: 'root project',
              main: 'index.js',
              browserify: { transform: [ 'browserify-swap' ] } },
            { name: 'dep',
              description: 'dep which itself has two transforms already',
              main: 'index.js',
              browserify:
              { transform:
                  [ 'browserify-swap',
                    'unoify',
                    'dosify' ] } } ]
          , 'removes transform from end and adds it to front when it was present before and front flag was set'
        )
        t.end();
      })
    }
  }
})

