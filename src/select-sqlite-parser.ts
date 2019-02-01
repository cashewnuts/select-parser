//
import {
  createToken,
  Lexer,
  Parser,
  IToken,
  ILexingError,
  IRecognitionException
} from "chevrotain"

import XRegExp from 'xregexp'

const fragments: any = {}

// A utility to create re-usable fragments using xRegExp
function FRAGMENT(name: string, def: string | RegExp) {
  const _def = def instanceof RegExp ? def.toString() : def
  fragments[name] = XRegExp.build(_def, fragments)
}

// a utility to create a pattern using previously defined fragments
function MAKE_PATTERN(def: string, flags?: string) {
  return XRegExp.build(def, fragments, flags)
}

// define fragments
FRAGMENT("DIGIT", "[0-9]")
FRAGMENT("E", "[eE]")
// IDENTIFIERS
FRAGMENT("DQ_IDENTIFIER", "\"()*\"")
FRAGMENT("SQ_IDENTIFIER", "`(~`|``)*`")
FRAGMENT("WP_IDENTIFIER", "\[~\]*\]")
FRAGMENT("CHAR_IDENTIFIER", "[a-zA-Z_][a-zA-Z_0-9]*")
FRAGMENT("IDENTIFIER", MAKE_PATTERN("{{DQ_IDENTIFIER}}|{{SQ_IDENTIFIER}}|{{WP_IDENTIFIER}}|{{CHAR_IDENTIFIER}}"))
// NUMERICS
FRAGMENT("NORM_NUMERIC", MAKE_PATTERN("{{DIGIT}}+(\.{{DIGIT}})?({{E}}[-+]?{{DIGIT}}+)?"))
FRAGMENT("DOT_NUMERIC", MAKE_PATTERN("\.{{DIGIT}}+({{E}}[-+]?{{DIGIT}}+)?"))
FRAGMENT("STRING_LITERAL", "'(~'|'')*'")

const Scol = createToken({
  name: "Scol",
  pattern: ";",
})
const Dot = createToken({
  name: "Dot",
  pattern: ".",
})
const OpenPar = createToken({
  name: "OpenPar",
  pattern: "(",
})
const ClosePar = createToken({
  name: "ClosePar",
  pattern: ")",
})
const Comma = createToken({
  name: "Comma",
  pattern: ",",
})
const Assign = createToken({
  name: "Assign",
  pattern: "=",
})
const Star = createToken({
  name: "Star",
  pattern: "*",
})
const Plus = createToken({
  name: "Plus",
  pattern: "+",
})
const Minus = createToken({
  name: "Minus",
  pattern: "-",
})
const Tilde = createToken({
  name: "Tilde",
  pattern: "~",
})
const Pipe2 = createToken({
  name: "Pipe2",
  pattern: "||",
})
const Div = createToken({
  name: "Div",
  pattern: "/",
})
const Mod = createToken({
  name: "Mod",
  pattern: "%",
})
const Lt2 = createToken({
  name: "Lt2",
  pattern: "<<",
})
const Gt2 = createToken({
  name: "Gt2",
  pattern: ">>",
})
const Amp = createToken({
  name: "Amp",
  pattern: "&",
})
const Pipe = createToken({
  name: "Pipe",
  pattern: "|",
})
const Lt = createToken({
  name: "Lt",
  pattern: "<",
})
const LtEq = createToken({
  name: "LtEq",
  pattern: "<=",
})
const Gt = createToken({
  name: "Gt",
  pattern: ">",
})
const GtEq = createToken({
  name: "GtEq",
  pattern: ">=",
})
const Eq = createToken({
  name: "Eq",
  pattern: "==",
})
const NotEq1 = createToken({
  name: "NotEq1",
  pattern: "!=",
})
const NotEq2 = createToken({
  name: "NotEq2",
  pattern: "<>",
})
const NumericLiteral = createToken({
  name: "NumericLiteral",
  pattern: MAKE_PATTERN("{{NORM_NUMERIC}}|{{DOT_NUMERIC}}")
})
const Identifier = createToken({
  name: "Identifier",
  pattern: MAKE_PATTERN("{{IDENTIFIER}}")
})
const BindParameter = createToken({
  name: "BindParameter",
  pattern: MAKE_PATTERN("\\?{{DIGIT}}*|[:@$]{{IDENTIFIER}}"),
})
const StringLiteral = createToken({
  name: "StringLiteral",
  pattern: MAKE_PATTERN("{{STRING_LITERAL}}")
})
const BlobLiteral = createToken({
  name: "BlobLiteral",
  pattern: MAKE_PATTERN("[xX]{{STRING_LITERAL}}"),
})

const SinglelineComment = createToken({
  name: "SinglelineComment",
  pattern: /--~[\r\n]*/,
  group: "comments"
})
const MultilineComment = createToken({
  name: "MultilineComment",
  pattern: /\/\*.*?\*\//,
  group: "comments"
})
const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /[ \u000B\t\n\r]+/,
  group: Lexer.SKIPPED
})

const Keyword = createToken({
  name: "Keyword",
  pattern: Lexer.NA,
})

// http://www.sqlite.org/lang_keywords.html
const K_ABORT = createToken({ name: "K_ABORT", pattern: /abort/i, categories: [Keyword] })
const K_ACTION = createToken({ name: "K_ACTION", pattern: /action/i, categories: [Keyword] })
const K_ADD = createToken({ name: "K_ADD", pattern: /add/i, categories: [Keyword] })
const K_AFTER = createToken({ name: "K_AFTER", pattern: /after/i, categories: [Keyword] })
const K_ALL = createToken({ name: "K_ALL", pattern: /all/i, categories: [Keyword] })
const K_ALTER = createToken({ name: "K_ALTER", pattern: /alter/i, categories: [Keyword] })
const K_ANALYZE = createToken({ name: "K_ANALYZE", pattern: /analyze/i, categories: [Keyword] })
const K_AND = createToken({ name: "K_AND", pattern: /and/i, categories: [Keyword] })
const K_AS = createToken({ name: "K_AS", pattern: /as/i, categories: [Keyword] })
const K_ASC = createToken({ name: "K_ASC", pattern: /asc/i, categories: [Keyword] })
const K_ATTACH = createToken({ name: "K_ATTACH", pattern: /attach/i, categories: [Keyword] })
const K_AUTOINCREMENT = createToken({ name: "K_AUTOINCREMENT", pattern: /autoincrement/i, categories: [Keyword] })
const K_BEFORE = createToken({ name: "K_BEFORE", pattern: /before/i, categories: [Keyword] })
const K_BEGIN = createToken({ name: "K_BEGIN", pattern: /begin/i, categories: [Keyword] })
const K_BETWEEN = createToken({ name: "K_BETWEEN", pattern: /between/i, categories: [Keyword] })
const K_BY = createToken({ name: "K_BY", pattern: /by/i, categories: [Keyword] })
const K_CASCADE = createToken({ name: "K_CASCADE", pattern: /cascade/i, categories: [Keyword] })
const K_CASE = createToken({ name: "K_CASE", pattern: /case/i, categories: [Keyword] })
const K_CAST = createToken({ name: "K_CAST", pattern: /cast/i, categories: [Keyword] })
const K_CHECK = createToken({ name: "K_CHECK", pattern: /check/i, categories: [Keyword] })
const K_COLLATE = createToken({ name: "K_COLLATE", pattern: /collate/i, categories: [Keyword] })
const K_COLUMN = createToken({ name: "K_COLUMN", pattern: /column/i, categories: [Keyword] })
const K_COMMIT = createToken({ name: "K_COMMIT", pattern: /commit/i, categories: [Keyword] })
const K_CONFLICT = createToken({ name: "K_CONFLICT", pattern: /conflict/i, categories: [Keyword] })
const K_CONSTRAINT = createToken({ name: "K_CONSTRAINT", pattern: /constraint/i, categories: [Keyword] })
const K_CREATE = createToken({ name: "K_CREATE", pattern: /create/i, categories: [Keyword] })
const K_CROSS = createToken({ name: "K_CROSS", pattern: /cross/i, categories: [Keyword] })
const K_CURRENT_DATE = createToken({ name: "K_CURRENT_DATE", pattern: /current_date/i, categories: [Keyword] })
const K_CURRENT_TIME = createToken({ name: "K_CURRENT_TIME", pattern: /current_time/i, categories: [Keyword] })
const K_CURRENT_TIMESTAMP = createToken({ name: "K_CURRENT_TIMESTAMP", pattern: /current_timestamp/i, categories: [Keyword] })
const K_DATABASE = createToken({ name: "K_DATABASE", pattern: /database/i, categories: [Keyword] })
const K_DEFAULT = createToken({ name: "K_DEFAULT", pattern: /default/i, categories: [Keyword] })
const K_DEFERRABLE = createToken({ name: "K_DEFERRABLE", pattern: /deferrable/i, categories: [Keyword] })
const K_DEFERRED = createToken({ name: "K_DEFERRED", pattern: /deferred/i, categories: [Keyword] })
const K_DELETE = createToken({ name: "K_DELETE", pattern: /delete/i, categories: [Keyword] })
const K_DESC = createToken({ name: "K_DESC", pattern: /desc/i, categories: [Keyword] })
const K_DETACH = createToken({ name: "K_DETACH", pattern: /detach/i, categories: [Keyword] })
const K_DISTINCT = createToken({ name: "K_DISTINCT", pattern: /distinct/i, categories: [Keyword] })
const K_DROP = createToken({ name: "K_DROP", pattern: /drop/i, categories: [Keyword] })
const K_EACH = createToken({ name: "K_EACH", pattern: /each/i, categories: [Keyword] })
const K_ELSE = createToken({ name: "K_ELSE", pattern: /else/i, categories: [Keyword] })
const K_END = createToken({ name: "K_END", pattern: /end/i, categories: [Keyword] })
const K_ESCAPE = createToken({ name: "K_ESCAPE", pattern: /escape/i, categories: [Keyword] })
const K_EXCEPT = createToken({ name: "K_EXCEPT", pattern: /except/i, categories: [Keyword] })
const K_EXCLUSIVE = createToken({ name: "K_EXCLUSIVE", pattern: /exclusive/i, categories: [Keyword] })
const K_EXISTS = createToken({ name: "K_EXISTS", pattern: /exists/i, categories: [Keyword] })
const K_EXPLAIN = createToken({ name: "K_EXPLAIN", pattern: /explain/i, categories: [Keyword] })
const K_FAIL = createToken({ name: "K_FAIL", pattern: /fail/i, categories: [Keyword] })
const K_FOR = createToken({ name: "K_FOR", pattern: /for/i, categories: [Keyword] })
const K_FOREIGN = createToken({ name: "K_FOREIGN", pattern: /foreign/i, categories: [Keyword] })
const K_FROM = createToken({ name: "K_FROM", pattern: /from/i, categories: [Keyword] })
const K_FULL = createToken({ name: "K_FULL", pattern: /full/i, categories: [Keyword] })
const K_GLOB = createToken({ name: "K_GLOB", pattern: /glob/i, categories: [Keyword] })
const K_GROUP = createToken({ name: "K_GROUP", pattern: /group/i, categories: [Keyword] })
const K_HAVING = createToken({ name: "K_HAVING", pattern: /having/i, categories: [Keyword] })
const K_IF = createToken({ name: "K_IF", pattern: /if/i, categories: [Keyword] })
const K_IGNORE = createToken({ name: "K_IGNORE", pattern: /ignore/i, categories: [Keyword] })
const K_IMMEDIATE = createToken({ name: "K_IMMEDIATE", pattern: /immediate/i, categories: [Keyword] })
const K_IN = createToken({ name: "K_IN", pattern: /in/i, categories: [Keyword] })
const K_INDEX = createToken({ name: "K_INDEX", pattern: /index/i, categories: [Keyword] })
const K_INDEXED = createToken({ name: "K_INDEXED", pattern: /indexed/i, categories: [Keyword] })
const K_INITIALLY = createToken({ name: "K_INITIALLY", pattern: /initially/i, categories: [Keyword] })
const K_INNER = createToken({ name: "K_INNER", pattern: /inner/i, categories: [Keyword] })
const K_INSERT = createToken({ name: "K_INSERT", pattern: /insert/i, categories: [Keyword] })
const K_INSTEAD = createToken({ name: "K_INSTEAD", pattern: /instead/i, categories: [Keyword] })
const K_INTERSECT = createToken({ name: "K_INTERSECT", pattern: /intersect/i, categories: [Keyword] })
const K_INTO = createToken({ name: "K_INTO", pattern: /into/i, categories: [Keyword] })
const K_IS = createToken({ name: "K_IS", pattern: /is/i, categories: [Keyword] })
const K_ISNULL = createToken({ name: "K_ISNULL", pattern: /isnull/i, categories: [Keyword] })
const K_JOIN = createToken({ name: "K_JOIN", pattern: /join/i, categories: [Keyword] })
const K_KEY = createToken({ name: "K_KEY", pattern: /key/i, categories: [Keyword] })
const K_LEFT = createToken({ name: "K_LEFT", pattern: /left/i, categories: [Keyword] })
const K_LIKE = createToken({ name: "K_LIKE", pattern: /like/i, categories: [Keyword] })
const K_LIMIT = createToken({ name: "K_LIMIT", pattern: /limit/i, categories: [Keyword] })
const K_MATCH = createToken({ name: "K_MATCH", pattern: /match/i, categories: [Keyword] })
const K_NATURAL = createToken({ name: "K_NATURAL", pattern: /natural/i, categories: [Keyword] })
const K_NO = createToken({ name: "K_NO", pattern: /no/i, categories: [Keyword] })
const K_NOT = createToken({ name: "K_NOT", pattern: /not/i, categories: [Keyword] })
const K_NOTNULL = createToken({ name: "K_NOTNULL", pattern: /notnull/i, categories: [Keyword] })
const K_NULL = createToken({ name: "K_NULL", pattern: /null/i, categories: [Keyword] })
const K_OF = createToken({ name: "K_OF", pattern: /of/i, categories: [Keyword] })
const K_OFFSET = createToken({ name: "K_OFFSET", pattern: /offset/i, categories: [Keyword] })
const K_ON = createToken({ name: "K_ON", pattern: /on/i, categories: [Keyword] })
const K_OR = createToken({ name: "K_OR", pattern: /or/i, categories: [Keyword] })
const K_ORDER = createToken({ name: "K_ORDER", pattern: /order/i, categories: [Keyword] })
const K_OUTER = createToken({ name: "K_OUTER", pattern: /outer/i, categories: [Keyword] })
const K_PLAN = createToken({ name: "K_PLAN", pattern: /plan/i, categories: [Keyword] })
const K_PRAGMA = createToken({ name: "K_PRAGMA", pattern: /pragma/i, categories: [Keyword] })
const K_PRIMARY = createToken({ name: "K_PRIMARY", pattern: /primary/i, categories: [Keyword] })
const K_QUERY = createToken({ name: "K_QUERY", pattern: /query/i, categories: [Keyword] })
const K_RAISE = createToken({ name: "K_RAISE", pattern: /raise/i, categories: [Keyword] })
const K_RECURSIVE = createToken({ name: "K_RECURSIVE", pattern: /recursive/i, categories: [Keyword] })
const K_REFERENCES = createToken({ name: "K_REFERENCES", pattern: /references/i, categories: [Keyword] })
const K_REGEXP = createToken({ name: "K_REGEXP", pattern: /regexp/i, categories: [Keyword] })
const K_REINDEX = createToken({ name: "K_REINDEX", pattern: /reindex/i, categories: [Keyword] })
const K_RELEASE = createToken({ name: "K_RELEASE", pattern: /release/i, categories: [Keyword] })
const K_RENAME = createToken({ name: "K_RENAME", pattern: /rename/i, categories: [Keyword] })
const K_REPLACE = createToken({ name: "K_REPLACE", pattern: /replace/i, categories: [Keyword] })
const K_RESTRICT = createToken({ name: "K_RESTRICT", pattern: /restrict/i, categories: [Keyword] })
const K_RIGHT = createToken({ name: "K_RIGHT", pattern: /right/i, categories: [Keyword] })
const K_ROLLBACK = createToken({ name: "K_ROLLBACK", pattern: /rollback/i, categories: [Keyword] })
const K_ROW = createToken({ name: "K_ROW", pattern: /row/i, categories: [Keyword] })
const K_SAVEPOINT = createToken({ name: "K_SAVEPOINT", pattern: /savepoint/i, categories: [Keyword] })
const K_SELECT = createToken({ name: "K_SELECT", pattern: /select/i, categories: [Keyword] })
const K_SET = createToken({ name: "K_SET", pattern: /set/i, categories: [Keyword] })
const K_TABLE = createToken({ name: "K_TABLE", pattern: /table/i, categories: [Keyword] })
const K_TEMP = createToken({ name: "K_TEMP", pattern: /temp/i, categories: [Keyword] })
const K_TEMPORARY = createToken({ name: "K_TEMPORARY", pattern: /temporary/i, categories: [Keyword] })
const K_THEN = createToken({ name: "K_THEN", pattern: /then/i, categories: [Keyword] })
const K_TO = createToken({ name: "K_TO", pattern: /to/i, categories: [Keyword] })
const K_TRANSACTION = createToken({ name: "K_TRANSACTION", pattern: /transaction/i, categories: [Keyword] })
const K_TRIGGER = createToken({ name: "K_TRIGGER", pattern: /trigger/i, categories: [Keyword] })
const K_UNION = createToken({ name: "K_UNION", pattern: /union/i, categories: [Keyword] })
const K_UNIQUE = createToken({ name: "K_UNIQUE", pattern: /unique/i, categories: [Keyword] })
const K_UPDATE = createToken({ name: "K_UPDATE", pattern: /update/i, categories: [Keyword] })
const K_USING = createToken({ name: "K_USING", pattern: /using/i, categories: [Keyword] })
const K_VACUUM = createToken({ name: "K_VACUUM", pattern: /vacuum/i, categories: [Keyword] })
const K_VALUES = createToken({ name: "K_VALUES", pattern: /values/i, categories: [Keyword] })
const K_VIEW = createToken({ name: "K_VIEW", pattern: /view/i, categories: [Keyword] })
const K_VIRTUAL = createToken({ name: "K_VIRTUAL", pattern: /virtual/i, categories: [Keyword] })
const K_WHEN = createToken({ name: "K_WHEN", pattern: /when/i, categories: [Keyword] })
const K_WHERE = createToken({ name: "K_WHERE", pattern: /where/i, categories: [Keyword] })
const K_WITH = createToken({ name: "K_WITH", pattern: /with/i, categories: [Keyword] })
const K_WITHOUT = createToken({ name: "K_WITHOUT", pattern: /without/i, categories: [Keyword] })

const keywordTokens = [
  K_ABORT, K_ACTION, K_ADD, K_AFTER, K_ALL,
  K_ALTER, K_ANALYZE, K_AND, K_ASC, K_AS,
  K_ATTACH, K_AUTOINCREMENT, K_BEFORE, K_BEGIN,
  K_BETWEEN, K_BY, K_CASCADE, K_CASE, K_CAST,
  K_CHECK, K_COLLATE, K_COLUMN, K_COMMIT,
  K_CONFLICT, K_CONSTRAINT, K_CREATE, K_CROSS,
  K_CURRENT_DATE, K_CURRENT_TIMESTAMP, K_CURRENT_TIME,
  K_DATABASE, K_DEFAULT, K_DEFERRABLE, K_DEFERRED, K_DELETE,
  K_DESC, K_DETACH, K_DISTINCT, K_DROP, K_EACH,
  K_ELSE, K_END, K_ESCAPE, K_EXCEPT, K_EXCLUSIVE,
  K_EXISTS, K_EXPLAIN, K_FAIL, K_FOREIGN, K_FOR,
  K_FROM, K_FULL, K_GLOB, K_GROUP, K_HAVING, K_IF,
  K_IGNORE, K_IMMEDIATE, K_INTO, K_INSTEAD, K_INTERSECT,
  K_INSERT, K_INNER, K_INITIALLY, K_INDEXED, K_INDEX, K_IN,
  K_ISNULL, K_IS, K_JOIN, K_KEY, K_LEFT, K_LIKE,
  K_LIMIT, K_MATCH, K_NATURAL, K_NOTNULL, K_NOT, K_NO,
  K_NULL, K_OFFSET, K_OF, K_ON, K_ORDER, K_OR, K_OUTER,
  K_PLAN, K_PRAGMA, K_PRIMARY, K_QUERY, K_RAISE, K_RECURSIVE,
  K_REFERENCES, K_REGEXP, K_REINDEX, K_RELEASE, K_RENAME,
  K_REPLACE, K_RESTRICT, K_RIGHT, K_ROLLBACK, K_ROW, K_SAVEPOINT,
  K_SELECT, K_SET, K_TABLE, K_TEMPORARY, K_TEMP, K_THEN,
  K_TO, K_TRANSACTION, K_TRIGGER, K_UNION, K_UNIQUE, K_UPDATE,
  K_USING, K_VACUUM, K_VALUES, K_VIEW, K_VIRTUAL,
  K_WHEN, K_WHERE, K_WITHOUT, K_WITH,
]

const allTokens = [
  WhiteSpace,
  // Chars
  Scol,
  Dot,
  OpenPar,
  ClosePar,
  Comma,
  Assign,
  Star,
  Plus,
  Minus,
  Tilde,
  Pipe2,
  Div,
  Mod,
  Lt2,
  Gt2,
  Amp,
  Pipe,
  Lt,
  LtEq,
  Gt,
  GtEq,
  Eq,
  NotEq1,
  NotEq2,
  // Literals
  NumericLiteral,
  Identifier,
  BindParameter,
  StringLiteral,
  BlobLiteral,
  // Commentings
  SinglelineComment,
  MultilineComment,
  // Keywords
  ...keywordTokens,
  Keyword,
]
const JsonLexer = new Lexer(allTokens)

class SelectSqlParser extends Parser {
  constructor() {
    super(allTokens)
    this.performSelfAnalysis()
  }

  // In TypeScript the parsing rules are explicitly defined as class instance properties
  // This allows for using access control (public/private/protected) and more importantly "informs" the TypeScript compiler
  // about the API of our Parser, so referencing an invalid rule name (this.SUBRULE(this.oopsType);)
  // is now a TypeScript compilation error.
  public sql_stmt = this.RULE("sql_stmt", () => {
    this.OR([
      // using ES6 Arrow functions to reduce verbosity.
      { ALT: () => this.SUBRULE(this.compound_select_stmt) },
      { ALT: () => this.SUBRULE(this.factored_select_stmt) },
      { ALT: () => this.SUBRULE(this.simple_select_stmt) },
      { ALT: () => this.SUBRULE(this.select_stmt) },
    ])
  })

  /**
   * Compound select statement
   */
  private compound_select_stmt = this.RULE("compound_select_stmt", () => {
    this.OPTION(() => this.SUBRULE(this.with_clause))

    // Two or more
    this.SUBRULE(this.select_core)
    this.AT_LEAST_ONE(() => {
      this.SUBRULE(this.compound_operator)
      this.SUBRULE2(this.select_core)
    })

    this.OPTION2(() => { // Order
      this.CONSUME(K_ORDER)
      this.CONSUME(K_BY)
      this.AT_LEAST_ONE_SEP({
        SEP: Comma,
        DEF: () => this.SUBRULE(this.ordering_term)
      })
    })
    this.OPTION3(() => { // Limit
      this.CONSUME(K_LIMIT)
      this.SUBRULE(this.expr)
      this.OPTION4(() => {
        this.OR([
          { ALT: () => this.CONSUME(K_OFFSET) },
          { ALT: () => this.CONSUME(Comma) },
        ])
      })
      this.SUBRULE2(this.expr)
    })
  })

  /**
   * Factored select statement
   * one or more
   */
  private factored_select_stmt = this.RULE("factored_select_stmt", () => {
    this.OPTION(() => this.SUBRULE(this.with_clause))

    // At least one select_core
    this.SUBRULE(this.select_core)
    this.MANY(() => {
      this.SUBRULE(this.compound_operator)
      this.SUBRULE1(this.select_core)
    })

    this.OPTION2(() => { // Order
      this.CONSUME(K_ORDER)
      this.CONSUME(K_BY)
      this.AT_LEAST_ONE_SEP({
        SEP: Comma,
        DEF: () => this.SUBRULE(this.ordering_term)
      })
    })
    this.OPTION3(() => { // Limit
      this.CONSUME(K_LIMIT)
      this.SUBRULE(this.expr)
      this.OPTION4(() => {
        this.OR([
          { ALT: () => this.CONSUME(K_OFFSET) },
          { ALT: () => this.CONSUME(Comma) },
        ])
      })
      this.SUBRULE1(this.expr)
    })
  })

  /**
   * Simple select statement
   */
  private simple_select_stmt = this.RULE("simple_select_stmt", () => {
    this.OPTION(() => this.SUBRULE(this.with_clause))
    this.SUBRULE(this.select_core)
    this.OPTION2(() => { // Order
      this.CONSUME(K_ORDER)
      this.CONSUME(K_BY)
      this.AT_LEAST_ONE_SEP({
        SEP: Comma,
        DEF: () => this.SUBRULE(this.ordering_term)
      })
    })
    this.OPTION3(() => { // Limit
      this.CONSUME(K_LIMIT)
      this.SUBRULE(this.expr)
      this.OPTION4(() => {
        this.OR([
          { ALT: () => this.CONSUME(K_OFFSET) },
          { ALT: () => this.CONSUME(Comma) },
        ])
      })
      this.SUBRULE1(this.expr)
    })
  })

  /**
   * Select statement
   */
  private select_stmt = this.RULE("select_stmt", () => {
    this.OPTION(() => this.SUBRULE(this.with_clause))
    this.SUBRULE(this.select_core)
    this.MANY(() => {
      this.SUBRULE(this.compound_operator)
      this.SUBRULE2(this.select_core)
    })
    this.OPTION2(() => { // K_ORDER
      this.CONSUME(K_ORDER)
      this.CONSUME(K_BY)
      this.AT_LEAST_ONE_SEP({
        SEP: Comma,
        DEF: () => this.SUBRULE(this.ordering_term)
      })
    })
    this.OPTION3(() => { // K_LIMIT
      this.CONSUME(K_LIMIT)
      this.SUBRULE(this.expr)
      this.OPTION4(() => {
        this.OR([
          { ALT: () => this.CONSUME(K_OFFSET) },
          { ALT: () => this.CONSUME(Comma) },
        ])
        this.SUBRULE1(this.expr)
      })
    })
  })

  /**
   * Select core
   */
  private select_core = this.RULE("select_core", () => {
    this.OR([
      { ALT: () => {
        this.CONSUME(K_SELECT)
        this.OPTION(() => {
          this.OR1([
            { ALT: () => this.CONSUME(K_DISTINCT) },
            { ALT: () => this.CONSUME(K_ALL) },
          ])
        })
        this.AT_LEAST_ONE_SEP({
          SEP: Comma,
          DEF: () => this.SUBRULE(this.result_column)
        })
        this.OPTION2(() => { // K_FROM
          this.CONSUME(K_FROM)
          this.OR2([
            { ALT: () => {
              this.AT_LEAST_ONE_SEP1({
                SEP: Comma,
                DEF: () => this.SUBRULE(this.table_or_subquery)
              })
            }},
            { ALT: () => this.SUBRULE(this.join_clause)}
          ])
        })
        this.OPTION3(() => { // K_WHERE
          this.CONSUME(K_WHERE)
          this.SUBRULE(this.expr)
        })
        this.OPTION4(() => { // K_GROUP
          this.CONSUME(K_GROUP)
          this.CONSUME1(K_BY)
          this.AT_LEAST_ONE_SEP2({
            SEP: Comma,
            DEF: this.SUBRULE1(this.expr),
          })
          this.OPTION5(() => { // Having
            this.CONSUME(K_HAVING)
            this.SUBRULE2(this.expr)
          })
        })
      }},
      { ALT: () => {
        this.CONSUME(K_VALUES)
        this.CONSUME(OpenPar)
        this.AT_LEAST_ONE_SEP3({
          SEP: Comma,
          DEF: () => this.SUBRULE3(this.expr)
        })
        this.CONSUME(ClosePar)
        this.OPTION6(() => {
          this.CONSUME(Comma)
          this.CONSUME1(OpenPar)
          this.AT_LEAST_ONE_SEP4({
            SEP: Comma,
            DEF: () => this.SUBRULE4(this.expr)
          })
          this.CONSUME1(ClosePar)
        })
      }}
    ])
  })

  /**
   * Type name
   */
  private type_name = this.RULE("type_name", () => {
    this.AT_LEAST_ONE(this.name)
    this.OPTION(() => {
      this.CONSUME(OpenPar)
      this.MANY_SEP({
        SEP: Comma,
        DEF: () => this.SUBRULE(this.signed_number)
      })
      this.CONSUME(ClosePar)
    })
  })

  // TODO
  private expr = this.RULE("expr", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.literal_value) },
      { ALT: () => this.CONSUME(BindParameter) },
      { ALT: () => {
        this.OPTION(() => {
          this.OPTION2(() => {
            this.SUBRULE(this.database_name)
            this.CONSUME(Dot)
          })
          this.SUBRULE(this.table_name)
          this.CONSUME1(Dot)
        })
        this.SUBRULE(this.column_name)
      }},
      { ALT: () => {
        this.SUBRULE(this.unary_operator)
        this.SUBRULE(this.expr)
      }},
      { ALT: () => { // expr '||' expr
        this.SUBRULE(this.pipe_expr)
      }},
      { ALT: () => { // expr ( '*' | '/' | '%' ) expr
        this.SUBRULE(this.math1_expr)
      }},
      { ALT: () => { // expr ( '+' | '-' ) expr
        this.SUBRULE(this.math2_expr)
      }},
      { ALT: () => { // expr ( '<<' | '>>' | '&' | '|' ) expr
        this.SUBRULE(this.binary_expr)
      }},
      { ALT: () => { // expr ( '=' | '==' | '!=' | '<>' | K_IS | K_IS K_NOT | K_IN | K_LIKE | K_GLOB | K_MATCH | K_REGEXP) expr
        this.SUBRULE(this.syntax_expr)
      }},
      { ALT: () => {
        this.SUBRULE1(this.expr)
        this.CONSUME(K_AND)
        this.SUBRULE2(this.expr)
      }},
      { ALT: () => {
        this.SUBRULE3(this.expr)
        this.CONSUME(K_OR)
        this.SUBRULE4(this.expr)
      }},
      // NOT IMPLEMENT: function_name '(' ( K_DISTINCT? expr ( ',' expr )* | '*' )? ')'
      { ALT: () => {
        this.CONSUME(OpenPar)
        this.SUBRULE5(this.expr)
        this.CONSUME(ClosePar)
      }},
      { ALT: () => {
        this.CONSUME(K_CAST)
        this.CONSUME1(OpenPar)
        this.SUBRULE6(this.expr)
        this.CONSUME(K_AS)
        this.SUBRULE(this.type_name)
        this.CONSUME1(ClosePar)
      }},
      // TODO rest after K_COLLATE
    ])
  })

  /**
   * Pipe expr
   */
  private pipe_expr = this.RULE("pipe_expr", () => {
    this.SUBRULE(this.expr)
    this.CONSUME(Pipe2)
    this.SUBRULE1(this.expr)
  })

  /**
   * Math1 expr
   */
  private math1_expr = this.RULE("math1_expr", () => {
    this.SUBRULE(this.expr)
    this.OR([
      { ALT: () => this.CONSUME(Star) },
      { ALT: () => this.CONSUME(Div) },
      { ALT: () => this.CONSUME(Mod) },
    ])
    this.SUBRULE1(this.expr)
  })

  /**
   * Math2 expr
   */
  private math2_expr = this.RULE("math2_expr", () => {
    this.SUBRULE(this.expr)
    this.OR([
      { ALT: () => this.CONSUME(Plus) },
      { ALT: () => this.CONSUME(Minus) },
    ])
    this.SUBRULE1(this.expr)
  })

  /**
   * Binary expr
   */
  private binary_expr = this.RULE("binary_expr", () => {
    this.SUBRULE(this.expr)
    this.OR([
      { ALT: () => this.CONSUME(Lt2) },
      { ALT: () => this.CONSUME(Gt2) },
      { ALT: () => this.CONSUME(Amp) },
      { ALT: () => this.CONSUME(Pipe) },
    ])
    this.SUBRULE1(this.expr)
  })

  private syntax_expr = this.RULE("syntax_expr", () => {
    this.SUBRULE(this.expr)
    this.OR4([
      { ALT: () => this.CONSUME(Assign) },
      { ALT: () => this.CONSUME(Eq) },
      { ALT: () => this.CONSUME(NotEq1) },
      { ALT: () => this.CONSUME(NotEq2) },
      { ALT: () => this.CONSUME(K_IS) },
      { ALT: () => {
        this.CONSUME1(K_IS)
        this.CONSUME(K_NOT)
      }},
      { ALT: () => this.CONSUME(K_IN) },
      { ALT: () => this.CONSUME(K_LIKE) },
      { ALT: () => this.CONSUME(K_GLOB) },
      { ALT: () => this.CONSUME(K_MATCH) },
      { ALT: () => this.CONSUME(K_REGEXP) },
    ])
    this.SUBRULE1(this.expr)
  })

  /**
   * Ordering term
   */
  private ordering_term = this.RULE("ordering_term", () => {
    this.SUBRULE(this.expr)
    this.OPTION(() => {
      this.CONSUME(K_COLLATE)
      this.SUBRULE(this.collation_name)
    })
    this.OPTION2(() => {
      this.OR([
        { ALT: () => this.CONSUME(K_ASC) },
        { ALT: () => this.CONSUME(K_DESC) },
      ])
    })
  })

  /**
   * Result column
   */
  private result_column = this.RULE("result_column", () => {
    this.OR([
      { ALT: () => this.CONSUME(Star) },
      { ALT: () => {
        this.SUBRULE(this.any_name)
        this.CONSUME(Dot)
        this.CONSUME1(Star)
      }},
      { ALT: () => {
        this.SUBRULE(this.expr)
        this.OPTION(() => {
          this.OPTION2(() => this.CONSUME(K_AS))
          this.SUBRULE(this.column_alias)
        })
      }},
    ])
  })

  /**
   * Table or subquery
   */
  private table_or_subquery = this.RULE("table_or_subquery", () => {
    this.OR([
      { ALT: () => {
        // TODO
        this.OPTION(() => {
          this.SUBRULE(this.database_name)
          this.CONSUME(Dot)
        })
        this.SUBRULE(this.table_name)
        this.OPTION2(() => {
          this.OPTION3(() => this.CONSUME(K_AS))
          this.SUBRULE(this.table_alias)
        })
        this.OPTION4(() => {
          this.OR1([
            { ALT: () => {
              this.CONSUME(K_INDEXED)
              this.CONSUME(K_BY)
              this.SUBRULE(this.index_name)
            }},
            { ALT: () => {
              this.CONSUME(K_NOT)
              this.CONSUME1(K_INDEXED)
            }},
          ])
        })
      }},
      { ALT: () => {
        this.CONSUME(OpenPar)
        this.OR2([
          { ALT: () => {
            this.AT_LEAST_ONE_SEP({
              SEP: Comma,
              DEF: () => this.SUBRULE(this.table_or_subquery)
            })
          }},
          { ALT: () => this.SUBRULE(this.join_clause)},
        ])
        this.CONSUME(ClosePar)
        this.OPTION5(() => {
          this.OPTION6(() => this.CONSUME1(K_AS))
          this.SUBRULE1(this.table_alias)
        })
      }},
      { ALT: () => {
        this.CONSUME1(OpenPar)
        this.SUBRULE(this.select_stmt)
        this.CONSUME1(ClosePar)
        this.OPTION7(() => {
          this.OPTION8(() => this.CONSUME2(K_AS))
          this.SUBRULE2(this.table_alias)
        })
      }},
    ])
  })

  /**
   * Join clause
   */
  private join_clause = this.RULE("join_clause", () => {
    this.SUBRULE(this.table_or_subquery)
    this.OPTION(() => {
      this.SUBRULE(this.join_operator)
      this.SUBRULE1(this.table_or_subquery)
      this.SUBRULE(this.join_constraint)
    })
  })

  /**
   * Join operator
   */
  private join_operator = this.RULE("join_operator", () => {
    this.OR([
      { ALT: () => this.CONSUME(Comma) },
      { ALT: () => {
        this.OPTION(() => this.CONSUME(K_NATURAL))
        this.OPTION2(() => {
          this.OR1([
            { ALT: () => {
              this.CONSUME(K_LEFT)
              this.OPTION3(() => this.CONSUME(K_OUTER))
            }},
            { ALT: () => this.CONSUME(K_INNER) },
            { ALT: () => this.CONSUME(K_CROSS) },
          ])
        })
        this.CONSUME(K_JOIN)
      }},
    ])
  })

  /**
   * Join constraint
   */
  private join_constraint = this.RULE("join_constraint", () => {
    this.OPTION(() => {
      this.OR([
        { ALT: () => {
          this.CONSUME(K_ON)
          this.SUBRULE(this.expr)
        }},
        { ALT: () => {
          this.CONSUME(K_USING)
          this.CONSUME(OpenPar)
          this.AT_LEAST_ONE_SEP({
            SEP: Comma,
            DEF: () => this.SUBRULE(this.column_name)
          })
          this.CONSUME(ClosePar)
        }},
      ])
    })
  })

  /**
   * With clause
   */
  private with_clause = this.RULE("with_clause", () => {
    this.CONSUME(K_WITH)
    this.OPTION(() => this.CONSUME(K_RECURSIVE))
    this.AT_LEAST_ONE_SEP({
      SEP: Comma,
      DEF: () => this.SUBRULE(this.common_table_expression)
    })
  })

  /**
   * Common table expression
   */
  private common_table_expression = this.RULE("common_table_expression", () => {
    this.SUBRULE(this.table_name)
    this.OPTION(() => {
      this.CONSUME(OpenPar)
      this.AT_LEAST_ONE_SEP({
        SEP: Comma,
        DEF: () => {
          this.column_name
        }
      })
      this.CONSUME(ClosePar)
    })
    this.CONSUME(K_AS)
    this.CONSUME1(OpenPar)
    this.SUBRULE(this.select_stmt)
    this.CONSUME1(ClosePar)
  })

  private compound_operator = this.RULE("compound_operator", () => {
    this.OR([
      { ALT: () => this.CONSUME(K_UNION) },
      { ALT: () => {
        this.CONSUME1(K_UNION)
        this.CONSUME(K_ALL)
      }},
      { ALT: () => this.CONSUME(K_INTERSECT) },
      { ALT: () => this.CONSUME(K_EXCEPT) },
    ])
  })

  /**
   * Signed number
   */
  private signed_number = this.RULE("signed_number", () => {
    this.OPTION(() => {
      this.OR([
        { ALT: () => this.CONSUME(Plus) },
        { ALT: () => this.CONSUME(Minus) },
      ])
    })
    this.CONSUME(NumericLiteral)
  })

  /**
   * Literal value
   */
  private literal_value = this.RULE("literal_value", () => {
    this.OR([
      { ALT: () => this.CONSUME(NumericLiteral) },
      { ALT: () => this.CONSUME(StringLiteral) },
      { ALT: () => this.CONSUME(BlobLiteral) },
      { ALT: () => this.CONSUME(K_NULL) },
      { ALT: () => this.CONSUME(K_CURRENT_TIME) },
      { ALT: () => this.CONSUME(K_CURRENT_DATE) },
      { ALT: () => this.CONSUME(K_CURRENT_TIMESTAMP) },
    ])
  })

  /**
   * Unary operator
   */
  private unary_operator = this.RULE("unary_operator", () => {
    this.OR([
      { ALT: () => this.CONSUME(Minus) },
      { ALT: () => this.CONSUME(Plus) },
      { ALT: () => this.CONSUME(Tilde) },
      { ALT: () => this.CONSUME(K_NOT) },
    ])
  })

  /**
   * Column alias
   */
  private column_alias = this.RULE("column_alias", () => {
    this.OR([
      { ALT: () => this.CONSUME(Identifier) },
      { ALT: () => this.CONSUME(StringLiteral) },
    ])
  })

  /**
   * Keyword
   */
  private keyword = this.RULE("keyword", () => {
    this.CONSUME(Keyword)
  })

  /**
   * Names
   */
  private name = this.RULE("name", () => this.SUBRULE(this.any_name))
  private collation_name = this.RULE("collation_name", () => this.SUBRULE(this.any_name))
  private database_name = this.RULE("database_name", () => this.SUBRULE(this.any_name))
  private table_name = this.RULE("table_name", () => this.SUBRULE(this.any_name))
  private table_alias = this.RULE("table_alias", () => this.SUBRULE(this.any_name))
  private column_name = this.RULE("column_name", () => this.SUBRULE(this.any_name))
  private index_name = this.RULE("index_name", () => this.SUBRULE(this.any_name))

  /**
   * Can be function_name database_name table_name column_name collation_name index_name table_alias
   */
  private any_name = this.RULE("any_name", () => {
    this.OR([
      { ALT: () => this.CONSUME(Identifier) },
      { ALT: () => this.SUBRULE(this.keyword) },
      { ALT: () => this.CONSUME(StringLiteral) },
      { ALT: () => {
        this.CONSUME(OpenPar)
        this.SUBRULE(this.any_name)
        this.CONSUME(ClosePar)
      }},
    ])
  })
}

// reuse the same parser instance.
const parser = new SelectSqlParser()

export function parse(text: string) {
  const lexResult = JsonLexer.tokenize(text)
  // setting a new input will RESET the parser instance's state.
  parser.input = lexResult.tokens
  // any top level rule may be used as an entry point
  const cst = parser.sql_stmt()

  // this would be a TypeScript compilation error because our parser now has a clear API.
  // let value = parser.json_OopsTypo()

  return {
      // This is a pure grammar, the value will be undefined until we add embedded actions
      // or enable automatic CST creation.
      cst: cst,
      lexErrors: lexResult.errors,
      parseErrors: parser.errors
  }
}
