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

test('\nviralifying three transforms in different situations', function (t) {

  reset(original, copy, runTest);

  function runTest(err) {
    if (err) { t.fail(err); t.end(); }
    viralify(copy, [ 'einsify',  'zweiify', 'dreiify' ], function (err) {
      if (err) return console.error(err);

      getPacks(copy, function (err, packs) {
        if (err) { t.fail(err); t.end(); }

        t.deepEqual(
            packs
          , [ { name: 'sub-sub-dep1',
                description: 'has one transform already',
                main: 'index.js',
                browserify:
                { transform:
                    [ 'unoify',
                      'einsify',
                      'zweiify',
                      'dreiify' ] } },
              { name: 'sub-dep2',
                description: 'has no transforms',
                main: 'index.js',
                browserify:
                { transform:
                    [ 'einsify',
                      'zweiify',
                      'dreiify' ] } },
              { name: 'sub-dep1',
                description: 'Has no transforms',
                main: 'index.js',
                browserify:
                { transform:
                    [ 'einsify',
                      'zweiify',
                      'dreiify' ] } },
              { name: 'original',
                description: 'root project',
                main: 'index.js',
                browserify:
                { transform:
                    [ 'einsify',
                      'zweiify',
                      'dreiify' ] } },
              { name: 'dep',
                description: 'dep which itself has two transforms already',
                main: 'index.js',
                browserify:
                { transform:
                    [ 'unoify',
                      'dosify',
                      'einsify',
                      'zweiify',
                      'dreiify' ] } } ]
          , 'adds all three transforms to the end in the order they were given'
        )

        addToFront();
      })
    })

    function addToFront() {
      viralify(copy, [ 'einsify',  'zweiify', 'dreiify' ], true, function (err) {
        if (err) return console.error(err);

        getPacks(copy, function (err, packs) {
          if (err) { t.fail(err); t.end(); }

          t.deepEqual(
              packs
            , [ { name: 'sub-sub-dep1',
                description: 'has one transform already',
                main: 'index.js',
                browserify:
                { transform:
                    [ 'einsify',
                      'zweiify',
                      'dreiify',
                      'unoify' ] } },
              { name: 'sub-dep2',
                description: 'has no transforms',
                main: 'index.js',
                browserify:
                { transform:
                    [ 'einsify',
                      'zweiify',
                      'dreiify' ] } },
              { name: 'sub-dep1',
                description: 'Has no transforms',
                main: 'index.js',
                browserify:
                { transform:
                    [ 'einsify',
                      'zweiify',
                      'dreiify' ] } },
              { name: 'original',
                description: 'root project',
                main: 'index.js',
                browserify:
                { transform:
                    [ 'einsify',
                      'zweiify',
                      'dreiify'] } },
              { name: 'dep',
                description: 'dep which itself has two transforms already',
                main: 'index.js',
                browserify:
                { transform:
                    [ 'einsify',
                      'zweiify',
                      'dreiify',
                      'unoify',
                      'dosify' ] } } ]
            , 'adds all three transforms to the front in the order they were given and removes them from the end'
          )
          t.end();
        })
      })
    }
  }
})
