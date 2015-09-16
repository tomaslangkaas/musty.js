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
    friends: [
        {name: 'Bob', age: 51},
        {name: 'James', age: 35},
        {name: 'Dora', age: 42}
    ]
}
```
and the template,
```
My name is {{name}} and I am {{age}} years old.
My friends are:
{{#friends}}
- {{name}}, {{age}} years old
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
This example introduced section tags where a section starts with {{#tag key}} and ends it with {{/tag key}}.
