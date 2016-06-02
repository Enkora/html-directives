html-directives
===============

AngularJS 1.X. component for defining basic directives as HTML.

<!---
[![Build Status](https://travis-ci.org/Enkora/html-directives.png?branch=master)](https://travis-ci.org/Enkora/html-directives)
[![Coverage Status](https://coveralls.io/repos/Enkora/html-directives/badge.png)](https://coveralls.io/r/Enkora/html-directives)
-->

Installation
------------

You can choose your preferred method of installation:
* Through bower: `bower install html-directives --save`
* Download from github: [html-directives.min.js](https://raw.github.com/Enkora/html-directives/master/html-directives.min.js)

Usage
-----
Include html-directives.min.js in your application.

```html
<script src="components/html-directives/html-directives.js"></script>
```

Add the module `htmlDirectives` as a dependency to your app module:

```js
var myapp = angular.module('myapp', ['htmlDirectives']);
```

### Configuration

Add a template URL in your app config section

```js
angular.module('myapp').config(['htmlDirectivesProvider', function(htmlDirectivesProvider) {
	htmlDirectivesProvider.addTemplateUrl('my-directives.html');
}]);

```
addTemplateUrl can be called multiple times, if you have many directive templates.

## Basic usage
Add following contents to my-directives.html

```html
<my-error error-text>
	<div class="alert alert-danger">
		<h4>This is an error</h4>
		<p>Got the following error: {{errorText}}</p>

		<button type="button">Close</button>
	</div>
</my-error>
```

and in your HTML file:

```html
<my-error error-text="unknown error"/>
# or
<div my-error error-text="unknown error"/>
```

Which will then be translated into the HTML defined inside your HTML-directive.

## Advanced usage
my-directives.html

```html
<formy d-replace="true" d-transclude="true" l-label="@" is-visible="=">
		<div class="form-group" ng-show="isVisible">
				<label nf-ig="lLabel" class="col-sm-5 control-label">{{lLabel}}</label>

				<div class="col-sm-7" ng-class="{ 'sm-col-push-5': lLabel }">
						<div ng-transclude></div>
				</div>
		</div>
</formy>
```

and in your HTML file:

```html
<form name="form" class="form-horizontal">
	<formy l-label="First Name" is-visible="allow_edit"><input type="text" ng-model="first_name" class="form-control"></formy>
	<formy l-label="Last Name"><input type="text" ng-model="last_name" class="form-control"></formy>
	<formy><input type="submit">Save form</input></formy>
</form>
```
And you will have a neatly formatted bootstrap horizontal form.

### More samples

```html
<my-dir scope="@" attr1 attr2="@" some-attribute="=" d-restrict="A">
	My-dir value: {{myDir}}<br>
	Attr1: {{attr1}}<br>
	Attr2: {{attr2 ? 'truthy' : 'falsy'}}<br>
	Attr3: {{someAttribute}}<br>
</my-dir>
```

```html
<div my-dir="'this is mydir value'" attr1="attribute 1 value" attr2="a == 'b' || something == true" some-attribute="something"></div>
```

## Attribute definitions

HTML directive can have freely defined attributes, which will be referenced in the inner scope. If attribute is defined without value ("&lt;my-dir attr1>"), then attribute is referenced as value ("@"). Optionally, you can define value type (&lt;my dir attr1="@">).

### Special attributes
- d-replace: defines directive 'replace' value
- d-transclude: defines directive 'transclude' value
- d-restrict: defines how directive can be applied, default is "AE" (= attribute, =eleement). So as &lt;my-dir> or as <div my-dir>
- d-scope: directive scope type, e.g. if directive is defined as &lt;my-dir scope="@">{{myDir}}&lt;/my-dir>, then it can be referenced as &lt;div my-dir="value">

## FAQ
- Is it possible to attach link, compile, etc functions to directives?
  - Not at the moment. If you have a solution proposal, preferably with code, please make a pull request.

## Ideas
- Processing inline templates (no need to load external file). Or specifically tagged HTML elements?

```html
<script type="text/ng-template" html-directives>
  <my-dir>
		something
	</my-dir>
</script>

<my-dir html-directive>
  something
</my-dir>

<html-directives>
	<my-dir>
		something
	</my-dir>

	<another-dir>
	</another-dir>
</html>
```

License
----

Released under the terms of MIT License:

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
