import { parser } from './select-parser'
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

    let table = this.visit(ctx.join_clause)

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
  expr(ctx: any) {
    return this.visit(ctx.or_expr)
  }
  atomic_expr(ctx: any) {
    let target
    if (target = ctx.$expr) return this.visit(target)
    if (target = ctx.$function) return this.visit(target)
    if (target = ctx.$literal) return this.visit(target)
    if (target = ctx.$bind) return this.visit(target)
    if (target = ctx.$column) return this.visit(target)
    if (target = ctx.$unary_operator) return this.visit(target)
    if (target = ctx.$cast) return this.visit(target)
  }
  atomic_expr$expr(ctx: any) {
    return this.visit(ctx.expr)
  }
  atomic_expr$function(ctx: any) {
    return {
      type: 'FUNCTION',
      distinct: !!ctx.DISTINCT,
      parameter: ctx.expr((v: any) => this.visit(v)),
      star: !!ctx.Star
    }
  }
  atomic_expr$literal(ctx: any) {
    return this.visit(ctx.literal_value)
  }
  atomic_expr$bind(ctx: any) {
    return {
      type: 'BIND',
      bind: ctx.BindParameter[0].image
    }
  }
  atomic_expr$column(ctx: any) {
    return {
      type: 'COLUMN_NAME',
      database: this.visit(ctx.database_name),
      table: this.visit(ctx.table_name),
      column: this.visit(ctx.column_name),
    }
  }
  atomic_expr$unary_operator(ctx: any) {
    return {
      type: 'UNARY_OPERATOR',
      operator: this.visit(ctx.unary_operator),
      expr: this.visit(ctx.expr)
    }
  }
  atomic_expr$cast(ctx: any) {
    return {
      type: 'CAST',
      expr: this.visit(ctx.expr),
      typeName: this.visit(ctx.type_name)
    }
  }
  pipe_expr(ctx: any) {
    if (ctx.atomic_expr.length === 1) {
      return this.visit(ctx.atomic_expr[0])
    } else {
      return {
        type: 'PIPE',
        expr: ctx.atomic_expr.map((v: any) => this.visit(v))
      }
    }
  }
  multiplication_expr(ctx: any) {
    if (ctx.pipe_expr.length === 1) {
      return this.visit(ctx.pipe_expr[0])
    } else {
      let symbol
      _.forIn(ctx, (value, key) => {
        if (key !== 'pipe_expr') {
          symbol = _.toUpper(value[0].image)
        }
      })
      return {
        type: 'MULTIPLICATION',
        symbol: symbol,
        expr: ctx.pipe_expr.map((v: any) => this.visit(v))
      }
    }
  }
  addition_expr(ctx: any) {
    if (ctx.multiplication_expr.length === 1) {
      return this.visit(ctx.multiplication_expr[0])
    } else {
      let symbol
      _.forIn(ctx, (value, key) => {
        if (key !== 'multiplication_expr') {
          symbol = _.toUpper(value[0].image)
        }
      })
      return {
        type: 'ADDITION',
        symbol: symbol,
        expr: ctx.multiplication_expr.map((v: any) => this.visit(v))
      }
    }
  }
  binary_expr(ctx: any) {
    if (ctx.addition_expr.length === 1) {
      return this.visit(ctx.addition_expr[0])
    } else {
      let symbol
      _.forIn(ctx, (value, key) => {
        if (key !== 'addition_expr') {
          symbol = _.toUpper(value[0].image)
        }
      })
      return {
        type: 'BINARY',
        symbol: symbol,
        expr: ctx.addition_expr.map((v: any) => this.visit(v))
      }
    }
  }
  compare_expr2(ctx: any) {
    if (ctx.binary_expr.length === 1) {
      return this.visit(ctx.binary_expr[0])
    } else {
      let symbol
      _.forIn(ctx, (value, key) => {
        if (key !== 'binary_expr') {
          symbol = _.toUpper(value[0].image)
        }
      })
      return {
        type: 'COMPARE2',
        symbol: symbol,
        expr: ctx.binary_expr.map((v: any) => this.visit(v))
      }
    }
  }
  compare_expr1(ctx: any) {
    if (ctx.compare_expr2.length === 1) {
      return this.visit(ctx.compare_expr2[0])
    } else {
      let symbol
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
        type: 'COMPARE1',
        symbol: symbol,
        expr: ctx.compare_expr2.map((v: any) => this.visit(v))
      }
    }
  }
  and_expr(ctx: any) {
    if (ctx.compare_expr1.length === 1) {
      return this.visit(ctx.compare_expr1[0])
    } else {
      return {
        type: 'AND',
        expr: ctx.compare_expr1.map((v: any) => this.visit(v))
      }
    }
  }
  or_expr(ctx: any) {
    if (ctx.and_expr.length === 1) {
      return this.visit(ctx.and_expr[0])
    } else {
      return {
        type: 'OR',
        expr: ctx.and_expr.map((v: any) => this.visit(v))
      }
    }
  }
  ordering_term(ctx: any) {
    return {
      type: 'ORDER_ITEM',
      order: this.visit(ctx.expr),
      collation: this.visit(ctx.collation_name),
      asc: !!ctx.ASC,
      desc: !!ctx.desc,
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
  // TODO
  table_or_subquery$nested(ctx: any) {
    const errorName = 'Subqyery'
    throw new Error('NOT IMPLEMENTED: ' + errorName)
  }
  // TODO
  table_or_subquery$select_stmt(ctx: any) {
    const errorName = 'Subqyery'
    throw new Error('NOT IMPLEMENTED: ' + errorName)
  }
  join_clause(ctx: any) {
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
  literal_value(ctx: any) {
    let value
    let target
    if (target = ctx.NumericLiteral) value = target[0].image
    if (target = ctx.StringLiteral) value = target[0].image.slice(1, -1)
    if (target = ctx.BlobLiteral) value = target[0].image
    return {
      type: 'LITERAL_VALUE',
      value: value,
      symbol: _.keys(ctx)[0],
    }
  }
  unary_operator(ctx: any) {
    let value
    if (ctx.Minus) value = '-'
    if (ctx.Plus) value = '+'
    if (ctx.Tilde) value = '~'
    if (ctx.NOT) value = 'NOT'
    return {
      type: 'UNARY_OPERATOR',
      operator: value,
    }
  }
  column_alias(ctx: any) {
    return this.visit(ctx.any_name)
  }
  name(ctx: any) {
    return this.visit(ctx.any_name)
  }
  type_name(ctx: any) {
    return this.visit(ctx.any_name)
  }
  collation_name(ctx: any) {
    return this.visit(ctx.any_name)
  }
  function_name(ctx: any) {
    return this.visit(ctx.any_name)
  }
  database_name(ctx: any) {
    return this.visit(ctx.any_name)
  }
  table_name(ctx: any) {
    return this.visit(ctx.any_name)
  }
  table_alias(ctx: any) {
    return this.visit(ctx.any_name)
  }
  column_name(ctx: any) {
    return this.visit(ctx.any_name)
  }
  index_name(ctx: any) {
    return this.visit(ctx.any_name)
  }
  /**
   * any_name
   * @param ctx 
   */
  any_name(ctx: any) {
    let name
    if (ctx.Identifier) name = ctx.Identifier[0].image
    if (['`', '"', '['].indexOf(name[0])) name = name.slice(1, -1)
    if (ctx.StringLiteral) name = ctx.StringLiteral[0].image.slice(1, -1)
    if (ctx.any_name) {
      return this.visit(ctx.any_name)
    }
    return {
      type: 'NAME',
      name: name,
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