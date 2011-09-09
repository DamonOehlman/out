var formatters = {},
    reFormatHolders = /\{(\d+)(?=\})/g,
    reModifier = /\!\{(.*?)\}(.*?)(?=(\!\{|$))/;
    
var modifiers = (function() {
    // internals
    
    var registry = {
        'test':       ['<', '>'],
        
        // from: https://github.com/Marak/colors.js/blob/master/colors.js
        // kudos to: https://twitter.com/#!/maraksquires
        'bold'      : ['\033[1m',  '\033[22m'],
        'italic'    : ['\033[3m',  '\033[23m'],
        'underline' : ['\033[4m',  '\033[24m'],
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
    };
    
    // exports
    
    function add(modifier, replacement) {
        registry[modifier] = replacement;
    } // add

    function replace(text) {
        // find and replace modifiers
        var match = reModifier.exec(text),
            modifier,
            modifiedText,
            modifierType;
            
        while (match) {
            // look for the modifier related to this match
            modifier = registry[match[1]];
            modifierType = typeof modifier;
            
            if ((modifierType == 'object') && modifier.length) {
                modifiedText = (modifier[0] || '') + match[2] + (modifier[1] || '');
            }
            else if (modifierType == 'function') {
                modifiedText = modifier(match[2], match[1]);
            }
            else {
                modifiedText = (modifier || '') + match[2];
            } // if..else
            
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
function createFormatter(format) {
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

module.exports = function(format) {
    // if we have a format provided, then get the formatter and generate the output
    if (format) {
        var formatter = formatters[format] || createFormatter(modifiers.replace(format)), 
            output = formatter.apply(null, Array.prototype.slice.call(arguments, 1));

        // write the output to stdout
        process.stdout.write(output + '\n');

        // return the output so we can test as required
        return output;    
    }
    else {
        return modifiers;
    } // if..else
};