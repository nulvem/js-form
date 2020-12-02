import { Validation } from './validations'

export interface Field {
  validation?: object,
  reset?: boolean,
  value: any
}

export interface FieldDeclaration {
  validation: Validation,
  reset: boolean,
  value: any
}

export interface Fields {
  [key: string]: Field
}
