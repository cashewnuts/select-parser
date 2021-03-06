var { parse } = require('../dist/select-parser');
var _ = require('lodash')

describe('INDEX', () => {

  describe('Normal parse', () => {
    describe('SELECT and FROM clause', () => {
      test('parse basic select', () => {
        var result = parse('SELECT * FROM test')
        const { cst, lexErrors, parseErrors } = result
        expect(lexErrors).toHaveLength(0)
        expect(parseErrors).toHaveLength(0)
      });
      
      test('parse table name is wrapped with []', () => {
        var result = parse('SELECT * FROM [test]')
        // console.log(result)
        const { cst, lexErrors, parseErrors } = result
        expect(lexErrors).toHaveLength(0)
        expect(parseErrors).toHaveLength(0)
      })
      
      test('parse even table name starts with number', () => {
        var result = parse('SELECT * FROM 0test')
        // console.log(result)
        const { cst, lexErrors, parseErrors } = result
        expect(lexErrors).toHaveLength(0)
        expect(parseErrors).toHaveLength(0)
      })

      test('parse even table name is quated keyword (" or `)', () => {
        var result = parse('SELECT * FROM "from"')
        var { cst, lexErrors, parseErrors } = result
        expect(lexErrors).toHaveLength(0)
        expect(parseErrors).toHaveLength(0)
        var result = parse('SELECT * FROM `from`')
        var { cst, lexErrors, parseErrors } = result
        expect(lexErrors).toHaveLength(0)
        expect(parseErrors).toHaveLength(0)
      })
    })

    describe('WHERE clause', () => {
      test('parse where has parentheses expression', () => {
        var result = parse("SELECT * FROM x WHERE (test = '1')")
        const { cst, lexErrors, parseErrors } = result
        expect(lexErrors).toHaveLength(0)
        expect(parseErrors).toHaveLength(0)
      })
    
      test('parse where has parentheses + or + and expression', () => {
        var result = parse("SELECT * from x WHERE (test = '1') or (test2 = '2') and (test3 = '3')")
        const { cst, lexErrors, parseErrors } = result
        expect(lexErrors).toHaveLength(0)
        expect(parseErrors).toHaveLength(0)
      })
    
      test('parse nested expression in where clause', () => {
        var result = parse("SELECT * from x WHERE ((((test = '1') or (test2 = '2')) and (test3 = '3')) or (test4 = 4) and (test5 = 5)) and (test6 = 6)")
        const { cst, lexErrors, parseErrors } = result
        expect(lexErrors).toHaveLength(0)
        expect(parseErrors).toHaveLength(0)
      })
    })


    describe('With clause', () => {
      test('parse standard with clause', () => {
        var result = parse(`
          WITH temporaryTable(averageValue) as
            (SELECT avg(Salary)
            from Employee) 
                SELECT EmployeeID,Name, Salary 
                FROM Employee, temporaryTable 
                WHERE Employee.Salary > temporaryTable.averageValue;
        `)
        const { cst, lexErrors, parseErrors } = result
        expect(lexErrors).toHaveLength(0)
        expect(parseErrors).toHaveLength(0)
      })
      
    })
  })

// Test for error
  describe('Error', () => {
    /** test Identifier */
    test('error table name contains one double quote', () => {
      var result = parse('SELECT * from "start"rest"')
      const { cst, lexErrors, parseErrors } = result
      expect(_.get(lexErrors, '[0].message')).toContain('unexpected character:')
      expect(parseErrors).toHaveLength(0)
    })
    
    test('error from clause does not exists', () => {
      var result = parse('SELECT *')
      const { cst, lexErrors, parseErrors } = result
      expect(lexErrors).toHaveLength(0)
      expect(_.get(parseErrors, '[0].name')).toBe('MismatchedTokenException')
    })
    
    test('error when table name is keyword', () => {
      var result = parse('SELECT * FROM from')
      const { cst, lexErrors, parseErrors } = result
      expect(lexErrors).toHaveLength(0)
      expect(parseErrors).toHaveLength(1)
    })

    test('error when table join with comma and has on clause', () => {
      var result = parse('SELECT * FROM x, y on x.id = y.id')
      const { cst, lexErrors, parseErrors } = result
      expect(lexErrors).toHaveLength(0)
      expect(parseErrors).toHaveLength(1)
    })
  })
})
