# viralify [![build status](https://secure.travis-ci.org/thlorenz/viralify.png)](http://travis-ci.org/thlorenz/viralify)

Injects browserify transforms into specified dependencies of a package recursively.

```sh
viralify . -t browserify-swap -p ansicolors
```

```js
var viralify = require('viralify');

viralify(root, [ 'foo', 'bar' ], 'browserify-swap', function (err) {
  if (err) return console.error(err);
  // package.json's of packages 'foo' and 'bar', found in root and below,
  // now have 'browserify-swap' added to the end of their 'browserify.transform' field
})
```

## Installation

    npm install viralify

## Usage

```
viralify <path> <options>

  Inject browserify transform(s) into the package.json files of specified packages at and below the given path.

OPTIONS:

  -t, --transform   transform(s) to inject (required)
  -p, --packages    packages into which to inject the transforms (required)
  -f, --front       if set, the transform(s) are injected in the front of the transform field so they run first

EXAMPLES:

  Inject 'browserify-swap' transform for all foo dependencies of the package in the current directory

    viralify . -t browserify-swap -p foo

  Inject 'envify' and 'es6ify' transforms in front for all foo and bar dependencies of the package
  in the current directory

    viralify ./node_modules --transform envify --transform es6ify --front --package foo -p bar
```
## API

<!-- START docme generated API please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN docme TO UPDATE -->

<div>
<div class="jsdoc-githubify">
<section>
<article>
<div class="container-overview">
<dl class="details">
</dl>
</div>
<dl>
<dt>
<h4 class="name" id="viralify"><span class="type-signature"></span>viralify<span class="signature">(root, packages, transform, <span class="optional">front</span>, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Injects the given transform(s) into the <code>browserify.transform</code> field of all <code>package.json</code>s
of the packages below the given <code>root</code> that where specified.</p>
<p>If the transform(s) were contained in the <code>package.json</code> already, no changes are made and no writes performed.
This means that all viralify runs succeeding the first one will be much faster.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Argument</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>root</code></td>
<td class="type">
<span class="param-type">String</span>
</td>
<td class="attributes">
</td>
<td class="description last"><p>of the package</p></td>
</tr>
<tr>
<td class="name"><code>packages</code></td>
<td class="type">
<span class="param-type">Array.&lt;String></span>
</td>
<td class="attributes">
</td>
<td class="description last"><p>one or more packages to which the transforms should be added</p></td>
</tr>
<tr>
<td class="name"><code>transform</code></td>
<td class="type">
<span class="param-type">Array.&lt;String></span>
</td>
<td class="attributes">
</td>
<td class="description last"><p>one or more transforms to be added to the transform field</p></td>
</tr>
<tr>
<td class="name"><code>front</code></td>
<td class="type">
<span class="param-type">Boolean</span>
</td>
<td class="attributes">
&lt;optional><br>
</td>
<td class="description last"><p>if set transforms are added to the front of the transform field so they run first</p></td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="attributes">
</td>
<td class="description last"><p>called when the transform injection is complete</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/viralify/blob/master/index.js">index.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/viralify/blob/master/index.js#L61">lineno 61</a>
</li>
</ul></dd>
</dl>
</dd>
</dl>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->

#### viralify.sync(root, packages, transform, front)

Same as `viralify` but performed synchronously.

## License

MIT

