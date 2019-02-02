"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//
var chevrotain_1 = require("chevrotain");
var xregexp_1 = __importDefault(require("xregexp"));
var fragments = {};
// A utility to create re-usable fragments using xRegExp
function FRAGMENT(name, def) {
    fragments[name] = xregexp_1.default.build(def, fragments);
}
// a utility to create a pattern using previously defined fragments
function MAKE_PATTERN(def, flags) {
    return xregexp_1.default.build(def, fragments, flags);
}
// define fragments
FRAGMENT("DIGIT", "[0-9]");
FRAGMENT("E", "[eE]");
// IDENTIFIERS
FRAGMENT("DQ_IDENTIFIER", '"([^"]|"")*"');
FRAGMENT("BQ_IDENTIFIER", "`([^`]|``)*`");
FRAGMENT("WP_IDENTIFIER", "\\[[^\\]]*\\]");
FRAGMENT("CHAR_IDENTIFIER", "[a-zA-Z_$#0-9]+");
FRAGMENT("IDENTIFIER", MAKE_PATTERN("{{DQ_IDENTIFIER}}|{{BQ_IDENTIFIER}}|{{WP_IDENTIFIER}}|{{CHAR_IDENTIFIER}}"));
// NUMERICS
FRAGMENT("NORM_NUMERIC", MAKE_PATTERN("{{DIGIT}}+(\.{{DIGIT}})?({{E}}[-+]?{{DIGIT}}+)?"));
FRAGMENT("DOT_NUMERIC", MAKE_PATTERN("\.{{DIGIT}}+({{E}}[-+]?{{DIGIT}}+)?"));
FRAGMENT("STRING_LITERAL", "'([^']|'')*'");
var Scol = chevrotain_1.createToken({
    name: "Scol",
    pattern: ";",
});
var Dot = chevrotain_1.createToken({
    name: "Dot",
    pattern: ".",
});
var OpenPar = chevrotain_1.createToken({
    name: "OpenPar",
    pattern: "(",
});
var ClosePar = chevrotain_1.createToken({
    name: "ClosePar",
    pattern: ")",
});
var Comma = chevrotain_1.createToken({
    name: "Comma",
    pattern: ",",
});
var Assign = chevrotain_1.createToken({
    name: "Assign",
    pattern: "=",
});
var Star = chevrotain_1.createToken({
    name: "Star",
    pattern: "*",
});
var Plus = chevrotain_1.createToken({
    name: "Plus",
    pattern: "+",
});
var Minus = chevrotain_1.createToken({
    name: "Minus",
    pattern: "-",
});
var Tilde = chevrotain_1.createToken({
    name: "Tilde",
    pattern: "~",
});
var Pipe2 = chevrotain_1.createToken({
    name: "Pipe2",
    pattern: "||",
});
var Div = chevrotain_1.createToken({
    name: "Div",
    pattern: "/",
});
var Mod = chevrotain_1.createToken({
    name: "Mod",
    pattern: "%",
});
var Lt2 = chevrotain_1.createToken({
    name: "Lt2",
    pattern: "<<",
});
var Gt2 = chevrotain_1.createToken({
    name: "Gt2",
    pattern: ">>",
});
var Amp = chevrotain_1.createToken({
    name: "Amp",
    pattern: "&",
});
var Pipe = chevrotain_1.createToken({
    name: "Pipe",
    pattern: "|",
});
var Lt = chevrotain_1.createToken({
    name: "Lt",
    pattern: "<",
});
var LtEq = chevrotain_1.createToken({
    name: "LtEq",
    pattern: "<=",
});
var Gt = chevrotain_1.createToken({
    name: "Gt",
    pattern: ">",
});
var GtEq = chevrotain_1.createToken({
    name: "GtEq",
    pattern: ">=",
});
var Eq = chevrotain_1.createToken({
    name: "Eq",
    pattern: "==",
});
var NotEq1 = chevrotain_1.createToken({
    name: "NotEq1",
    pattern: "!=",
});
var NotEq2 = chevrotain_1.createToken({
    name: "NotEq2",
    pattern: "<>",
});
var NumericLiteral = chevrotain_1.createToken({
    name: "NumericLiteral",
    pattern: MAKE_PATTERN("{{NORM_NUMERIC}}|{{DOT_NUMERIC}}")
});
var Identifier = chevrotain_1.createToken({
    name: "Identifier",
    pattern: MAKE_PATTERN("{{IDENTIFIER}}")
});
var BindParameter = chevrotain_1.createToken({
    name: "BindParameter",
    pattern: MAKE_PATTERN("\\?{{DIGIT}}*|[:@$]{{IDENTIFIER}}"),
});
var StringLiteral = chevrotain_1.createToken({
    name: "StringLiteral",
    pattern: MAKE_PATTERN("{{STRING_LITERAL}}")
});
var BlobLiteral = chevrotain_1.createToken({
    name: "BlobLiteral",
    pattern: MAKE_PATTERN("[xX]{{STRING_LITERAL}}"),
});
var SinglelineComment = chevrotain_1.createToken({
    name: "SinglelineComment",
    pattern: /--[^\r\n]*/,
    group: "comments"
});
var MultilineComment = chevrotain_1.createToken({
    name: "MultilineComment",
    pattern: /\/\*.*?\*\//,
    group: "comments"
});
var WhiteSpace = chevrotain_1.createToken({
    name: "WhiteSpace",
    pattern: /[ \u000B\t\n\r]+/,
    group: chevrotain_1.Lexer.SKIPPED
});
var Keyword = chevrotain_1.createToken({
    name: "Keyword",
    pattern: chevrotain_1.Lexer.NA,
});
// http://www.sqlite.org/lang_keywords.html
var K_ABORT = chevrotain_1.createToken({ name: "K_ABORT", pattern: /abort/i, categories: [Keyword] });
var K_ACTION = chevrotain_1.createToken({ name: "K_ACTION", pattern: /action/i, categories: [Keyword] });
var K_ADD = chevrotain_1.createToken({ name: "K_ADD", pattern: /add/i, categories: [Keyword] });
var K_AFTER = chevrotain_1.createToken({ name: "K_AFTER", pattern: /after/i, categories: [Keyword] });
var K_ALL = chevrotain_1.createToken({ name: "K_ALL", pattern: /all/i, categories: [Keyword] });
var K_ALTER = chevrotain_1.createToken({ name: "K_ALTER", pattern: /alter/i, categories: [Keyword] });
var K_ANALYZE = chevrotain_1.createToken({ name: "K_ANALYZE", pattern: /analyze/i, categories: [Keyword] });
var K_AND = chevrotain_1.createToken({ name: "K_AND", pattern: /and/i, categories: [Keyword] });
var K_AS = chevrotain_1.createToken({ name: "K_AS", pattern: /as/i, categories: [Keyword] });
var K_ASC = chevrotain_1.createToken({ name: "K_ASC", pattern: /asc/i, categories: [Keyword] });
var K_ATTACH = chevrotain_1.createToken({ name: "K_ATTACH", pattern: /attach/i, categories: [Keyword] });
var K_AUTOINCREMENT = chevrotain_1.createToken({ name: "K_AUTOINCREMENT", pattern: /autoincrement/i, categories: [Keyword] });
var K_BEFORE = chevrotain_1.createToken({ name: "K_BEFORE", pattern: /before/i, categories: [Keyword] });
var K_BEGIN = chevrotain_1.createToken({ name: "K_BEGIN", pattern: /begin/i, categories: [Keyword] });
var K_BETWEEN = chevrotain_1.createToken({ name: "K_BETWEEN", pattern: /between/i, categories: [Keyword] });
var K_BY = chevrotain_1.createToken({ name: "K_BY", pattern: /by/i, categories: [Keyword] });
var K_CASCADE = chevrotain_1.createToken({ name: "K_CASCADE", pattern: /cascade/i, categories: [Keyword] });
var K_CASE = chevrotain_1.createToken({ name: "K_CASE", pattern: /case/i, categories: [Keyword] });
var K_CAST = chevrotain_1.createToken({ name: "K_CAST", pattern: /cast/i, categories: [Keyword] });
var K_CHECK = chevrotain_1.createToken({ name: "K_CHECK", pattern: /check/i, categories: [Keyword] });
var K_COLLATE = chevrotain_1.createToken({ name: "K_COLLATE", pattern: /collate/i, categories: [Keyword] });
var K_COLUMN = chevrotain_1.createToken({ name: "K_COLUMN", pattern: /column/i, categories: [Keyword] });
var K_COMMIT = chevrotain_1.createToken({ name: "K_COMMIT", pattern: /commit/i, categories: [Keyword] });
var K_CONFLICT = chevrotain_1.createToken({ name: "K_CONFLICT", pattern: /conflict/i, categories: [Keyword] });
var K_CONSTRAINT = chevrotain_1.createToken({ name: "K_CONSTRAINT", pattern: /constraint/i, categories: [Keyword] });
var K_CREATE = chevrotain_1.createToken({ name: "K_CREATE", pattern: /create/i, categories: [Keyword] });
var K_CROSS = chevrotain_1.createToken({ name: "K_CROSS", pattern: /cross/i, categories: [Keyword] });
var K_CURRENT_DATE = chevrotain_1.createToken({ name: "K_CURRENT_DATE", pattern: /current_date/i, categories: [Keyword] });
var K_CURRENT_TIME = chevrotain_1.createToken({ name: "K_CURRENT_TIME", pattern: /current_time/i, categories: [Keyword] });
var K_CURRENT_TIMESTAMP = chevrotain_1.createToken({ name: "K_CURRENT_TIMESTAMP", pattern: /current_timestamp/i, categories: [Keyword] });
var K_DATABASE = chevrotain_1.createToken({ name: "K_DATABASE", pattern: /database/i, categories: [Keyword] });
var K_DEFAULT = chevrotain_1.createToken({ name: "K_DEFAULT", pattern: /default/i, categories: [Keyword] });
var K_DEFERRABLE = chevrotain_1.createToken({ name: "K_DEFERRABLE", pattern: /deferrable/i, categories: [Keyword] });
var K_DEFERRED = chevrotain_1.createToken({ name: "K_DEFERRED", pattern: /deferred/i, categories: [Keyword] });
var K_DELETE = chevrotain_1.createToken({ name: "K_DELETE", pattern: /delete/i, categories: [Keyword] });
var K_DESC = chevrotain_1.createToken({ name: "K_DESC", pattern: /desc/i, categories: [Keyword] });
var K_DETACH = chevrotain_1.createToken({ name: "K_DETACH", pattern: /detach/i, categories: [Keyword] });
var K_DISTINCT = chevrotain_1.createToken({ name: "K_DISTINCT", pattern: /distinct/i, categories: [Keyword] });
var K_DROP = chevrotain_1.createToken({ name: "K_DROP", pattern: /drop/i, categories: [Keyword] });
var K_EACH = chevrotain_1.createToken({ name: "K_EACH", pattern: /each/i, categories: [Keyword] });
var K_ELSE = chevrotain_1.createToken({ name: "K_ELSE", pattern: /else/i, categories: [Keyword] });
var K_END = chevrotain_1.createToken({ name: "K_END", pattern: /end/i, categories: [Keyword] });
var K_ESCAPE = chevrotain_1.createToken({ name: "K_ESCAPE", pattern: /escape/i, categories: [Keyword] });
var K_EXCEPT = chevrotain_1.createToken({ name: "K_EXCEPT", pattern: /except/i, categories: [Keyword] });
var K_EXCLUSIVE = chevrotain_1.createToken({ name: "K_EXCLUSIVE", pattern: /exclusive/i, categories: [Keyword] });
var K_EXISTS = chevrotain_1.createToken({ name: "K_EXISTS", pattern: /exists/i, categories: [Keyword] });
var K_EXPLAIN = chevrotain_1.createToken({ name: "K_EXPLAIN", pattern: /explain/i, categories: [Keyword] });
var K_FAIL = chevrotain_1.createToken({ name: "K_FAIL", pattern: /fail/i, categories: [Keyword] });
var K_FOR = chevrotain_1.createToken({ name: "K_FOR", pattern: /for/i, categories: [Keyword] });
var K_FOREIGN = chevrotain_1.createToken({ name: "K_FOREIGN", pattern: /foreign/i, categories: [Keyword] });
var K_FROM = chevrotain_1.createToken({ name: "K_FROM", pattern: /from/i, categories: [Keyword] });
var K_FULL = chevrotain_1.createToken({ name: "K_FULL", pattern: /full/i, categories: [Keyword] });
var K_GLOB = chevrotain_1.createToken({ name: "K_GLOB", pattern: /glob/i, categories: [Keyword] });
var K_GROUP = chevrotain_1.createToken({ name: "K_GROUP", pattern: /group/i, categories: [Keyword] });
var K_HAVING = chevrotain_1.createToken({ name: "K_HAVING", pattern: /having/i, categories: [Keyword] });
var K_IF = chevrotain_1.createToken({ name: "K_IF", pattern: /if/i, categories: [Keyword] });
var K_IGNORE = chevrotain_1.createToken({ name: "K_IGNORE", pattern: /ignore/i, categories: [Keyword] });
var K_IMMEDIATE = chevrotain_1.createToken({ name: "K_IMMEDIATE", pattern: /immediate/i, categories: [Keyword] });
var K_IN = chevrotain_1.createToken({ name: "K_IN", pattern: /in/i, categories: [Keyword] });
var K_INDEX = chevrotain_1.createToken({ name: "K_INDEX", pattern: /index/i, categories: [Keyword] });
var K_INDEXED = chevrotain_1.createToken({ name: "K_INDEXED", pattern: /indexed/i, categories: [Keyword] });
var K_INITIALLY = chevrotain_1.createToken({ name: "K_INITIALLY", pattern: /initially/i, categories: [Keyword] });
var K_INNER = chevrotain_1.createToken({ name: "K_INNER", pattern: /inner/i, categories: [Keyword] });
var K_INSERT = chevrotain_1.createToken({ name: "K_INSERT", pattern: /insert/i, categories: [Keyword] });
var K_INSTEAD = chevrotain_1.createToken({ name: "K_INSTEAD", pattern: /instead/i, categories: [Keyword] });
var K_INTERSECT = chevrotain_1.createToken({ name: "K_INTERSECT", pattern: /intersect/i, categories: [Keyword] });
var K_INTO = chevrotain_1.createToken({ name: "K_INTO", pattern: /into/i, categories: [Keyword] });
var K_IS = chevrotain_1.createToken({ name: "K_IS", pattern: /is/i, categories: [Keyword] });
var K_ISNULL = chevrotain_1.createToken({ name: "K_ISNULL", pattern: /isnull/i, categories: [Keyword] });
var K_JOIN = chevrotain_1.createToken({ name: "K_JOIN", pattern: /join/i, categories: [Keyword] });
var K_KEY = chevrotain_1.createToken({ name: "K_KEY", pattern: /key/i, categories: [Keyword] });
var K_LEFT = chevrotain_1.createToken({ name: "K_LEFT", pattern: /left/i, categories: [Keyword] });
var K_LIKE = chevrotain_1.createToken({ name: "K_LIKE", pattern: /like/i, categories: [Keyword] });
var K_LIMIT = chevrotain_1.createToken({ name: "K_LIMIT", pattern: /limit/i, categories: [Keyword] });
var K_MATCH = chevrotain_1.createToken({ name: "K_MATCH", pattern: /match/i, categories: [Keyword] });
var K_NATURAL = chevrotain_1.createToken({ name: "K_NATURAL", pattern: /natural/i, categories: [Keyword] });
var K_NO = chevrotain_1.createToken({ name: "K_NO", pattern: /no/i, categories: [Keyword] });
var K_NOT = chevrotain_1.createToken({ name: "K_NOT", pattern: /not/i, categories: [Keyword] });
var K_NOTNULL = chevrotain_1.createToken({ name: "K_NOTNULL", pattern: /notnull/i, categories: [Keyword] });
var K_NULL = chevrotain_1.createToken({ name: "K_NULL", pattern: /null/i, categories: [Keyword] });
var K_OF = chevrotain_1.createToken({ name: "K_OF", pattern: /of/i, categories: [Keyword] });
var K_OFFSET = chevrotain_1.createToken({ name: "K_OFFSET", pattern: /offset/i, categories: [Keyword] });
var K_ON = chevrotain_1.createToken({ name: "K_ON", pattern: /on/i, categories: [Keyword] });
var K_OR = chevrotain_1.createToken({ name: "K_OR", pattern: /or/i, categories: [Keyword] });
var K_ORDER = chevrotain_1.createToken({ name: "K_ORDER", pattern: /order/i, categories: [Keyword] });
var K_OUTER = chevrotain_1.createToken({ name: "K_OUTER", pattern: /outer/i, categories: [Keyword] });
var K_PLAN = chevrotain_1.createToken({ name: "K_PLAN", pattern: /plan/i, categories: [Keyword] });
var K_PRAGMA = chevrotain_1.createToken({ name: "K_PRAGMA", pattern: /pragma/i, categories: [Keyword] });
var K_PRIMARY = chevrotain_1.createToken({ name: "K_PRIMARY", pattern: /primary/i, categories: [Keyword] });
var K_QUERY = chevrotain_1.createToken({ name: "K_QUERY", pattern: /query/i, categories: [Keyword] });
var K_RAISE = chevrotain_1.createToken({ name: "K_RAISE", pattern: /raise/i, categories: [Keyword] });
var K_RECURSIVE = chevrotain_1.createToken({ name: "K_RECURSIVE", pattern: /recursive/i, categories: [Keyword] });
var K_REFERENCES = chevrotain_1.createToken({ name: "K_REFERENCES", pattern: /references/i, categories: [Keyword] });
var K_REGEXP = chevrotain_1.createToken({ name: "K_REGEXP", pattern: /regexp/i, categories: [Keyword] });
var K_REINDEX = chevrotain_1.createToken({ name: "K_REINDEX", pattern: /reindex/i, categories: [Keyword] });
var K_RELEASE = chevrotain_1.createToken({ name: "K_RELEASE", pattern: /release/i, categories: [Keyword] });
var K_RENAME = chevrotain_1.createToken({ name: "K_RENAME", pattern: /rename/i, categories: [Keyword] });
var K_REPLACE = chevrotain_1.createToken({ name: "K_REPLACE", pattern: /replace/i, categories: [Keyword] });
var K_RESTRICT = chevrotain_1.createToken({ name: "K_RESTRICT", pattern: /restrict/i, categories: [Keyword] });
var K_RIGHT = chevrotain_1.createToken({ name: "K_RIGHT", pattern: /right/i, categories: [Keyword] });
var K_ROLLBACK = chevrotain_1.createToken({ name: "K_ROLLBACK", pattern: /rollback/i, categories: [Keyword] });
var K_ROW = chevrotain_1.createToken({ name: "K_ROW", pattern: /row/i, categories: [Keyword] });
var K_SAVEPOINT = chevrotain_1.createToken({ name: "K_SAVEPOINT", pattern: /savepoint/i, categories: [Keyword] });
var K_SELECT = chevrotain_1.createToken({ name: "K_SELECT", pattern: /select/i, categories: [Keyword] });
var K_SET = chevrotain_1.createToken({ name: "K_SET", pattern: /set/i, categories: [Keyword] });
var K_TABLE = chevrotain_1.createToken({ name: "K_TABLE", pattern: /table/i, categories: [Keyword] });
var K_TEMP = chevrotain_1.createToken({ name: "K_TEMP", pattern: /temp/i, categories: [Keyword] });
var K_TEMPORARY = chevrotain_1.createToken({ name: "K_TEMPORARY", pattern: /temporary/i, categories: [Keyword] });
var K_THEN = chevrotain_1.createToken({ name: "K_THEN", pattern: /then/i, categories: [Keyword] });
var K_TO = chevrotain_1.createToken({ name: "K_TO", pattern: /to/i, categories: [Keyword] });
var K_TRANSACTION = chevrotain_1.createToken({ name: "K_TRANSACTION", pattern: /transaction/i, categories: [Keyword] });
var K_TRIGGER = chevrotain_1.createToken({ name: "K_TRIGGER", pattern: /trigger/i, categories: [Keyword] });
var K_UNION = chevrotain_1.createToken({ name: "K_UNION", pattern: /union/i, categories: [Keyword] });
var K_UNIQUE = chevrotain_1.createToken({ name: "K_UNIQUE", pattern: /unique/i, categories: [Keyword] });
var K_UPDATE = chevrotain_1.createToken({ name: "K_UPDATE", pattern: /update/i, categories: [Keyword] });
var K_USING = chevrotain_1.createToken({ name: "K_USING", pattern: /using/i, categories: [Keyword] });
var K_VACUUM = chevrotain_1.createToken({ name: "K_VACUUM", pattern: /vacuum/i, categories: [Keyword] });
var K_VALUES = chevrotain_1.createToken({ name: "K_VALUES", pattern: /values/i, categories: [Keyword] });
var K_VIEW = chevrotain_1.createToken({ name: "K_VIEW", pattern: /view/i, categories: [Keyword] });
var K_VIRTUAL = chevrotain_1.createToken({ name: "K_VIRTUAL", pattern: /virtual/i, categories: [Keyword] });
var K_WHEN = chevrotain_1.createToken({ name: "K_WHEN", pattern: /when/i, categories: [Keyword] });
var K_WHERE = chevrotain_1.createToken({ name: "K_WHERE", pattern: /where/i, categories: [Keyword] });
var K_WITH = chevrotain_1.createToken({ name: "K_WITH", pattern: /with/i, categories: [Keyword] });
var K_WITHOUT = chevrotain_1.createToken({ name: "K_WITHOUT", pattern: /without/i, categories: [Keyword] });
var keywordTokens = [
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
];
var allTokens = [
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
    NotEq2
].concat(keywordTokens, [
    Keyword,
    // Literals
    Identifier,
    BindParameter,
    StringLiteral,
    NumericLiteral,
    BlobLiteral,
    // Commentings
    SinglelineComment,
    MultilineComment,
]);
var SelectLexer = new chevrotain_1.Lexer(allTokens);
var SelectSqlParser = /** @class */ (function (_super) {
    __extends(SelectSqlParser, _super);
    function SelectSqlParser() {
        var _this = _super.call(this, allTokens, {
            maxLookahead: 4,
            ignoredIssues: {
                select_core: {
                    OR2: true
                },
                table_or_subquery: {
                    OR: true,
                    OR2: true,
                },
                result_column: {
                    OR: true,
                },
                atomic_expr: {
                    OR: true,
                },
                syntax_expr: {
                    OR4: true
                }
            }
        }) || this;
        // In TypeScript the parsing rules are explicitly defined as class instance properties
        // This allows for using access control (public/private/protected) and more importantly "informs" the TypeScript compiler
        // about the API of our Parser, so referencing an invalid rule name (this.SUBRULE(this.oopsType);)
        // is now a TypeScript compilation error.
        _this.sql_stmt = _this.RULE("sql_stmt", function () {
            _this.SUBRULE(_this.select_stmt);
        });
        /**
         * Select statement
         */
        _this.select_stmt = _this.RULE("select_stmt", function () {
            _this.OPTION(function () { return _this.SUBRULE(_this.with_clause); });
            _this.SUBRULE(_this.select_core);
            _this.MANY(function () {
                _this.SUBRULE(_this.compound_operator);
                _this.SUBRULE2(_this.select_core);
            });
            _this.OPTION2(function () {
                _this.CONSUME(K_ORDER);
                _this.CONSUME(K_BY);
                _this.AT_LEAST_ONE_SEP({
                    SEP: Comma,
                    DEF: function () { return _this.SUBRULE(_this.ordering_term); }
                });
            });
            _this.OPTION3(function () {
                _this.CONSUME(K_LIMIT);
                _this.SUBRULE(_this.expr);
                _this.OPTION4(function () {
                    _this.OR([
                        { ALT: function () { return _this.CONSUME(K_OFFSET); } },
                        { ALT: function () { return _this.CONSUME(Comma); } },
                    ]);
                    _this.SUBRULE1(_this.expr);
                });
            });
        });
        /**
         * Select core
         */
        _this.select_core = _this.RULE("select_core", function () {
            _this.OR([
                { ALT: function () {
                        _this.CONSUME(K_SELECT);
                        _this.OPTION(function () {
                            _this.OR1([
                                { ALT: function () { return _this.CONSUME(K_DISTINCT); } },
                                { ALT: function () { return _this.CONSUME(K_ALL); } },
                            ]);
                        });
                        _this.AT_LEAST_ONE_SEP({
                            SEP: Comma,
                            DEF: function () { return _this.SUBRULE(_this.result_column); }
                        });
                        _this.CONSUME(K_FROM); // K_FROM
                        _this.SUBRULE(_this.table_or_subquery);
                        _this.OPTION3(function () {
                            _this.CONSUME(K_WHERE);
                            _this.SUBRULE(_this.expr);
                        });
                        _this.OPTION4(function () {
                            _this.CONSUME(K_GROUP);
                            _this.CONSUME1(K_BY);
                            _this.AT_LEAST_ONE_SEP2({
                                SEP: Comma,
                                DEF: _this.SUBRULE1(_this.expr),
                            });
                            _this.OPTION5(function () {
                                _this.CONSUME(K_HAVING);
                                _this.SUBRULE2(_this.expr);
                            });
                        });
                    } },
                { ALT: function () {
                        _this.CONSUME(K_VALUES);
                        _this.CONSUME(OpenPar);
                        _this.AT_LEAST_ONE_SEP3({
                            SEP: Comma,
                            DEF: function () { return _this.SUBRULE3(_this.expr); }
                        });
                        _this.CONSUME(ClosePar);
                        _this.OPTION6(function () {
                            _this.CONSUME(Comma);
                            _this.CONSUME1(OpenPar);
                            _this.AT_LEAST_ONE_SEP4({
                                SEP: Comma,
                                DEF: function () { return _this.SUBRULE4(_this.expr); }
                            });
                            _this.CONSUME1(ClosePar);
                        });
                    } }
            ]);
        });
        /**
         * Type name
         */
        _this.type_name = _this.RULE("type_name", function () {
            _this.AT_LEAST_ONE(function () { return _this.SUBRULE(_this.name); });
            _this.OPTION(function () {
                _this.CONSUME(OpenPar);
                _this.MANY_SEP({
                    SEP: Comma,
                    DEF: function () { return _this.SUBRULE(_this.signed_number); }
                });
                _this.CONSUME(ClosePar);
            });
        });
        // TODO
        _this.expr = _this.RULE("expr", function () {
            _this.SUBRULE(_this.or_expr);
            // this.OR([
            //   { ALT: () => this.SUBRULE(this.or_expr) },
            //   // NOT IMPLEMENT: function_name '(' ( K_DISTINCT? expr ( ',' expr )* | '*' )? ')'
            //   { ALT: () => {
            //     this.CONSUME(OpenPar)
            //     this.SUBRULE5(this.expr)
            //     this.CONSUME(ClosePar)
            //   }},
            //   { ALT: () => {
            //     this.CONSUME(K_CAST)
            //     this.CONSUME1(OpenPar)
            //     this.SUBRULE6(this.expr)
            //     this.CONSUME(K_AS)
            //     this.SUBRULE(this.type_name)
            //     this.CONSUME1(ClosePar)
            //   }},
            //   // TODO rest after K_COLLATE
            // ])
        });
        _this.atomic_expr = _this.RULE("atomic_expr", function () {
            _this.OR([
                { ALT: function () { return _this.SUBRULE(_this.literal_value); } },
                { ALT: function () { return _this.CONSUME(BindParameter); } },
                { ALT: function () {
                        _this.OPTION(function () {
                            _this.OPTION2(function () {
                                _this.SUBRULE(_this.database_name);
                                _this.CONSUME(Dot);
                            });
                            _this.SUBRULE(_this.table_name);
                            _this.CONSUME1(Dot);
                        });
                        _this.SUBRULE(_this.column_name);
                    } },
                { ALT: function () {
                        _this.SUBRULE(_this.unary_operator);
                        _this.SUBRULE(_this.expr);
                    } },
            ]);
        });
        /**
         * Pipe expr
         */
        _this.pipe_expr = _this.RULE("pipe_expr", function () {
            _this.SUBRULE(_this.atomic_expr);
            _this.MANY(function () {
                _this.CONSUME(Pipe2);
                _this.SUBRULE1(_this.atomic_expr);
            });
        });
        /**
         * Math1 expr
         */
        _this.multiplication_expr = _this.RULE("multiplication_expr", function () {
            _this.SUBRULE(_this.pipe_expr);
            _this.MANY(function () {
                _this.OR([
                    { ALT: function () { return _this.CONSUME(Star); } },
                    { ALT: function () { return _this.CONSUME(Div); } },
                    { ALT: function () { return _this.CONSUME(Mod); } },
                ]);
                _this.SUBRULE1(_this.pipe_expr);
            });
        });
        /**
         * Math2 expr
         */
        _this.addition_expr = _this.RULE("addition_expr", function () {
            _this.SUBRULE(_this.multiplication_expr);
            _this.MANY(function () {
                _this.OR([
                    { ALT: function () { return _this.CONSUME(Plus); } },
                    { ALT: function () { return _this.CONSUME(Minus); } },
                ]);
                _this.SUBRULE1(_this.multiplication_expr);
            });
        });
        /**
         * Binary expr
         */
        _this.binary_expr = _this.RULE("binary_expr", function () {
            _this.SUBRULE(_this.addition_expr);
            _this.MANY(function () {
                _this.OR([
                    { ALT: function () { return _this.CONSUME(Lt2); } },
                    { ALT: function () { return _this.CONSUME(Gt2); } },
                    { ALT: function () { return _this.CONSUME(Amp); } },
                    { ALT: function () { return _this.CONSUME(Pipe); } },
                ]);
                _this.SUBRULE1(_this.addition_expr);
            });
        });
        /**
         * Syntax expr
         */
        _this.syntax_expr = _this.RULE("syntax_expr", function () {
            _this.SUBRULE(_this.binary_expr);
            _this.MANY(function () {
                _this.OR4([
                    { ALT: function () { return _this.CONSUME(Assign); } },
                    { ALT: function () { return _this.CONSUME(Eq); } },
                    { ALT: function () { return _this.CONSUME(NotEq1); } },
                    { ALT: function () { return _this.CONSUME(NotEq2); } },
                    { ALT: function () { return _this.CONSUME(K_IS); } },
                    { ALT: function () {
                            _this.CONSUME1(K_IS);
                            _this.CONSUME(K_NOT);
                        } },
                    { ALT: function () { return _this.CONSUME(K_IN); } },
                    { ALT: function () { return _this.CONSUME(K_LIKE); } },
                    { ALT: function () { return _this.CONSUME(K_GLOB); } },
                    { ALT: function () { return _this.CONSUME(K_MATCH); } },
                    { ALT: function () { return _this.CONSUME(K_REGEXP); } },
                ]);
                _this.SUBRULE1(_this.binary_expr);
            });
        });
        /**
         * And expr
         */
        _this.and_expr = _this.RULE("and_expr", function () {
            _this.SUBRULE(_this.syntax_expr);
            _this.MANY(function () {
                _this.CONSUME(K_AND);
                _this.SUBRULE1(_this.syntax_expr);
            });
        });
        /**
         * Or expr
         */
        _this.or_expr = _this.RULE("or_expr", function () {
            _this.SUBRULE(_this.and_expr);
            _this.MANY(function () {
                _this.CONSUME(K_OR);
                _this.SUBRULE1(_this.and_expr);
            });
        });
        /**
         * Ordering term
         */
        _this.ordering_term = _this.RULE("ordering_term", function () {
            _this.SUBRULE(_this.expr);
            _this.OPTION(function () {
                _this.CONSUME(K_COLLATE);
                _this.SUBRULE(_this.collation_name);
            });
            _this.OPTION2(function () {
                _this.OR([
                    { ALT: function () { return _this.CONSUME(K_ASC); } },
                    { ALT: function () { return _this.CONSUME(K_DESC); } },
                ]);
            });
        });
        /**
         * Result column
         */
        _this.result_column = _this.RULE("result_column", function () {
            _this.OR([
                { ALT: function () { return _this.CONSUME(Star); } },
                { ALT: function () {
                        _this.SUBRULE(_this.any_name);
                        _this.CONSUME(Dot);
                        _this.CONSUME1(Star);
                    } },
                { ALT: function () {
                        _this.SUBRULE(_this.expr);
                        _this.OPTION(function () {
                            _this.OPTION2(function () { return _this.CONSUME(K_AS); });
                            _this.SUBRULE(_this.column_alias);
                        });
                    } },
            ]);
        });
        /**
         * Table or subquery
         */
        _this.table_or_subquery = _this.RULE("table_or_subquery", function () {
            _this.OR([
                { ALT: function () {
                        // TODO
                        _this.OPTION(function () {
                            _this.SUBRULE(_this.database_name);
                            _this.CONSUME(Dot);
                        });
                        _this.SUBRULE(_this.table_name);
                        _this.OPTION2(function () {
                            _this.OPTION3(function () { return _this.CONSUME(K_AS); });
                            _this.SUBRULE(_this.table_alias);
                        });
                        _this.OPTION4(function () {
                            _this.OR1([
                                { ALT: function () {
                                        _this.CONSUME(K_INDEXED);
                                        _this.CONSUME(K_BY);
                                        _this.SUBRULE(_this.index_name);
                                    } },
                                { ALT: function () {
                                        _this.CONSUME(K_NOT);
                                        _this.CONSUME1(K_INDEXED);
                                    } },
                            ]);
                        });
                    } },
                { ALT: function () {
                        _this.CONSUME(OpenPar);
                        _this.OR2([
                            { ALT: function () {
                                    _this.AT_LEAST_ONE_SEP({
                                        SEP: Comma,
                                        DEF: function () { return _this.SUBRULE(_this.table_or_subquery); }
                                    });
                                } },
                            { ALT: function () { return _this.SUBRULE(_this.join_clause); } },
                        ]);
                        _this.CONSUME(ClosePar);
                        _this.OPTION5(function () {
                            _this.OPTION6(function () { return _this.CONSUME1(K_AS); });
                            _this.SUBRULE1(_this.table_alias);
                        });
                    } },
                { ALT: function () {
                        _this.CONSUME1(OpenPar);
                        _this.SUBRULE(_this.select_stmt);
                        _this.CONSUME1(ClosePar);
                        _this.OPTION7(function () {
                            _this.OPTION8(function () { return _this.CONSUME2(K_AS); });
                            _this.SUBRULE2(_this.table_alias);
                        });
                    } },
            ]);
        });
        /**
         * Join clause
         */
        _this.join_clause = _this.RULE("join_clause", function () {
            _this.SUBRULE(_this.table_or_subquery);
            _this.MANY(function () {
                _this.SUBRULE(_this.join_operator);
                _this.SUBRULE1(_this.table_or_subquery);
                _this.SUBRULE(_this.join_constraint);
            });
        });
        /**
         * Join operator
         */
        _this.join_operator = _this.RULE("join_operator", function () {
            _this.OR([
                { ALT: function () { return _this.CONSUME(Comma); } },
                { ALT: function () {
                        _this.OPTION(function () { return _this.CONSUME(K_NATURAL); });
                        _this.OPTION2(function () {
                            _this.OR1([
                                { ALT: function () {
                                        _this.CONSUME(K_LEFT);
                                        _this.OPTION3(function () { return _this.CONSUME(K_OUTER); });
                                    } },
                                { ALT: function () { return _this.CONSUME(K_INNER); } },
                                { ALT: function () { return _this.CONSUME(K_CROSS); } },
                            ]);
                        });
                        _this.CONSUME(K_JOIN);
                    } },
            ]);
        });
        /**
         * Join constraint
         */
        _this.join_constraint = _this.RULE("join_constraint", function () {
            _this.OPTION(function () {
                _this.OR([
                    { ALT: function () {
                            _this.CONSUME(K_ON);
                            _this.SUBRULE(_this.expr);
                        } },
                    { ALT: function () {
                            _this.CONSUME(K_USING);
                            _this.CONSUME(OpenPar);
                            _this.AT_LEAST_ONE_SEP({
                                SEP: Comma,
                                DEF: function () { return _this.SUBRULE(_this.column_name); }
                            });
                            _this.CONSUME(ClosePar);
                        } },
                ]);
            });
        });
        /**
         * With clause
         */
        _this.with_clause = _this.RULE("with_clause", function () {
            _this.CONSUME(K_WITH);
            _this.OPTION(function () { return _this.CONSUME(K_RECURSIVE); });
            _this.AT_LEAST_ONE_SEP({
                SEP: Comma,
                DEF: function () { return _this.SUBRULE(_this.common_table_expression); }
            });
        });
        /**
         * Common table expression
         */
        _this.common_table_expression = _this.RULE("common_table_expression", function () {
            _this.SUBRULE(_this.table_name);
            _this.OPTION(function () {
                _this.CONSUME(OpenPar);
                _this.AT_LEAST_ONE_SEP({
                    SEP: Comma,
                    DEF: function () {
                        _this.SUBRULE(_this.column_name);
                    }
                });
                _this.CONSUME(ClosePar);
            });
            _this.CONSUME(K_AS);
            _this.CONSUME1(OpenPar);
            _this.SUBRULE(_this.select_stmt);
            _this.CONSUME1(ClosePar);
        });
        _this.compound_operator = _this.RULE("compound_operator", function () {
            _this.OR([
                { ALT: function () {
                        _this.CONSUME(K_UNION);
                        _this.OPTION(function () { return _this.CONSUME(K_ALL); });
                    } },
                { ALT: function () { return _this.CONSUME(K_INTERSECT); } },
                { ALT: function () { return _this.CONSUME(K_EXCEPT); } },
            ]);
        });
        /**
         * Signed number
         */
        _this.signed_number = _this.RULE("signed_number", function () {
            _this.OPTION(function () {
                _this.OR([
                    { ALT: function () { return _this.CONSUME(Plus); } },
                    { ALT: function () { return _this.CONSUME(Minus); } },
                ]);
            });
            _this.CONSUME(NumericLiteral);
        });
        /**
         * Literal value
         */
        _this.literal_value = _this.RULE("literal_value", function () {
            _this.OR([
                { ALT: function () { return _this.CONSUME(NumericLiteral); } },
                { ALT: function () { return _this.CONSUME(StringLiteral); } },
                { ALT: function () { return _this.CONSUME(BlobLiteral); } },
                { ALT: function () { return _this.CONSUME(K_NULL); } },
                { ALT: function () { return _this.CONSUME(K_CURRENT_TIME); } },
                { ALT: function () { return _this.CONSUME(K_CURRENT_DATE); } },
                { ALT: function () { return _this.CONSUME(K_CURRENT_TIMESTAMP); } },
            ]);
        });
        /**
         * Unary operator
         */
        _this.unary_operator = _this.RULE("unary_operator", function () {
            _this.OR([
                { ALT: function () { return _this.CONSUME(Minus); } },
                { ALT: function () { return _this.CONSUME(Plus); } },
                { ALT: function () { return _this.CONSUME(Tilde); } },
                { ALT: function () { return _this.CONSUME(K_NOT); } },
            ]);
        });
        /**
         * Column alias
         */
        _this.column_alias = _this.RULE("column_alias", function () {
            _this.OR([
                { ALT: function () { return _this.CONSUME(Identifier); } },
                { ALT: function () { return _this.CONSUME(StringLiteral); } },
            ]);
        });
        /**
         * Names
         */
        _this.name = _this.RULE("name", function () { return _this.SUBRULE(_this.any_name); });
        _this.collation_name = _this.RULE("collation_name", function () { return _this.SUBRULE(_this.any_name); });
        _this.database_name = _this.RULE("database_name", function () { return _this.SUBRULE(_this.any_name); });
        _this.table_name = _this.RULE("table_name", function () { return _this.SUBRULE(_this.any_name); });
        _this.table_alias = _this.RULE("table_alias", function () { return _this.SUBRULE(_this.any_name); });
        _this.column_name = _this.RULE("column_name", function () { return _this.SUBRULE(_this.any_name); });
        _this.index_name = _this.RULE("index_name", function () { return _this.SUBRULE(_this.any_name); });
        /**
         * Can be function_name database_name table_name column_name collation_name index_name table_alias
         */
        _this.any_name = _this.RULE("any_name", function () {
            _this.OR([
                { ALT: function () { return _this.CONSUME(Identifier); } },
                { ALT: function () { return _this.CONSUME(Keyword); } },
                { ALT: function () { return _this.CONSUME(StringLiteral); } },
                { ALT: function () {
                        _this.CONSUME(OpenPar);
                        _this.SUBRULE(_this.any_name);
                        _this.CONSUME(ClosePar);
                    } },
            ]);
        });
        _this.performSelfAnalysis();
        return _this;
    }
    return SelectSqlParser;
}(chevrotain_1.Parser));
// reuse the same parser instance.
var parser = new SelectSqlParser();
function parse(text) {
    var lexResult = SelectLexer.tokenize(text);
    // setting a new input will RESET the parser instance's state.
    parser.input = lexResult.tokens;
    // any top level rule may be used as an entry point
    var cst = parser.sql_stmt();
    // this would be a TypeScript compilation error because our parser now has a clear API.
    // let value = parser.json_OopsTypo()
    return {
        // This is a pure grammar, the value will be undefined until we add embedded actions
        // or enable automatic CST creation.
        cst: cst,
        lexErrors: lexResult.errors,
        parseErrors: parser.errors
    };
}
exports.parse = parse;
