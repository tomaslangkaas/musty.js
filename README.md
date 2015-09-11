# must.js

Tiny templating library

## Features
* Tiny (~1kb minified)
* Fast (compiles templates to reusable functions)
* Based on mustache syntax
* No dependencies
* Extensive browser support (tested in IE6+)
* Support for custom formatters

## Setup

The file `must.js` contains the minified library. The file sets up a global variable `must` which contains the whole library in a self-invoking function expression.

This may be customized by changing the opening expression `var must= ...` to whatever, such as `whateverNamespaceOrModule.templateCompiler = ...`.

## Basic use

The library consists of one single function, `must`. Calling this with a string with template syntax returns a compiled template or `false` if compilation fails. The compiled template is a function which accepts an object with data to insert in the template and returns a rendered string.

```javascript
var compiledTemplate = must(templateString);

var renderedString = compiledTemplate(templateData);
```

For custom formatters, the `must` function accepts a second, optional argument, an object with formatting functions.

## Documentation and examples

### Variables and function variables

Standard mustache tags for inserting variables are supported:

```javascript
var templateString = "My name is {{name}}, my lucky number is " +
    "{{luckyNumber}}, and I {{don't }}like skating.";

var templateData = {
    name: "Bart Simpson",
    luckyNumber: function(){
        return 10 * Math.random() | 0
    } 
};

var renderedString = must(templateString)(templateData);
```

Notice that calling `must(templateString)` always returns a function (a compiled template) which may be cached for reuse. In this example, the compiled template is immediately called with `templateData` to provide a rendered string.

Inspecting `renderedString` in the console:

```javascript
> renderedString
"My name is Bart Simpson, my lucky number is 9, and I like skating."
```

Non-existing keys in `templateData`, as the key `"don't "` in this example, are not rendered.

### HTML escaping

...

### Conditional sections

...

### Enumerable sections

...

### Custom formatters

...

### Partials and lambdas

...
