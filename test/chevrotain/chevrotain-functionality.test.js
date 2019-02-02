var { parse } = require('./json');
var _ = require('lodash')


test('parse basic select', () => {
  var result = parse('{ "test": "first"rest" }')
  const { cst, lexErrors, parseErrors } = result
  // console.log(result)
  expect(lexErrors).toHaveLength(1)
  expect(_.get(lexErrors, '[0].message')).toContain('unexpected character:')
  // expect(parseErrors.length).toBe(0)
});
