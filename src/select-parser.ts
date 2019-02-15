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
function FRAGMENT(name: string, def: any) {
  fragments[name] = XRegExp.build(def, fragments)
}

// a utility to create a pattern using previously defined fragments
function MAKE_PATTERN(def: string, flags?: string) {
  return XRegExp.build(def, fragments, flags)
}

// define fragments
FRAGMENT("DIGIT", "[0-9]")
FRAGMENT("E", "[eE]")
// IDENTIFIERS
FRAGMENT("DQ_IDENTIFIER", '"([^"]|"")*"')
FRAGMENT("BQ_IDENTIFIER", "`([^`]|``)*`")
FRAGMENT("WP_IDENTIFIER", "\\[[^\\]]*\\]")
FRAGMENT("CHAR_IDENTIFIER", "[a-zA-Z_$#0-9]+")
FRAGMENT("IDENTIFIER", MAKE_PATTERN("{{DQ_IDENTIFIER}}|{{BQ_IDENTIFIER}}|{{WP_IDENTIFIER}}|{{CHAR_IDENTIFIER}}"))
// NUMERICS
FRAGMENT("NORM_NUMERIC", MAKE_PATTERN("{{DIGIT}}+(\.{{DIGIT}})?({{E}}[-+]?{{DIGIT}}+)?"))
FRAGMENT("DOT_NUMERIC", MAKE_PATTERN("\.{{DIGIT}}+({{E}}[-+]?{{DIGIT}}+)?"))
FRAGMENT("STRING_LITERAL", "'([^']|'')*'")

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
  pattern: /--[^\r\n]*/,
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
const ABORT = createToken({ name: "ABORT", pattern: /abort/i, categories: [Keyword], longer_alt: Identifier })
const ACTION = createToken({ name: "ACTION", pattern: /action/i, categories: [Keyword], longer_alt: Identifier })
const ADD = createToken({ name: "ADD", pattern: /add/i, categories: [Keyword], longer_alt: Identifier })
const AFTER = createToken({ name: "AFTER", pattern: /after/i, categories: [Keyword], longer_alt: Identifier })
const ALL = createToken({ name: "ALL", pattern: /all/i, categories: [Keyword], longer_alt: Identifier })
const ALTER = createToken({ name: "ALTER", pattern: /alter/i, categories: [Keyword], longer_alt: Identifier })
const ANALYZE = createToken({ name: "ANALYZE", pattern: /analyze/i, categories: [Keyword], longer_alt: Identifier })
const AND = createToken({ name: "AND", pattern: /and/i, categories: [Keyword], longer_alt: Identifier })
const AS = createToken({ name: "AS", pattern: /as/i, categories: [Keyword], longer_alt: Identifier })
const ASC = createToken({ name: "ASC", pattern: /asc/i, categories: [Keyword], longer_alt: Identifier })
const ATTACH = createToken({ name: "ATTACH", pattern: /attach/i, categories: [Keyword], longer_alt: Identifier })
const AUTOINCREMENT = createToken({ name: "AUTOINCREMENT", pattern: /autoincrement/i, categories: [Keyword], longer_alt: Identifier })
const BEFORE = createToken({ name: "BEFORE", pattern: /before/i, categories: [Keyword], longer_alt: Identifier })
const BEGIN = createToken({ name: "BEGIN", pattern: /begin/i, categories: [Keyword], longer_alt: Identifier })
const BETWEEN = createToken({ name: "BETWEEN", pattern: /between/i, categories: [Keyword], longer_alt: Identifier })
const BY = createToken({ name: "BY", pattern: /by/i, categories: [Keyword], longer_alt: Identifier })
const CASCADE = createToken({ name: "CASCADE", pattern: /cascade/i, categories: [Keyword], longer_alt: Identifier })
const CASE = createToken({ name: "CASE", pattern: /case/i, categories: [Keyword], longer_alt: Identifier })
const CAST = createToken({ name: "CAST", pattern: /cast/i, categories: [Keyword], longer_alt: Identifier })
const CHECK = createToken({ name: "CHECK", pattern: /check/i, categories: [Keyword], longer_alt: Identifier })
const COLLATE = createToken({ name: "COLLATE", pattern: /collate/i, categories: [Keyword], longer_alt: Identifier })
const COLUMN = createToken({ name: "COLUMN", pattern: /column/i, categories: [Keyword], longer_alt: Identifier })
const COMMIT = createToken({ name: "COMMIT", pattern: /commit/i, categories: [Keyword], longer_alt: Identifier })
const CONFLICT = createToken({ name: "CONFLICT", pattern: /conflict/i, categories: [Keyword], longer_alt: Identifier })
const CONSTRAINT = createToken({ name: "CONSTRAINT", pattern: /constraint/i, categories: [Keyword], longer_alt: Identifier })
const CREATE = createToken({ name: "CREATE", pattern: /create/i, categories: [Keyword], longer_alt: Identifier })
const CROSS = createToken({ name: "CROSS", pattern: /cross/i, categories: [Keyword], longer_alt: Identifier })
const CURRENT_DATE = createToken({ name: "CURRENT_DATE", pattern: /current_date/i, categories: [Keyword], longer_alt: Identifier })
const CURRENT_TIME = createToken({ name: "CURRENT_TIME", pattern: /current_time/i, categories: [Keyword], longer_alt: Identifier })
const CURRENT_TIMESTAMP = createToken({ name: "CURRENT_TIMESTAMP", pattern: /current_timestamp/i, categories: [Keyword], longer_alt: Identifier })
const DATABASE = createToken({ name: "DATABASE", pattern: /database/i, categories: [Keyword], longer_alt: Identifier })
const DEFAULT = createToken({ name: "DEFAULT", pattern: /default/i, categories: [Keyword], longer_alt: Identifier })
const DEFERRABLE = createToken({ name: "DEFERRABLE", pattern: /deferrable/i, categories: [Keyword], longer_alt: Identifier })
const DEFERRED = createToken({ name: "DEFERRED", pattern: /deferred/i, categories: [Keyword], longer_alt: Identifier })
const DELETE = createToken({ name: "DELETE", pattern: /delete/i, categories: [Keyword], longer_alt: Identifier })
const DESC = createToken({ name: "DESC", pattern: /desc/i, categories: [Keyword], longer_alt: Identifier })
const DETACH = createToken({ name: "DETACH", pattern: /detach/i, categories: [Keyword], longer_alt: Identifier })
const DISTINCT = createToken({ name: "DISTINCT", pattern: /distinct/i, categories: [Keyword], longer_alt: Identifier })
const DROP = createToken({ name: "DROP", pattern: /drop/i, categories: [Keyword], longer_alt: Identifier })
const EACH = createToken({ name: "EACH", pattern: /each/i, categories: [Keyword], longer_alt: Identifier })
const ELSE = createToken({ name: "ELSE", pattern: /else/i, categories: [Keyword], longer_alt: Identifier })
const END = createToken({ name: "END", pattern: /end/i, categories: [Keyword], longer_alt: Identifier })
const ESCAPE = createToken({ name: "ESCAPE", pattern: /escape/i, categories: [Keyword], longer_alt: Identifier })
const EXCEPT = createToken({ name: "EXCEPT", pattern: /except/i, categories: [Keyword], longer_alt: Identifier })
const EXCLUSIVE = createToken({ name: "EXCLUSIVE", pattern: /exclusive/i, categories: [Keyword], longer_alt: Identifier })
const EXISTS = createToken({ name: "EXISTS", pattern: /exists/i, categories: [Keyword], longer_alt: Identifier })
const EXPLAIN = createToken({ name: "EXPLAIN", pattern: /explain/i, categories: [Keyword], longer_alt: Identifier })
const FAIL = createToken({ name: "FAIL", pattern: /fail/i, categories: [Keyword], longer_alt: Identifier })
const FOR = createToken({ name: "FOR", pattern: /for/i, categories: [Keyword], longer_alt: Identifier })
const FOREIGN = createToken({ name: "FOREIGN", pattern: /foreign/i, categories: [Keyword], longer_alt: Identifier })
const FROM = createToken({ name: "FROM", pattern: /from/i, categories: [Keyword], longer_alt: Identifier })
const FULL = createToken({ name: "FULL", pattern: /full/i, categories: [Keyword], longer_alt: Identifier })
const GLOB = createToken({ name: "GLOB", pattern: /glob/i, categories: [Keyword], longer_alt: Identifier })
const GROUP = createToken({ name: "GROUP", pattern: /group/i, categories: [Keyword], longer_alt: Identifier })
const HAVING = createToken({ name: "HAVING", pattern: /having/i, categories: [Keyword], longer_alt: Identifier })
const IF = createToken({ name: "IF", pattern: /if/i, categories: [Keyword], longer_alt: Identifier })
const IGNORE = createToken({ name: "IGNORE", pattern: /ignore/i, categories: [Keyword], longer_alt: Identifier })
const IMMEDIATE = createToken({ name: "IMMEDIATE", pattern: /immediate/i, categories: [Keyword], longer_alt: Identifier })
const IN = createToken({ name: "IN", pattern: /in/i, categories: [Keyword], longer_alt: Identifier })
const INDEX = createToken({ name: "INDEX", pattern: /index/i, categories: [Keyword], longer_alt: Identifier })
const INDEXED = createToken({ name: "INDEXED", pattern: /indexed/i, categories: [Keyword], longer_alt: Identifier })
const INITIALLY = createToken({ name: "INITIALLY", pattern: /initially/i, categories: [Keyword], longer_alt: Identifier })
const INNER = createToken({ name: "INNER", pattern: /inner/i, categories: [Keyword], longer_alt: Identifier })
const INSERT = createToken({ name: "INSERT", pattern: /insert/i, categories: [Keyword], longer_alt: Identifier })
const INSTEAD = createToken({ name: "INSTEAD", pattern: /instead/i, categories: [Keyword], longer_alt: Identifier })
const INTERSECT = createToken({ name: "INTERSECT", pattern: /intersect/i, categories: [Keyword], longer_alt: Identifier })
const INTO = createToken({ name: "INTO", pattern: /into/i, categories: [Keyword], longer_alt: Identifier })
const IS = createToken({ name: "IS", pattern: /is/i, categories: [Keyword], longer_alt: Identifier })
const ISNULL = createToken({ name: "ISNULL", pattern: /isnull/i, categories: [Keyword], longer_alt: Identifier })
const JOIN = createToken({ name: "JOIN", pattern: /join/i, categories: [Keyword], longer_alt: Identifier })
const KEY = createToken({ name: "KEY", pattern: /key/i, categories: [Keyword], longer_alt: Identifier })
const LEFT = createToken({ name: "LEFT", pattern: /left/i, categories: [Keyword], longer_alt: Identifier })
const LIKE = createToken({ name: "LIKE", pattern: /like/i, categories: [Keyword], longer_alt: Identifier })
const LIMIT = createToken({ name: "LIMIT", pattern: /limit/i, categories: [Keyword], longer_alt: Identifier })
const MATCH = createToken({ name: "MATCH", pattern: /match/i, categories: [Keyword], longer_alt: Identifier })
const NATURAL = createToken({ name: "NATURAL", pattern: /natural/i, categories: [Keyword], longer_alt: Identifier })
const NO = createToken({ name: "NO", pattern: /no/i, categories: [Keyword], longer_alt: Identifier })
const NOT = createToken({ name: "NOT", pattern: /not/i, categories: [Keyword], longer_alt: Identifier })
const NOTNULL = createToken({ name: "NOTNULL", pattern: /notnull/i, categories: [Keyword], longer_alt: Identifier })
const NULL = createToken({ name: "NULL", pattern: /null/i, categories: [Keyword], longer_alt: Identifier })
const OF = createToken({ name: "OF", pattern: /of/i, categories: [Keyword], longer_alt: Identifier })
const OFFSET = createToken({ name: "OFFSET", pattern: /offset/i, categories: [Keyword], longer_alt: Identifier })
const ON = createToken({ name: "ON", pattern: /on/i, categories: [Keyword], longer_alt: Identifier })
const OR = createToken({ name: "OR", pattern: /or/i, categories: [Keyword], longer_alt: Identifier })
const ORDER = createToken({ name: "ORDER", pattern: /order/i, categories: [Keyword], longer_alt: Identifier })
const OUTER = createToken({ name: "OUTER", pattern: /outer/i, categories: [Keyword], longer_alt: Identifier })
const PLAN = createToken({ name: "PLAN", pattern: /plan/i, categories: [Keyword], longer_alt: Identifier })
const PRAGMA = createToken({ name: "PRAGMA", pattern: /pragma/i, categories: [Keyword], longer_alt: Identifier })
const PRIMARY = createToken({ name: "PRIMARY", pattern: /primary/i, categories: [Keyword], longer_alt: Identifier })
const QUERY = createToken({ name: "QUERY", pattern: /query/i, categories: [Keyword], longer_alt: Identifier })
const RAISE = createToken({ name: "RAISE", pattern: /raise/i, categories: [Keyword], longer_alt: Identifier })
const RECURSIVE = createToken({ name: "RECURSIVE", pattern: /recursive/i, categories: [Keyword], longer_alt: Identifier })
const REFERENCES = createToken({ name: "REFERENCES", pattern: /references/i, categories: [Keyword], longer_alt: Identifier })
const REGEXP = createToken({ name: "REGEXP", pattern: /regexp/i, categories: [Keyword], longer_alt: Identifier })
const REINDEX = createToken({ name: "REINDEX", pattern: /reindex/i, categories: [Keyword], longer_alt: Identifier })
const RELEASE = createToken({ name: "RELEASE", pattern: /release/i, categories: [Keyword], longer_alt: Identifier })
const RENAME = createToken({ name: "RENAME", pattern: /rename/i, categories: [Keyword], longer_alt: Identifier })
const REPLACE = createToken({ name: "REPLACE", pattern: /replace/i, categories: [Keyword], longer_alt: Identifier })
const RESTRICT = createToken({ name: "RESTRICT", pattern: /restrict/i, categories: [Keyword], longer_alt: Identifier })
const RIGHT = createToken({ name: "RIGHT", pattern: /right/i, categories: [Keyword], longer_alt: Identifier })
const ROLLBACK = createToken({ name: "ROLLBACK", pattern: /rollback/i, categories: [Keyword], longer_alt: Identifier })
const ROW = createToken({ name: "ROW", pattern: /row/i, categories: [Keyword], longer_alt: Identifier })
const SAVEPOINT = createToken({ name: "SAVEPOINT", pattern: /savepoint/i, categories: [Keyword], longer_alt: Identifier })
const SELECT = createToken({ name: "SELECT", pattern: /select/i, categories: [Keyword], longer_alt: Identifier })
const SET = createToken({ name: "SET", pattern: /set/i, categories: [Keyword], longer_alt: Identifier })
const TABLE = createToken({ name: "TABLE", pattern: /table/i, categories: [Keyword], longer_alt: Identifier })
const TEMP = createToken({ name: "TEMP", pattern: /temp/i, categories: [Keyword], longer_alt: Identifier })
const TEMPORARY = createToken({ name: "TEMPORARY", pattern: /temporary/i, categories: [Keyword], longer_alt: Identifier })
const THEN = createToken({ name: "THEN", pattern: /then/i, categories: [Keyword], longer_alt: Identifier })
const TO = createToken({ name: "TO", pattern: /to/i, categories: [Keyword], longer_alt: Identifier })
const TRANSACTION = createToken({ name: "TRANSACTION", pattern: /transaction/i, categories: [Keyword], longer_alt: Identifier })
const TRIGGER = createToken({ name: "TRIGGER", pattern: /trigger/i, categories: [Keyword], longer_alt: Identifier })
const UNION = createToken({ name: "UNION", pattern: /union/i, categories: [Keyword], longer_alt: Identifier })
const UNIQUE = createToken({ name: "UNIQUE", pattern: /unique/i, categories: [Keyword], longer_alt: Identifier })
const UPDATE = createToken({ name: "UPDATE", pattern: /update/i, categories: [Keyword], longer_alt: Identifier })
const USING = createToken({ name: "USING", pattern: /using/i, categories: [Keyword], longer_alt: Identifier })
const VACUUM = createToken({ name: "VACUUM", pattern: /vacuum/i, categories: [Keyword], longer_alt: Identifier })
const VALUES = createToken({ name: "VALUES", pattern: /values/i, categories: [Keyword], longer_alt: Identifier })
const VIEW = createToken({ name: "VIEW", pattern: /view/i, categories: [Keyword], longer_alt: Identifier })
const VIRTUAL = createToken({ name: "VIRTUAL", pattern: /virtual/i, categories: [Keyword], longer_alt: Identifier })
const WHEN = createToken({ name: "WHEN", pattern: /when/i, categories: [Keyword], longer_alt: Identifier })
const WHERE = createToken({ name: "WHERE", pattern: /where/i, categories: [Keyword], longer_alt: Identifier })
const WITH = createToken({ name: "WITH", pattern: /with/i, categories: [Keyword], longer_alt: Identifier })
const WITHOUT = createToken({ name: "WITHOUT", pattern: /without/i, categories: [Keyword], longer_alt: Identifier })

const keywordTokens = [
  ABORT, ACTION, ADD, AFTER, ALL,
  ALTER, ANALYZE, AND, ASC, AS,
  ATTACH, AUTOINCREMENT, BEFORE, BEGIN,
  BETWEEN, BY, CASCADE, CASE, CAST,
  CHECK, COLLATE, COLUMN, COMMIT,
  CONFLICT, CONSTRAINT, CREATE, CROSS,
  CURRENT_DATE, CURRENT_TIMESTAMP, CURRENT_TIME,
  DATABASE, DEFAULT, DEFERRABLE, DEFERRED, DELETE,
  DESC, DETACH, DISTINCT, DROP, EACH,
  ELSE, END, ESCAPE, EXCEPT, EXCLUSIVE,
  EXISTS, EXPLAIN, FAIL, FOREIGN, FOR,
  FROM, FULL, GLOB, GROUP, HAVING, IF,
  IGNORE, IMMEDIATE, INTO, INSTEAD, INTERSECT,
  INSERT, INNER, INITIALLY, INDEXED, INDEX, IN,
  ISNULL, IS, JOIN, KEY, LEFT, LIKE,
  LIMIT, MATCH, NATURAL, NOTNULL, NOT, NO,
  NULL, OFFSET, OF, ON, ORDER, OR, OUTER,
  PLAN, PRAGMA, PRIMARY, QUERY, RAISE, RECURSIVE,
  REFERENCES, REGEXP, REINDEX, RELEASE, RENAME,
  REPLACE, RESTRICT, RIGHT, ROLLBACK, ROW, SAVEPOINT,
  SELECT, SET, TABLE, TEMPORARY, TEMP, THEN,
  TO, TRANSACTION, TRIGGER, UNION, UNIQUE, UPDATE,
  USING, VACUUM, VALUES, VIEW, VIRTUAL,
  WHEN, WHERE, WITHOUT, WITH,
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
  // Keywords
  ...keywordTokens,
  Keyword,
  // Identifier and Literals
  Identifier,
  BindParameter,
  StringLiteral,
  NumericLiteral,
  BlobLiteral,
  // Commentings
  SinglelineComment,
  MultilineComment,
]
export const SelectLexer = new Lexer(allTokens)

export class SelectParser extends Parser {
  constructor() {
    super(allTokens, {
      maxLookahead: 4,
      ignoredIssues: {
        select_core: {
          OR2: true,
          OR3: true,
        },
        table_or_subquery: {
          OR: true,
        },
        result_column: {
          OR: true,
        },
        expr: {
          OR: true,
        },
        atomic_expr: {
          OR: true,
          OR2: true,
        },
        syntax_expr: {
          OR4: true
        }
      }
    })
    this.performSelfAnalysis()
  }

  // In TypeScript the parsing rules are explicitly defined as class instance properties
  // This allows for using access control (public/private/protected) and more importantly "informs" the TypeScript compiler
  // about the API of our Parser, so referencing an invalid rule name (this.SUBRULE(this.oopsType);)
  // is now a TypeScript compilation error.
  public sql_stmt = this.RULE("sql_stmt", () => {
    this.MANY(() => this.CONSUME(Scol))
    this.SUBRULE(this.select_stmt)
    this.MANY2(() => {
      this.AT_LEAST_ONE(() => this.CONSUME2(Scol))
      this.SUBRULE1(this.select_stmt)
    })
    this.MANY1(() => this.CONSUME1(Scol))
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
    this.OPTION2(() => { // ORDER
      this.CONSUME(ORDER)
      this.CONSUME(BY)
      this.AT_LEAST_ONE_SEP({
        SEP: Comma,
        DEF: () => this.SUBRULE(this.ordering_term)
      })
    })
    this.OPTION3(() => { // LIMIT
      this.CONSUME(LIMIT)
      this.SUBRULE(this.expr)
      this.OPTION4(() => {
        this.CONSUME(OFFSET)
        this.SUBRULE1(this.expr)
      })
    })
  })

  /**
   * Select core
   */
  private select_core = this.RULE("select_core", () => {
    this.CONSUME(SELECT)
    this.OPTION(() => {
      this.OR1([
        { ALT: () => this.CONSUME(DISTINCT) },
        { ALT: () => this.CONSUME(ALL) },
      ])
    })
    this.AT_LEAST_ONE_SEP({
      SEP: Comma,
      DEF: () => this.SUBRULE(this.result_column)
    })

    this.CONSUME(FROM) // FROM
    this.SUBRULE(this.join_clause)

    this.OPTION3(() => { // WHERE
      this.CONSUME(WHERE)
      this.SUBRULE(this.expr)
    })
    this.OPTION4(() => { // GROUP
      this.CONSUME(GROUP)
      this.CONSUME1(BY)
      this.AT_LEAST_ONE_SEP2({
        SEP: Comma,
        DEF: this.SUBRULE1(this.expr),
      })
      this.OPTION5(() => { // Having
        this.CONSUME(HAVING)
        this.SUBRULE2(this.expr)
      })
    })
  })

  /**
   * Type name
   */
  private type_name = this.RULE("type_name", () => {
    this.AT_LEAST_ONE(() => this.SUBRULE(this.name))
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
    this.SUBRULE(this.or_expr)
  })

  private atomic_expr = this.RULE("atomic_expr", () => {
    this.OR([
      { ALT: () => {
        this.CONSUME(OpenPar)
        this.SUBRULE1(this.expr)
        this.CONSUME(ClosePar)
      }},
      { ALT: () => { // function name
        this.SUBRULE(this.function_name)
        this.CONSUME2(OpenPar)
        this.OPTION3(() => {
          this.OR1([
            { ALT: () => {
              this.OPTION4(() => this.CONSUME(DISTINCT))
              this.AT_LEAST_ONE_SEP({
                SEP: Comma,
                DEF: () => this.SUBRULE3(this.expr)
              })
            }},
            { ALT: () => this.CONSUME(Star)},
          ])
        })
        this.CONSUME2(ClosePar)
      }},
      { ALT: () => this.SUBRULE(this.literal_value) },
      { ALT: () => this.CONSUME(BindParameter) },
      { ALT: () => {
        this.OR2([
          { ALT: () => {
            this.SUBRULE(this.database_name)
            this.CONSUME3(Dot)
            this.SUBRULE1(this.table_name)
            this.CONSUME2(Dot)
            this.SUBRULE2(this.column_name)
          }},
          { ALT: () => {
            this.SUBRULE(this.table_name)
            this.CONSUME1(Dot)
            this.SUBRULE1(this.column_name)
          }},
          { ALT: () => this.SUBRULE(this.column_name)},
        ])
      }},
      { ALT: () => {
        this.SUBRULE(this.unary_operator)
        this.SUBRULE(this.expr)
      }},
      { ALT: () => {
        this.CONSUME(CAST)
        this.CONSUME1(OpenPar)
        this.SUBRULE2(this.expr)
        this.CONSUME(AS)
        this.SUBRULE(this.type_name)
        this.CONSUME1(ClosePar)
      }},
      // TODO rest after COLLATE
    ])
  })

  /**
   * Pipe expr
   */
  private pipe_expr = this.RULE("pipe_expr", () => {
    this.SUBRULE(this.atomic_expr)
    this.MANY(() => {
      this.CONSUME(Pipe2)
      this.SUBRULE1(this.atomic_expr)
    })
  })

  /**
   * Math1 expr
   */
  private multiplication_expr = this.RULE("multiplication_expr", () => {
    this.SUBRULE(this.pipe_expr)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(Star) },
        { ALT: () => this.CONSUME(Div) },
        { ALT: () => this.CONSUME(Mod) },
      ])
      this.SUBRULE1(this.pipe_expr)
    })
  })

  /**
   * Math2 expr
   */
  private addition_expr = this.RULE("addition_expr", () => {
    this.SUBRULE(this.multiplication_expr)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(Plus) },
        { ALT: () => this.CONSUME(Minus) },
      ])
      this.SUBRULE1(this.multiplication_expr)
    })
  })

  /**
   * Binary expr
   */
  private binary_expr = this.RULE("binary_expr", () => {
    this.SUBRULE(this.addition_expr)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(Lt2) },
        { ALT: () => this.CONSUME(Gt2) },
        { ALT: () => this.CONSUME(Amp) },
        { ALT: () => this.CONSUME(Pipe) },
      ])
      this.SUBRULE1(this.addition_expr)
    })
  })

  private compare_expr = this.RULE("compare_expr", () => {
    this.SUBRULE(this.binary_expr)
    this.MANY(() => {
      this.OR4([
        { ALT: () => this.CONSUME(Lt) },
        { ALT: () => this.CONSUME(LtEq) },
        { ALT: () => this.CONSUME(Gt) },
        { ALT: () => this.CONSUME(GtEq) },
      ])
      this.SUBRULE1(this.binary_expr)
    })
  })

  /**
   * Syntax expr
   */
  private syntax_expr = this.RULE("syntax_expr", () => {
    this.SUBRULE(this.compare_expr)
    this.MANY(() => {
      this.OR4([
        { ALT: () => this.CONSUME(Assign) },
        { ALT: () => this.CONSUME(Eq) },
        { ALT: () => this.CONSUME(NotEq1) },
        { ALT: () => this.CONSUME(NotEq2) },
        { ALT: () => this.CONSUME(IS) },
        { ALT: () => {
          this.CONSUME1(IS)
          this.CONSUME(NOT)
        }},
        { ALT: () => this.CONSUME(IN) },
        { ALT: () => this.CONSUME(LIKE) },
        { ALT: () => this.CONSUME(GLOB) },
        { ALT: () => this.CONSUME(MATCH) },
        { ALT: () => this.CONSUME(REGEXP) },
      ])
      this.SUBRULE1(this.compare_expr)
    })
  })

  /**
   * And expr
   */
  private and_expr = this.RULE("and_expr", () => {
    this.SUBRULE(this.syntax_expr)
    this.MANY(() => {
      this.CONSUME(AND)
      this.SUBRULE1(this.syntax_expr)
    })
  })

  /**
   * Or expr
   */
  private or_expr = this.RULE("or_expr", () => {
    this.SUBRULE(this.and_expr)
    this.MANY(() => {
      this.CONSUME(OR)
      this.SUBRULE1(this.and_expr)
    })
  })

  /**
   * Ordering term
   */
  private ordering_term = this.RULE("ordering_term", () => {
    this.SUBRULE(this.expr)
    this.OPTION(() => {
      this.CONSUME(COLLATE)
      this.SUBRULE(this.collation_name)
    })
    this.OPTION2(() => {
      this.OR([
        { ALT: () => this.CONSUME(ASC) },
        { ALT: () => this.CONSUME(DESC) },
      ])
    })
  })

  /**
   * Result column
   */
  private result_column = this.RULE("result_column", () => {
    this.OR([
      { NAME: '$star', ALT: () => this.CONSUME(Star) },
      { 
        NAME: '$table_star',
        ALT: () => {
          this.SUBRULE(this.table_name)
          this.CONSUME(Dot)
          this.CONSUME1(Star)
        }
      },
      {
        NAME: '$column_expr',
        ALT: () => {
          this.SUBRULE(this.expr)
          this.OPTION(() => {
            this.OPTION2(() => this.CONSUME(AS))
            this.SUBRULE(this.column_alias)
          })
        }
      },
    ])
  })

  /**
   * Table or subquery
   */
  private table_or_subquery = this.RULE("table_or_subquery", () => {
    this.OR([
      { 
        NAME: '$table',
        ALT: () => {
          this.OPTION(() => {
            this.SUBRULE(this.database_name)
            this.CONSUME(Dot)
          })
          this.SUBRULE(this.table_name)
        }
      },
      {
        NAME: '$nested',
        ALT: () => {
          this.CONSUME(OpenPar)
          this.SUBRULE(this.join_clause)
          this.CONSUME(ClosePar)
        }
      },
      {
        NAME: '$select_stmt',
        ALT: () => {
          this.CONSUME1(OpenPar)
          this.SUBRULE(this.select_stmt)
          this.CONSUME1(ClosePar)
        }
      },
    ])
    this.OPTION2(() => {
      this.OPTION3(() => this.CONSUME(AS))
      this.SUBRULE(this.table_alias)
    })
  })

  /**
   * Join clause
   */
  private join_clause = this.RULE("join_clause", () => {
    this.SUBRULE(this.table_or_subquery)
    this.MANY(() => {
      let oeprator = this.SUBRULE(this.join_operator)
      this.SUBRULE1(this.table_or_subquery)
      if (!oeprator.children.Comma) {
        this.OPTION(() => this.SUBRULE(this.join_constraint))
      }
    })
  })

  /**
   * Join operator
   */
  private join_operator = this.RULE("join_operator", () => {
    this.OR([
      { ALT: () => this.CONSUME(Comma) },
      { ALT: () => {
        this.OPTION2(() => {
          this.OR1([
            { ALT: () => this.CONSUME(NATURAL) },
            { ALT: () => {
              this.OR2([
                { ALT: () => this.CONSUME(LEFT) },
                { ALT: () => this.CONSUME(RIGHT) },
              ])
              this.OPTION3(() => this.CONSUME(OUTER))
            }},
            { ALT: () => {
              this.CONSUME(FULL)
              this.CONSUME1(OUTER)
            }},
            { ALT: () => this.CONSUME(INNER) },
            { ALT: () => this.CONSUME(CROSS) },
          ])
        })
        this.CONSUME(JOIN)
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
          this.CONSUME(ON)
          this.SUBRULE(this.expr)
        }},
        { ALT: () => {
          this.CONSUME(USING)
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
    this.CONSUME(WITH)
    this.OPTION(() => this.CONSUME(RECURSIVE))
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
          this.SUBRULE(this.column_name)
        }
      })
      this.CONSUME(ClosePar)
    })
    this.CONSUME(AS)
    this.CONSUME1(OpenPar)
    this.SUBRULE(this.select_stmt)
    this.CONSUME1(ClosePar)
  })

  private compound_operator = this.RULE("compound_operator", () => {
    this.OR([
      { ALT: () => {
        this.CONSUME(UNION)
        this.OPTION(() => this.CONSUME(ALL))
      }},
      { ALT: () => this.CONSUME(INTERSECT) },
      { ALT: () => this.CONSUME(EXCEPT) },
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
      { ALT: () => this.CONSUME(NULL) },
      { ALT: () => this.CONSUME(CURRENT_TIME) },
      { ALT: () => this.CONSUME(CURRENT_DATE) },
      { ALT: () => this.CONSUME(CURRENT_TIMESTAMP) },
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
      { ALT: () => this.CONSUME(NOT) },
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
   * Names
   */
  private name = this.RULE("name", () => this.SUBRULE(this.any_name))
  private collation_name = this.RULE("collation_name", () => this.SUBRULE(this.any_name))
  private function_name = this.RULE("function_name", () => this.SUBRULE(this.any_name))
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
export const parser = new SelectParser()

export function parse(text: string) {
  const lexResult = SelectLexer.tokenize(text)
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
