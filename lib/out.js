var formatters = {},
    reFormatHolders = /\{(\d+)(?=\})/g,
    reModifier = /\!\{(.*?)\}(.*?)(?=(\!\{|$))/m,
    reDelimiter = /(\s|\,|\+|\|)/,
    _targets = [process.stderr];
    
var modifiers = (function() {
    // internals
    
    var registry = {
            'test':       ['<', '>'],
        
            // from: https://github.com/Marak/colors.js/blob/master/colors.js
            // kudos to: https://twitter.com/#!/maraksquires
            'bold'      : ['\033[1m',  '\033[22m'],
            'italic'    : ['\033[3m',  '\033[23m'],
            'underline' : ['\033[4m',  '\033[24m'],
            'blink'     : ['\033[5m',  '\033[25m'],
            'inverse'   : ['\033[7m',  '\033[27m'],
        
            //grayscale
            'white'     : ['\033[37m', '\033[39m'],
            'grey'      : ['\033[90m', '\033[39m'],
            'black'     : ['\033[30m', '\033[39m'],
        
            //colors
            'blue'      : ['\033[34m', '\033[39m'],
            'cyan'      : ['\033[36m', '\033[39m'],
            'green'     : ['\033[32m', '\033[39m'],
            'magenta'   : ['\033[35m', '\033[39m'],
            'red'       : ['\033[31m', '\033[39m'],
            'yellow'    : ['\033[33m', '\033[39m']
        },
        symbols = {
            'tick'      : [0x2713],
            'check'     : [0x2713]
        };

    // create the unicode strings
    Object.keys(symbols).forEach(function(key) {
        symbols[key] = String.fromCharCode.apply(null, symbols[key]);
    });
    
    // exports
    
    function add(modifier, replacement) {
        registry[modifier] = replacement;
    } // add

    function replace(text) {
        // find and replace modifiers
        var match = reModifier.exec(text),
            modifier,
            modifiedText,
            modifierType,
            symbol;
            
        while (match) {
            // initialise the modified text to the 2nd capture group
            modifiedText = match[2];
            
            // iterate through each of the modifiers in the first capture group
            match[1].split(reDelimiter).forEach(function(modifierKey) {
                // look for symbols or modifiers related to this match
                symbol = symbols[modifierKey];
                modifier = registry[modifierKey];
                modifierType = typeof modifier;
                
                if ((modifierType == 'object') && modifier.length) {
                    modifiedText = (modifier[0] || '') + modifiedText + (modifier[1] || '');
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
            });
            
            text = text.slice(0, match.index) + modifiedText + text.slice(match.index + match[0].length);

            // update the match
            match = reModifier.exec(text);
        } // while

        return text;
    } // apply

    return {
        add: add,
        replace: replace
    };
})();
    
// adapted from: https://github.com/sidelab/cog/blob/master/cogs/stringtools.js
function _createFormatter(format) {
    var matches = format.match(reFormatHolders),
        regexes = [],
        regexCount = 0,
        ii;
        
    // iterate through the matches
    for (ii = matches ? matches.length : 0; ii--; ) {
        var argIndex = matches[ii].slice(1);
        
        if (! regexes[argIndex]) {
            regexes[argIndex] = new RegExp('\\{' + argIndex + '\\}', 'g');
        } // if
    } // for
    
    // update the regex count
    regexCount = regexes.length;
    
    return formatters[format] = function() {
        var output = format;
        
        for (ii = 0; ii < regexCount; ii++) {
            var argValue = arguments[ii];
            if (typeof argValue == 'undefined') {
                argValue = '';
            } // if
            
            output = output.replace(regexes[ii], argValue);
        } // for
        
        return output;
    };
} // _formatter

function out(format) {
    // if we have a format provided, then get the formatter and generate the output
    if (format) {
        var formatter = formatters[format] || _createFormatter(modifiers.replace(format)), 
            output = formatter.apply(null, Array.prototype.slice.call(arguments, 1));

        // write the output to stdout
        for (var ii = _targets.length; ii--; ) {
            _targets[ii].write(output + out.end);
        }

        // return the output so we can test as required
        return output;
    }
    else {
        return modifiers;
    } // if..else
} // out

// define what will be appended to the end of each write statement
out.end = '\n';

// add an error helper
out.error = function(text) {
    out('!{red}{0}', text);
};

out.to = function(targets) {
    // reset the targets
    _targets = [];

    // if the targets aren't an array, then convert to one
    if (! Array.isArray(targets)) {
        targets = [targets];
    }
    
    // iterate through the targets and add valid targets to the _targets array
    targets.forEach(function(target) {
        if (target && typeof target.write == 'function') {
            _targets.push(target);
        }
    });
};

module.exports = out;