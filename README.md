# out

This is a simple node module designed to give you the following features in
one tidy convenient package:

- stderr reporting
- simple variable replacement
- colorized output


[![NPM](https://nodei.co/npm/out.png)](https://nodei.co/npm/out/)

[![Build Status](https://drone.io/github.com/DamonOehlman/node-out/status.png)](https://drone.io/github.com/DamonOehlman/node-out/latest)

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

## License(s)

### MIT

Copyright (c) 2013 Damon Oehlman <damon.oehlman@gmail.com>

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
