var { parse, SelectLexer } = require('../dist/select-parser');
var _ = require('lodash')

describe('LEXER', () => {

  describe('Normal lexer', () => {
    test('TEST Identifier', () => {
      const checkText = 'test 01234 fromM FROMm Hello world "te""st" `te``st`'
      const { tokens } = SelectLexer.tokenize(checkText)
      tokens.forEach((v, i) => {
        expect(_.get(v, 'tokenType.tokenName')).toBe('Identifier')
      })
    })

    test('TEST all of keywords', () => {
      const keywordTokens = [
        'ABORT', 'ACTION', 'ADD', 'AFTER', 'ALL', 'ALTER', 'ANALYZE', 'AND', 'ASC', 'AS',
        'ATTACH', 'AUTOINCREMENT', 'BEFORE', 'BEGIN', 'BETWEEN', 'BY', 'CASCADE', 'CASE', 'CAST',
        'CHECK', 'COLLATE', 'COLUMN', 'COMMIT', 'CONFLICT', 'CONSTRAINT', 'CREATE', 'CROSS',
        'CURRENT_DATE', 'CURRENT_TIMESTAMP', 'CURRENT_TIME', 'DATABASE', 'DEFAULT', 'DEFERRABLE', 'DEFERRED', 'DELETE',
        'DESC', 'DETACH', 'DISTINCT', 'DROP', 'EACH', 'ELSE', 'END', 'ESCAPE', 'EXCEPT', 'EXCLUSIVE',
        'EXISTS', 'EXPLAIN', 'FAIL', 'FOREIGN', 'FOR', 'FROM', 'FULL', 'GLOB', 'GROUP', 'HAVING', 'IF',
        'IGNORE', 'IMMEDIATE', 'INTO', 'INSTEAD', 'INTERSECT', 'INSERT', 'INNER', 'INITIALLY', 'INDEXED', 'INDEX', 'IN',
        'ISNULL', 'IS', 'JOIN', 'KEY', 'LEFT', 'LIKE', 'LIMIT', 'MATCH', 'NATURAL', 'NOTNULL', 'NOT', 'NO',
        'NULL', 'OFFSET', 'OF', 'ON', 'ORDER', 'OR', 'OUTER', 'PLAN', 'PRAGMA', 'PRIMARY', 'QUERY', 'RAISE', 'RECURSIVE',
        'REFERENCES', 'REGEXP', 'REINDEX', 'RELEASE', 'RENAME', 'REPLACE', 'RESTRICT', 'RIGHT', 'ROLLBACK', 'ROW', 'SAVEPOINT',
        'SELECT', 'SET', 'TABLE', 'TEMPORARY', 'TEMP', 'THEN', 'TO', 'TRANSACTION', 'TRIGGER', 'UNION', 'UNIQUE', 'UPDATE',
        'USING', 'VACUUM', 'VALUES', 'VIEW', 'VIRTUAL', 'WHEN', 'WHERE', 'WITHOUT', 'WITH',
      ]
      const { tokens } = SelectLexer.tokenize(keywordTokens.join(' '))
      tokens.forEach((v, i) => {
        expect(_.get(v, 'tokenType.tokenName')).toBe(keywordTokens[i])
        expect(_.get(v, 'tokenType.CATEGORIES[0].tokenName')).toBe('Keyword')
      })
    })
  })
})
