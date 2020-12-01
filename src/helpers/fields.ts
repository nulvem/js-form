import { FieldDeclaration } from '../types/fields'

export const generateFieldDeclaration = (value: any): FieldDeclaration => {
  return {
    rules: value.rules || [],
    reset: value.reset || true,
    value: value.value || null
  }
}
