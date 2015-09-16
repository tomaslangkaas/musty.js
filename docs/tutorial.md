# musty.js tutorial

## Basic introduction to mustache syntax

### Variable interpolation

Templates allow strings to be reused with different data. Given a template,
```
My name is {{name}} and I am {{age}} years old.
```
and a set of data,
```
{
    name: 'John',
    age: 49
}
```
template tags, surrounded by double braces, are replaced with the corresponding data:
```
My name is John and I am 49 years old.
```
### Conditional sections

Templates are handy when listing data. Given the data,

```
{
    name: 'John',
    age: 49,
    friends: {
        list: [
            {name: 'Bob', age: 51},
            {name: 'James', age: 35},
            {name: 'Dora', age: 42}
        ]
    }
}
```
and the template,
```
My name is {{name}} and I am {{age}} years old.
{{#friends}}
My friends are:
{{#list}}
- {{name}}, {{age}} years old
{{/list}}
{{/friends}}
```
this produces:
```
My name is John and I am 49 years old.
My friends are:
- Bob, 51 years old
- James, 35 years old
- Dora, 42 years old
```
This example introduces conditional section tags which start with `{{#tagkey}}` and end it with `{{/tagkey}}`. If the `tagkey` corresponds to a non-empty list or a non-false value in the data, the section content gets processed, otherwise not. If the `tagkey` corresponds to a non-empty list, the section content is processed once for each item in the list.

Note that the current data object (the context) is set to the current value in conditional sections. In the example, the `{{#friends}}` section is processed, since the current data has a non-empty and non-false `friends` property, and the current data object is set to the value of this property. This is an object which has a non-empty `list` property which is an array, thus the `{{#list}}` section gets processed once for each item, where the current data object is set to each item.

### Inverted sections

Content in inverted sections are processed if the tagkey does not exist or if the tagkey refers to a empty or false value. This is useful for implementing if/else logic in templates.

Extending the previous template:

```
My name is {{name}} and I am {{age}} years old.
{{#friends}}
... content to be processed in the case of friends ...
{{/friends}}
{{^friends}}
Sadly, I have no friends at the moment.
{{/friends}}
```
