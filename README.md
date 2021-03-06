# out

This is a simple node module designed to give you the following features in
one tidy convenient package:

* stderr reporting
* simple variable replacement
* colorized output


[![NPM](https://nodei.co/npm/out.png)](https://nodei.co/npm/out/)

[![stable](https://img.shields.io/badge/stability-stable-green.svg)](https://github.com/dominictarr/stability#stable) [![Build Status](https://api.travis-ci.org/DamonOehlman/out.svg?branch=master)](https://travis-ci.org/DamonOehlman/out)

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

## LICENCE

ISC License

Copyright (c) 2018, Damon Oehlman <damon.oehlman@gmail.com>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.


