import { FieldDeclaration } from '../types/fields'

export const generateFieldDeclaration = (value: any): FieldDeclaration => {
  return {
    rules: value.hasOwnProperty('rules') ? value.rules : [],
    reset: value.hasOwnProperty('reset') ? value.reset : true,
    value: value.hasOwnProperty('value') ? value.value : value || null
  }
}
