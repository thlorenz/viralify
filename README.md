# viralify [![build status](https://secure.travis-ci.org/thlorenz/viralify.png)](http://travis-ci.org/thlorenz/viralify)

Injects a browserify transform into all dependencies of a package recursively.

```js
var viralify = require('viralify');

viralify(root, 'browserify-swap', function (err) {
  if (err) return console.error(err);
  // package.json's found in root and below now have 'browserify-swap' added to their 'browserify.transform' field
})
```

## Status

Nix, Nada, Nichevo, Nothing --> go away!
## Installation

    npm install viralify

## API


## License

MIT
