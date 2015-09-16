# musty.js tutorial
## Basic introduction to mustache syntax
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
This example introduced conditional section tags where a section starts with `{{#tag key}}` and ends it with `{{/tag key}}`. The `{{#friends}}` and `{{/friends}}` tag indicate that the text and tags within this section is processed if the data contains a `friend` property, which it does in this case.
