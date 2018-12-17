const modifiers = require('../modifiers');
const test = require('tape');

test('can replace !{green} with the appropriate return code', (t) => {
  t.plan(1);
  t.equal(modifiers.replace('!{green}foo'), '\0\x1B[32mfoo\0\x1B[39m');
});

test('can replace !{bold} with the appropriate return code', (t) => {
  t.plan(1);
  t.equal(modifiers.replace('!{bold}foo'), '\0\x1B[1mfoo\0\x1B[22m');
});

test('can insert unicode characters where requested', (t) => {
  t.plan(1);
  t.equal(modifiers.replace('!{tick}'), '✓');
});

test('can replace multiple segments as appropriate', (t) => {
  t.plan(1);
  t.equal(modifiers.replace('!{green}foo!{bold}bar'), '\0\x1B[32mfoo\0\x1B[39m\0\x1B[1mbar\0\x1B[22m');
});

test('can combine multiple modifier with | syntax', (t) => {
  t.plan(1);
  t.equal(modifiers.replace('!{tick|green}'), '\0\x1B[32m✓\0\x1B[39m');
});

test('unknown modifiers are stripped from the string', (t) => {
  t.plan(1);
  t.equal(modifiers.replace('!{unknown}foo'), 'foo');
});
