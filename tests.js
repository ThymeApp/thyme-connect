const test = require('tape');
const thymeConnect = require('./main');

test('Test before available', (t) => {
  global.window = {};

  t.plan(3);

  thymeConnect.registerComponent('first', 'second', 'third');

  thymeConnect.invoke('registerComponent', (first, second, third) => {
    t.equal(first, 'first');
    t.equal(second, 'second');
    t.equal(third, 'third');
  });
});

test('Test after available', (t) => {
  global.window = {};

  t.plan(3);

  thymeConnect.invoke('registerComponent', (first, second, third) => {
    t.equal(first, 'first');
    t.equal(second, 'second');
    t.equal(third, 'third');
  });

  thymeConnect.registerComponent('first', 'second', 'third');
});
