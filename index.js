'use strict';

var go = module.exports = function () {
  
};

// Test
if (!module.parent && typeof window === 'undefined') {
  var root= __dirname + '/test/copied';

  go(root, 'browserify-swap', function (err) {
    if (err) return console.error(err);
    // package.json's found in root and below now have 'browserify-swap' added to their 'browserify.transform' field
  })
}
