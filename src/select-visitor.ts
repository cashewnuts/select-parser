import { parser } from './select-parser'

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

    return {
      type: 'SELECT_CLAUSE',
      select: columns,
      from: table,
      where: null,
      distinct: !!ctx.DISTINCT,
      groupBy: null,
      having: null,
    }
  }
  expr(ctx: any) {
    return {
      type: "EXPRESSION",
    }
  }
  atomic_expr(ctx: any) {
    return {
      type: 'TYPE_NAME',
    }
  }
  pipe_expr(ctx: any) {
    return {
      type: 'TYPE_NAME',
    }
  }
  multiplication_expr(ctx: any) {
    return {
      type: 'TYPE_NAME',
    }
  }
  addition_expr(ctx: any) {
    return {
      type: 'TYPE_NAME',
    }
  }
  binary_expr(ctx: any) {
    return {
      type: 'TYPE_NAME',
    }
  }
  compare_expr(ctx: any) {
    return {
      type: 'TYPE_NAME',
    }
  }
  syntax_expr(ctx: any) {
    return {
      type: 'TYPE_NAME',
    }
  }
  and_expr(ctx: any) {
    return {
      type: 'TYPE_NAME',
    }
  }
  or_expr(ctx: any) {
    return {
      type: 'TYPE_NAME',
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
  // TODO
  join_constraint(ctx: any) {
    console.log(ctx)
    return {
      type: 'JOIN_CONSTRAINT',
    }
  }
  with_clause(ctx: any) {
    return {
      type: 'TYPE_NAME',
    }
  }
  common_table_expression(ctx: any) {
    return {
      type: 'TYPE_NAME',
    }
  }
  compound_operator(ctx: any) {
    return {
      type: 'TYPE_NAME',
    }
  }
  signed_number(ctx: any) {
    return {
      type: 'TYPE_NAME',
    }
  }
  literal_value(ctx: any) {
    return {
      type: 'TYPE_NAME',
    }
  }
  unary_operator(ctx: any) {
    return {
      type: 'TYPE_NAME',
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
    if (ctx.StringLiteral) name = ctx.StringLiteral[0].image
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