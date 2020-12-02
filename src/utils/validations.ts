export const validations = {
  required: (value): Promise<any> => {
    return value ?
      Promise.resolve(value) :
      Promise.reject(value)
  }
}
