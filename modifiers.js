/* jshint node: true */
'use strict';

/**
## modifiers
**/
var reModifier = /\!\{(.*?)\}(.*?)(?=(\!\{|$))/m;
var reDelimiter = /(\s|\,|\+|\|)/;

var registry = {
  'test':       ['<', '>'],

  // from: https://github.com/Marak/colors.js/blob/master/colors.js
  // kudos to: https://twitter.com/#!/maraksquires
  'bold'      : ['\0\x1B[1m',  '\0\x1B[22m'],
  'italic'    : ['\0\x1B[3m',  '\0\x1B[23m'],
  'underline' : ['\0\x1B[4m',  '\0\x1B[24m'],
  'blink'     : ['\0\x1B[5m',  '\0\x1B[25m'],
  'inverse'   : ['\0\x1B[7m',  '\0\x1B[27m'],

  //grayscale
  'white'     : ['\0\x1B[37m', '\0\x1B[39m'],
  'grey'      : ['\0\x1B[90m', '\0\x1B[39m'],
  'black'     : ['\0\x1B[30m', '\0\x1B[39m'],

  //colors
  'blue'      : ['\0\x1B[34m', '\0\x1B[39m'],
  'cyan'      : ['\0\x1B[36m', '\0\x1B[39m'],
  'green'     : ['\0\x1B[32m', '\0\x1B[39m'],
  'magenta'   : ['\0\x1B[35m', '\0\x1B[39m'],
  'red'       : ['\0\x1B[31m', '\0\x1B[39m'],
  'yellow'    : ['\0\x1B[33m', '\0\x1B[39m']
};

var symbols = {
  'tick'      : [0x2713],
  'check'     : [0x2713]
};

// create the unicode strings
Object.keys(symbols).forEach(function(key) {
  symbols[key] = String.fromCharCode.apply(null, symbols[key]);
});

/**
### add(modifier, replacement)

Add a new modifier to the modifier registry
*/
exports.add = function(modifier, replacement) {
  registry[modifier] = replacement;
};

/**
### replace(text)

Apply modifiers using the internal modifier registry to the input
text.
*/
exports.replace = function(text) {
  // find and replace modifiers
  var match = reModifier.exec(text);
  var modifier;
  var modifiedText;
  var modifierType;
  var symbol;

  function applyModifier(modifierKey) {
    // look for symbols or modifiers related to this match
    symbol = symbols[modifierKey];
    modifier = registry[modifierKey];
    modifierType = typeof modifier;

    if ((modifierType == 'object') && modifier.length) {
      modifiedText = (modifier[0] || '') + modifiedText +
        (modifier[1] || '');
    }
    else if (modifierType == 'function') {
      modifiedText = modifier(modifiedText, modifierKey);
    }
    else if (symbol) {
      modifiedText = symbol + modifiedText;
    }
    else if (modifier) {
      modifiedText = modifier + modifiedText;
    }
    else {
      // attempt to parse the modifier key as an int
      var keyValue = parseInt(modifierKey, 16);
      if (! isNaN(keyValue)) {
        modifiedText = String.fromCharCode(keyValue) + modifiedText;
      }
    } // if..else
  }

  while (match) {
    // initialise the modified text to the 2nd capture group
    modifiedText = match[2];

    // iterate through each of the modifiers in the first capture group
    match[1].split(reDelimiter).forEach(applyModifier);

    text = text.slice(0, match.index) + modifiedText +
      text.slice(match.index + match[0].length);

    // update the match
    match = reModifier.exec(text);
  } // while

  return text;
};