
export interface IAstBase {
  type: string
}

export type IAtomicExpression = IFunctionExpression | ILiteralValue | IBind | IColumn | IUnaryOperator | ICast
export type IExpression = IOperatorExpression | IAtomicExpression

export type IFunctionExpression = IFunctionExpressionNormal | IFunctionExpressionStar

export interface IFunctionExpressionNormal extends IAstBase {
  type: 'FUNCTION'
  function: IName
  isDistinct: boolean
  parameters: any
}
export interface IFunctionExpressionStar extends IAstBase {
  type: 'FUNCTION'
  function: IName
  isStar: boolean
}

export interface IOperatorExpression extends IAstBase {
  type: 'OPERATOR'
  operator: string
  expr: any
}

export interface ILiteralValue extends IAstBase {
  type: 'NUMERIC' | 'STRING' | 'BLOB' | 'NULL' | 'CURRENT_TIME' | 'CURRENT_DATE' | 'CURRENT_TIMESTAMP'
  value: string
}

export interface IBind extends IAstBase {
  type: 'BIND'
  bind: string
}

export interface IColumn extends IAstBase {
  type: 'COLUMN'
  column: IName
  table: IName
  database: IName
}

export interface IUnaryOperator extends IAstBase {
  type: 'UNARY_OPERATOR'
  operator: string
  expr: any
}

export interface ICast extends IAstBase {
  type: 'CAST'
  cast: IName
  expr: any
}

export interface IOrder extends IAstBase {
  type: 'ORDER'
  order: IExpression
  collation: IName
  isAsc: boolean
  isDesc: boolean
}

export interface IName extends IAstBase {
  type: 'NAME'
  name: string
  text: string
}
