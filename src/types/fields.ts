export interface Field {
  rules?: object,
  reset?: boolean,
  value: any
}

export interface FieldDeclaration {
  rules: object,
  reset: boolean,
  value: any
}

export interface Fields {
  [key: string]: Field
}
