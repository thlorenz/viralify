# viralify [![build status](https://secure.travis-ci.org/thlorenz/viralify.png)](http://travis-ci.org/thlorenz/viralify)

Injects one or more browserify transforms into all dependencies of a package recursively.

```js
var viralify = require('viralify');

viralify(root, 'browserify-swap', function (err) {
  if (err) return console.error(err);
  // package.json's found in root and below now have 'browserify-swap' added 
  // to the end of their 'browserify.transform' field
})
```

## Installation

    npm install viralify

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
<h4 class="name" id="viralify"><span class="type-signature"></span>viralify<span class="signature">(root, transform, <span class="optional">front</span>, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Injects the given transform(s) into the <code>browserify.transform</code> field of all <code>package.json</code>s
at and below the given <code>root</code>.</p>
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
<a href="https://github.com/thlorenz/viralify/blob/master/index.js#L28">lineno 28</a>
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

## License

MIT

