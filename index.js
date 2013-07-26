/* jshint node: true */
'use strict';

var formatters = {};
var reFormatHolders = /\{(\d+)(?=\})/g;
var _targets = [process.stderr];
var modifiers = require('./modifiers');
var out;

/**
## out(format)
**/
out = module.exports = function(format) {
  var formatter;
  var output;
  var ii;

  // if we have no format provided, then return the modifiers
  if (! format) {
    return modifiers;
  }

  formatter = formatters[format] || createFormatter(modifiers.replace(format));
  output = formatter.apply(null, Array.prototype.slice.call(arguments, 1));

  // write the output to stdout
  for (ii = _targets.length; ii--; ) {
    _targets[ii].write(output + out.end);
  }

  // return the output so we can test as required
  return output;
};

// define what will be appended to the end of each write statement
out.end = '\n';

/**
## out.error(err)

An error helper for reporting exceptions.
**/
out.error = function() {
  var args = Array.prototype.slice.call(arguments);
  out.apply(null, ['!{red}' + args.shift()].concat(args));
};

/**
## out.to(targets)

This is used to reset the output targets for writing output. By default, 
out will send output to stderr so that it doesn't pollute stdout.
**/
out.to = function(targets) {
  // reset the targets
  _targets = [].concat(targets || undefined).filter(function(writer) {
    return writer && typeof writer.write == 'function';
  });
};

/* internal helpers */

function createFormatter(format) {
  var matches = format.match(reFormatHolders);
  var regexes = [];
  var regexCount = 0;
  var ii;
  var argIndex;

  // iterate through the matches
  for (ii = matches ? matches.length : 0; ii--; ) {
    argIndex = matches[ii].slice(1);

    if (! regexes[argIndex]) {
      regexes[argIndex] = new RegExp('\\{' + argIndex + '\\}', 'g');
    } // if
  } // for

  // update the regex count
  regexCount = regexes.length;

  // initialise the formatter
  formatters[format] = function() {
    var output = format;
    var argValue;

    for (ii = 0; ii < regexCount; ii++) {
      argValue = arguments[ii];
      if (typeof argValue == 'undefined') {
        argValue = '';
      } // if

      output = output.replace(regexes[ii], argValue);
    } // for

    return output;
  };

  return formatters[format];
}