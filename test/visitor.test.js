var { parse, SelectVisitor } = require('../dist/index')

const visitor = new SelectVisitor()

const logger = {}
logger.log = function(info) {
  const [position, line, column] = /\(.*:([\w\d/.-]+):([\d]+)\)/.exec(new Error().stack.split('\n')[2])
  console.log(position)
  console.log(JSON.stringify(info, null, 1))
}

describe('VISITOR', () => {

  describe('TEST columns', () => {
    test('multiple columns', () => {
      var result = parse('SELECT a, b, c, d, e FROM x')
      const { cst, lexErrors, parseErrors } = result
      const ast = visitor.visit(cst)
      // TODO check logic
      logger.log(ast)
    })
  })

  describe('TEST join', () => {
    test('simple joins', () => {
      var result = parse('SELECT * FROM x, y')
      const { cst, lexErrors, parseErrors } = result
      const ast = visitor.visit(cst)
      // TODO check logic
      logger.log(ast)
    })
    test('multiple joins', () => {
      var result = parse('SELECT * FROM x, y, z')
      const { cst, lexErrors, parseErrors } = result
      const ast = visitor.visit(cst)
      // TODO check logic
      logger.log(ast)
    })
    test('multiple joins with one constraint', () => {
      var result = parse('SELECT * FROM x JOIN y ON x.id = y.id , z')
      const { cst, lexErrors, parseErrors } = result
      const ast = visitor.visit(cst)
      // TODO check logic
      logger.log(ast)
    })
  })

  describe('TEST expr', () => {
    test('compare1 Assign', () => {
      var result = parse("SELECT * FROM x WHERE test = '1'")
      const { cst, lexErrors, parseErrors } = result
      const ast = visitor.visit(cst)
      // TODO check logic
      logger.log(ast)
    })
    test('parenthasis expr', () => {
      var result = parse("SELECT * FROM x WHERE (test = '1')")
      const { cst, lexErrors, parseErrors } = result
      const ast = visitor.visit(cst)
      // TODO check logic
      // logger.log(ast)
    })
  })

  test('visit multiple sql_stmt', () => {
    var result = parse("SELECT * FROM x; SELECT * FROM y;")
    const { cst, lexErrors, parseErrors } = result
    const ast = visitor.visit(cst)
    // TODO check logic
    // logger.log(ast)
  })
  test('visit compond select_stmt', () => {
    var result = parse("SELECT * FROM x UNION ALL SELECT * FROM y;")
    const { cst, lexErrors, parseErrors } = result
    const ast = visitor.visit(cst)
    // TODO check logic
    // logger.log(ast)
  })
  test('visit select_core with distinct', () => {
    var result = parse("SELECT DISTINCT * FROM x;")
    const { cst, lexErrors, parseErrors } = result
    const ast = visitor.visit(cst)
    // TODO check logic
    // logger.log(ast)
  })
  test('visit ordering select_stmt', () => {
    var result = parse("SELECT * FROM x ORDER BY col1;")
    const { cst, lexErrors, parseErrors } = result
    const ast = visitor.visit(cst)
    // TODO check logic
    // logger.log(ast)
  })
  test('visit limiting select_stmt', () => {
    var result = parse("SELECT * FROM x LIMIT 10;")
    var { cst, lexErrors, parseErrors } = result
    var ast = visitor.visit(cst)
    // TODO check logic
    // logger.log(ast)
    var result = parse("SELECT * FROM x LIMIT 10 OFFSET 20;")
    var { cst, lexErrors, parseErrors } = result
    var ast = visitor.visit(cst)
    // TODO check logic
  })
})