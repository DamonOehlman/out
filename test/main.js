const test = require('tape');
const fs = require('fs');
const path = require('path');
const out = require('..');
const samplePath = path.resolve(__dirname, 'samples');

// set out to write to nothing
out.to(null);

test('validate files', (suite) => {
  fs.readdir(samplePath, (err, files) => {
    if (err) {
      suite.error(err);
      return;
    }

    files.forEach((file, index) => {
      const sample = require(path.join(samplePath, file));
      const expectedOutput = sample.output.replace(/\#\[/g, '\0\x1B[');
      suite.test(file, (t) => {
        t.plan(1);
        t.equal(out(sample.input, ...sample.args || []), expectedOutput);
      });
    });
  });
});
