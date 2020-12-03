export const validations = {
  required: (value): Promise<any> => {
    return value || value === false ?
      Promise.resolve(value) :
      Promise.reject(value)
  }
}
