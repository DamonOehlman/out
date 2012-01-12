# Yet another console logging toolbox. 

Yes, it's yet another Node.js console logging library.  Out takes inspiration from [colors.js](https://github.com/Marak/colors.js) and that is definitely a library worth a look IMO.

So why did I write out then?  Because it focuses on using string modifiers to influence formatted output rather than the getters that colors.js uses. This is purely a personal preference, but does mean that referencing an incorrect formatter will not result in an `undefined` string.

## Usage

Using out is pretty simple:

```js
var out = require('out');

out('!{red}This will be output in red');
```

You can see in the string above, the `!{modifier}` is the syntax used to specify that a string should be marked up in some way.  At present, out only supports the application of a single modifier at a time (colors supports multiple).

The modifier ends formatting either at the end of the string or once another formatter has been encountered.  In the example above the whole string is output in red, but in the example below we change formatting to green mid string:

```js
var out = require('out');

out('!{red}I\'m red !{green}And I\'m green');
```

Obviously there will be cases where you want to end the formatting before another modifier takes over, and this can be done by specifying an empty modifier `!{}`:

```js
var out = require('out');

out('I\'m !{red}red!{} and I\'m !{green}green');
```

That's pretty much all there is to it.

## Delimited Modifiers

You can specifier multiple modifiers in one modifier section:

```js
var out = require('out');
out('!{red,underline}This will be red and underlined');
```

__NOTE:__ Delimiters of comma (,) space ( ) and plus (+) are all valid.

## Unicode Goodness

From version `0.3.0` some handy unicode goodness is included.  If you want to output a unicode character as part of your string, you can include it's hex value in place of a named modifier.  For instance:

```js
out('!{2713}');
```

Would generate a check mark (✓).  Want a green check mark, no problem:

```js
out('!{2713,green}');
```

Now, I'm not terribly good at remembering unicode values, so additionally, some symbols have been defined:

- tick / check : ✓
- more as requested, added via pull requests

## Redirecting out

By default, out writes to `process.stdout` but can be redirected to other locations.  For instance, to direct nowhere, you can specify the following:

```js
var out = require('out');

// send nowhere
out.to(null);

// output hi, nowhere
out('hi');
```