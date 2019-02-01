var parse = require('../dist/select-sqlite-parser');


test('adds 1 + 2 to equal 3', () => {
  var result = parse('SELECT * from x')
  console.log(result)
  expect((1 * 3).length).toBe(3);
});