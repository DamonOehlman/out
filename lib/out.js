var formatters = {},
    reFormatHolders = /\{(\d+)(?=\})/g;

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
    var formatter, output = '';
    
    // if we have a format provided, then get the formatter and generate the output
    if (format) {
        formatter = formatters[format] || createFormatter(format);
        output = formatter.apply(null, Array.prototype.slice.call(arguments, 1));
    } // if
        
    // write the output to stdout
    process.stdout.write(output + '\n');
    
    // return the output so we can test as required
    return output;
};