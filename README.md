# out

This is a simple node module designed to give you the following features in
one tidy convenient package:

- stderr reporting
- simple variable replacement
- colorized output

[
![Build Status]
(https://travis-ci.org/DamonOehlman/node-out.png?branch=master)
](https://travis-ci.org/DamonOehlman/node-out)

## Example Usage

```js
var out = require('out');

// write a message to stderr
out('Hello');

// do a variable replacement in a message
out('Hello, my name is {0}', 'Bob');

// do some formatting of things
out('Hello, my name is !{bold}{0}', 'Bob');
```

## Reference

### out(message, args*)

Send the message (with appropriate argument replacements applied) to
`stderr` (unless output has been directed somewhere else using `out.to`).

### out.error(err)

An error helper for reporting exceptions.

### out.to(targets)

This is used to reset the output targets for writing output. By default, 
out will send output to stderr so that it doesn't pollute stdout.

## out modifiers

There are a number of modifiers include in the out module by default.
Primarily, the escape codes were gleaned from
[colors](https://github.com/Marak/colors.js).
