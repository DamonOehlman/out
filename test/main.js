var vows = require('vows'),
    assert = require('assert'),
    fs = require('fs'),
    path = require('path'),
    out = require('../'),
    samplePath = path.resolve(__dirname, 'samples');
        
var suite = vows.describe('Out Tests'),
    batch = {
        topic: undefined
    };
    
function createTest(sample) {
    // replace sample output #[ placeholders with the correct text
    sample.output = sample.output.replace(/\#\[/g, '\0\x1B[');
    
    return function() {
        // ensure we have input and output
        assert.ok(sample.input, 'Sample has input');
        assert.ok(sample.output, 'Sample has output');
        
        // run out and check the output matches the expected
        assert.equal(out.apply(null, [sample.input].concat(sample.args)), sample.output);
    };
}

// set out to write to nothing
out.to(null);

// read the files in the samples directory and load into the suite
fs.readdir(samplePath, function(err, files) {
    var filesToRead = files.length;
    
    files.forEach(function(file) {
        fs.readFile(path.join(samplePath, file), function(openErr, data) {
            var config = JSON.parse(data);
            
            batch[path.basename(file, '.json')] = createTest(config);
            
            // decrease the number of files to read
            filesToRead--;
            
            // if we have no more files to read, then add the batch and run
            if (filesToRead <= 0) {
                suite.addBatch({
                    'Samples': batch
                }).run();
            };
        });
    });
});