import { parser } from './select-parser'
import * as Types from './select-visitor-interface'
import * as _ from 'lodash'

export const BaseSelectVisitor = parser.getBaseCstVisitorConstructor()
export const BaseSelectVisitorWithDefautls = parser.getBaseCstVisitorConstructorWithDefaults()

export class SelectVisitor extends BaseSelectVisitor {
  constructor() {
    super()
    // The "validateVisitor" method is a helper utility which performs static analysis
    // to detect missing or redundant visitor methods
    this.validateVisitor()
  }

  /* Visit methods go here */
  sql_stmt(ctx: any) {
    let sqlStmt = this.visit(ctx.select_stmt)
    return {
      type: 'SQL_STMT',
      statements: sqlStmt
    }
  }
  /**
   * Select statements includes compound operator
   * like UNION, INTERSECT
   * @param ctx
   */
  select_stmt(ctx: any) {
    let selects = ctx.select_core.map((v: any) => this.visit(v))
    let compounds
    if (ctx.compound_operator) {
      compounds = ctx.compound_operator.map((v: any) => this.visit(v))
    }

    let orderBy
    if (ctx.ordering_term) {
      orderBy = {
        type: 'ORDER_BY',
        orders: ctx.ordering_term.map((v: any) => this.visit(v))
      }
    }
    let limit
    if (ctx.LIMIT) {
      limit = {
        type: 'LIMIT',
        limit: ctx.expr[0],
        offset: ctx.expr[1],
      }
    }
    return {
      type: 'SELECT_STMT',
      selects: selects,
      compounds: compounds,
      orderBy: orderBy,
      limit: limit,
    }
  }
  select_core(ctx: any) {
    let columns = ctx.result_column.map((v:any) => this.visit(v))

    let table = this.visit(ctx.from_list)

    let where
    if (ctx.WHERE) {
      where = this.visit(ctx.expr.shift())
    }

    return {
      type: 'SELECT_CLAUSE',
      select: columns,
      from: table,
      where: where,
      distinct: !!ctx.DISTINCT,
      groupBy: null,
      having: null,
    }
  }
  expr(ctx: any): Types.IExpression {
    return this.visit(ctx.or_expr)
  }
  atomic_expr(ctx: any): Types.IAtomicExpression {
    let target
    if (target = ctx.$expr) return this.visit(target)
    if (target = ctx.$function) return this.visit(target)
    if (target = ctx.$literal) return this.visit(target)
    if (target = ctx.$bind) return this.visit(target)
    if (target = ctx.$column) return this.visit(target)
    if (target = ctx.$unary_operator) return this.visit(target)
    if (target = ctx.$cast) return this.visit(target)
    throw new Error('UNKNOWN ATOMIC EXPRESSION')
  }
  atomic_expr$expr(ctx: any): Types.IExpression {
    return this.visit(ctx.expr)
  }
  atomic_expr$function(ctx: any): Types.IFunctionExpression {
    let functionName = this.visit(ctx.function_name)
    if (ctx.Star) {
      return {
        type: 'FUNCTION',
        function: functionName,
        isStar: true
      }
    }
    return {
      type: 'FUNCTION',
      function: functionName,
      isDistinct: !!ctx.DISTINCT,
      parameters: ctx.expr((v: any) => this.visit(v)),
    }
  }
  atomic_expr$literal(ctx: any): Types.ILiteralValue {
    return this.visit(ctx.literal_value)
  }
  atomic_expr$bind(ctx: any): Types.IBind {
    let bind = ctx.BindParameter[0].image
    return {
      type: 'BIND',
      bind: bind
    }
  }
  atomic_expr$column(ctx: any): Types.IColumn {
    return {
      type: 'COLUMN',
      database: this.visit(ctx.database_name),
      table: this.visit(ctx.table_name),
      column: this.visit(ctx.column_name),
    }
  }
  atomic_expr$unary_operator(ctx: any): Types.IUnaryOperator {
    return {
      type: 'UNARY_OPERATOR',
      operator: this.visit(ctx.unary_operator),
      expr: this.visit(ctx.expr)
    }
  }
  atomic_expr$cast(ctx: any): Types.ICast {
    return {
      type: 'CAST',
      cast: this.visit(ctx.type_name),
      expr: this.visit(ctx.expr),
    }
  }
  pipe_expr(ctx: any): Types.IOperatorExpression | Types.IAtomicExpression {
    if (ctx.atomic_expr.length === 1) {
      return this.visit(ctx.atomic_expr[0])
    } else {
      return {
        type: 'OPERATOR',
        operator: 'PIPE',
        expr: ctx.atomic_expr.map((v: any) => this.visit(v))
      }
    }
  }
  multiplication_expr(ctx: any): Types.IOperatorExpression | Types.IAtomicExpression {
    if (ctx.pipe_expr.length === 1) {
      return this.visit(ctx.pipe_expr[0])
    } else {
      let symbol = ''
      _.forIn(ctx, (value, key) => {
        if (key !== 'pipe_expr') {
          symbol = _.toUpper(value[0].image)
        }
      })
      return {
        type: 'OPERATOR',
        operator: symbol,
        expr: ctx.pipe_expr.map((v: any) => this.visit(v))
      }
    }
  }
  addition_expr(ctx: any): Types.IOperatorExpression | Types.IAtomicExpression {
    if (ctx.multiplication_expr.length === 1) {
      return this.visit(ctx.multiplication_expr[0])
    } else {
      let symbol = ''
      _.forIn(ctx, (value, key) => {
        if (key !== 'multiplication_expr') {
          symbol = _.toUpper(value[0].image)
        }
      })
      return {
        type: 'OPERATOR',
        operator: symbol,
        expr: ctx.multiplication_expr.map((v: any) => this.visit(v))
      }
    }
  }
  binary_expr(ctx: any): Types.IOperatorExpression | Types.IAtomicExpression {
    if (ctx.addition_expr.length === 1) {
      return this.visit(ctx.addition_expr[0])
    } else {
      let symbol: string = ''
      _.forIn(ctx, (value, key) => {
        if (key !== 'addition_expr') {
          symbol = _.toUpper(value[0].image)
        }
      })
      return {
        type: 'OPERATOR',
        operator: symbol,
        expr: ctx.addition_expr.map((v: any) => this.visit(v))
      }
    }
  }
  compare_expr2(ctx: any): Types.IOperatorExpression | Types.IAtomicExpression {
    if (ctx.binary_expr.length === 1) {
      return this.visit(ctx.binary_expr[0])
    } else {
      let symbol = ''
      _.forIn(ctx, (value, key) => {
        if (key !== 'binary_expr') {
          symbol = _.toUpper(value[0].image)
        }
      })
      return {
        type: 'OPERATOR',
        operator: symbol,
        expr: ctx.binary_expr.map((v: any) => this.visit(v))
      }
    }
  }
  compare_expr1(ctx: any): Types.IOperatorExpression | Types.IAtomicExpression {
    if (ctx.compare_expr2.length === 1) {
      return this.visit(ctx.compare_expr2[0])
    } else {
      let symbol = ''
      if (ctx.IS) {
        symbol = 'IS'
        if (ctx.NOT) symbol += '_NOT'
      } else {
        _.forIn(ctx, (value, key) => {
          if (key !== 'compare_expr2') {
            symbol = _.toUpper(value[0].image)
          }
        })
      }
      return {
        type: 'OPERATOR',
        operator: symbol,
        expr: ctx.compare_expr2.map((v: any) => this.visit(v))
      }
    }
  }
  and_expr(ctx: any): Types.IOperatorExpression | Types.IAtomicExpression {
    if (ctx.compare_expr1.length === 1) {
      return this.visit(ctx.compare_expr1[0])
    } else {
      return {
        type: 'OPERATOR',
        operator: 'AND',
        expr: ctx.compare_expr1.map((v: any) => this.visit(v))
      }
    }
  }
  or_expr(ctx: any): Types.IOperatorExpression | Types.IAtomicExpression {
    if (ctx.and_expr.length === 1) {
      return this.visit(ctx.and_expr[0])
    } else {
      return {
        type: 'OPERATOR',
        operator: 'OR',
        expr: ctx.and_expr.map((v: any) => this.visit(v))
      }
    }
  }
  ordering_term(ctx: any): Types.IOrder {
    let isAsc = !ctx.DESC
    return {
      type: 'ORDER',
      order: this.visit(ctx.expr),
      collation: this.visit(ctx.collation_name),
      isAsc: isAsc,
      isDesc: !isAsc
    }
  }
  result_column(ctx: any) {
    let col
    if (ctx.$star) col = this.visit(ctx.$star)
    if (ctx.$table_star) col = this.visit(ctx.$table_star)
    if (ctx.$column_expr) col = this.visit(ctx.$column_expr)
    return {
      type: 'COLUMN',
      ...col
    }
  }
  result_column$star(ctx: any) {
    return {
      column: '*'
    }
  }
  result_column$table_star(ctx: any) {
    return {
      column: '*',
      table: this.visit(ctx.table_name)
    }
  }
  result_column$column_expr(ctx: any) {
    return {
      column: this.visit(ctx.expr),
      alias: this.visit(ctx.column_alias)
    }
  }
  /**
   * table_or_subquery
   * @param ctx 
   */
  table_or_subquery(ctx: any) {
    let table
    if (ctx.$table) {
      table = this.visit(ctx.$table)
    }
    if (ctx.$nested) {
      table = this.visit(ctx.$nested)
    }
    if (ctx.$select_stmt) {
      table = this.visit(ctx.$select_stmt)
    }
    return {
      type: 'TABLE',
      ...table,
      tableAlias: this.visit(ctx.table_alias)
    }
  }
  /**
   * table_or_subquery -> $table
   * @param ctx 
   */
  table_or_subquery$table(ctx: any) {
    return {
      table: this.visit(ctx.table_name),
      database: this.visit(ctx.database_name),
    }
  }
  /**
   * table_or_subquery -> $nested
   * @param ctx 
   */
  table_or_subquery$nested(ctx: any) {
    return {
      from: this.visit(ctx.from_list)
    }
  }
  /**
   * table_or_subquery -> $select_stmt
   * @param ctx 
   */
  table_or_subquery$select_stmt(ctx: any) {
    return {
      from: this.visit(ctx.select_stmt)
    }
  }
  from_list(ctx: any) {
    const tables = ctx.table_or_subquery.map((v: any) => this.visit(v))
    if (tables.length === 1) {
      return tables[0]
    }
    let joinOperators
    if (ctx.join_operator) {
      joinOperators = ctx.join_operator.map((v: any) => this.visit(v))
    }
    let constraints
    if (ctx.join_constraint) {
      constraints = ctx.join_constraint.map((v: any) => this.visit(v))
    }
    return {
      type: 'JOIN',
      table: tables,
      operator: joinOperators,
      constraint: constraints
    }
  }
  join_operator(ctx: any) {
    let operator
    if (ctx.Comma) operator = ','
    if (ctx.NATURAL) operator = 'NATURAL'
    if (ctx.LEFT) operator = 'LEFT_OUTER'
    if (ctx.RIGHT) operator = 'RIGHT_OUTER'
    if (ctx.FULL) operator = 'FULL_OUTER'
    if (ctx.INNER) operator = 'INNER'
    if (ctx.CROSS) operator = 'CROSS'

    if (!operator) operator = 'JOIN'

    return {
      type: 'JOIN_OPERATOR',
      operator: operator,
    }
  }
  join_constraint(ctx: any) {
    if (ctx.ON) {
      return {
        type: 'JOIN_ON',
        expr: this.visit(ctx.expr),
      }
    }
    if (ctx.USING) {
      let columns = ctx.column_name.map((v: any) => this.visit(v))
      return {
        type: 'JOIN_USING',
        columns: columns,
      }
    }
  }
  with_clause(ctx: any) {
    let commonTable = ctx.common_table_expression.map((v: any) => this.visit(v))
    return {
      type: 'WITH_CLAUSE',
      recursive: !!ctx.RECURSIVE,
      commonTable: commonTable,
    }
  }
  common_table_expression(ctx: any) {
    return {
      type: 'COMMAN_TABLE_EXPRESSION',
      columns: ctx.column_name.map((v: any) => this.visit(v)),
      select: this.visit(ctx.select_stmt)
    }
  }
  compound_operator(ctx: any) {
    let symbol
    if (ctx.UNION) symbol = 'UNION'
    if (ctx.ALL) symbol += '_ALL'
    if (ctx.INTERSECT) symbol = 'INTERSECT'
    if (ctx.EXCEPT) symbol = 'EXCEPT'
    return {
      type: 'COMPOUND_OPERATOR',
      symbol: symbol,
    }
  }
  signed_number(ctx: any) {
    let sign
    if (ctx.Plus) sign = '+'
    if (ctx.Minus) sign = '-'
    return {
      type: 'TYPE_NAME',
      sign: sign,
      value: ctx.NumericLiteral[0].image
    }
  }
  literal_value(ctx: any): Types.ILiteralValue {
    let value
    let target
    let type: 'NUMERIC' | 'STRING' | 'BLOB' | 'NULL' | 'CURRENT_TIME' | 'CURRENT_DATE' | 'CURRENT_TIMESTAMP' = 'NULL'
    if (target = ctx.NumericLiteral) {
      type = 'NUMERIC'
      value = target[0].image
    }
    if (target = ctx.StringLiteral) {
      type = 'STRING'
      value = target[0].image.slice(1, -1)
    }
    if (target = ctx.BlobLiteral) {
      type = 'BLOB'
      value = target[0].image
    }
    if (ctx.NULL) type = 'NULL'
    if (ctx.CURRENT_TIME) type = 'CURRENT_TIME'
    if (ctx.CURRENT_DATE) type = 'CURRENT_DATE'
    if (ctx.CURRENT_TIMESTAMP) type = 'CURRENT_TIMESTAMP'
    return {
      type: type,
      value: value,
    }
  }
  unary_operator(ctx: any): string {
    let value = ''
    if (ctx.Minus) value = '-'
    if (ctx.Plus) value = '+'
    if (ctx.Tilde) value = '~'
    if (ctx.NOT) value = 'NOT'
    return value
  }
  column_alias(ctx: any): Types.IName {
    return this.visit(ctx.any_name)
  }
  name(ctx: any): Types.IName {
    return this.visit(ctx.any_name)
  }
  type_name(ctx: any): Types.IName {
    return this.visit(ctx.any_name)
  }
  collation_name(ctx: any): Types.IName {
    return this.visit(ctx.any_name)
  }
  function_name(ctx: any): Types.IName {
    return this.visit(ctx.any_name)
  }
  database_name(ctx: any): Types.IName {
    return this.visit(ctx.any_name)
  }
  table_name(ctx: any): Types.IName {
    return this.visit(ctx.any_name)
  }
  table_alias(ctx: any): Types.IName {
    return this.visit(ctx.any_name)
  }
  column_name(ctx: any): Types.IName {
    return this.visit(ctx.any_name)
  }
  index_name(ctx: any): Types.IName {
    return this.visit(ctx.any_name)
  }
  /**
   * any_name
   * @param ctx 
   */
  any_name(ctx: any): Types.IName {
    let name
    let text
    if (ctx.Identifier) {
      name = text = ctx.Identifier[0].image
      if (['`', '"', '['].indexOf(name[0])) name = name.slice(1, -1)
    }
    if (ctx.StringLiteral) {
      text = ctx.StringLiteral[0].image
      name = text.slice(1, -1)
    }
    if (ctx.any_name) {
      return this.visit(ctx.any_name)
    }
    return {
      type: 'NAME',
      name: name,
      text: text,
    }
  }

}

export class SelectVisitorWithDefaults extends BaseSelectVisitorWithDefautls {
  constructor() {
      super()
      this.validateVisitor()
  }

  /* Visit methods go here */
}