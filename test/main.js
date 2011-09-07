var vows = require('vows'),
    assert = require('assert'),
    fs = require('fs'),
    path = require('path'),
    out = require('../lib/out'),
    samplePath = path.resolve(__dirname, 'samples');
        
var suite = vows.describe('Out Tests'),
    batch = {
        topic: undefined
    };
    
function createTest(sample) {
    return function() {
        var args = [].concat(sample.args);
        
        // ensure we have input and output
        assert.ok(sample.input, 'Sample has input');
        assert.ok(sample.output, 'Sample has output');
        
        // put the input into the args
        args.unshift(sample.input);
        
        // run out and check the output matches the expected
        assert.equal(out.apply(null, args), sample.output);
    };
}

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