export class Errors {
  /**
   * Stack errors
   */
  private errors: object

  /**
   * Create a new Errors instance
   */
  public constructor() {
    this.errors = {}
  }

  /**
   * Determine if an errors exists for the given field
   */
  public has(field: string) {
    return this.errors.hasOwnProperty(field)
  }

  /**
  * first
  */
  public first(
    field: string
  ) {
    return this.get(field, false)
  }

  /**
   * Determine if we have any errors
   */
  public any() {
    return Object.keys(this.errors).length > 0
  }

  /**
   * Retrieve the error message for a field
   */
  public get(
    field: string,
    asArray = true
  ) {
    const error = this.errors[field]

    if (error) {
      return asArray ? error : error[0]
    }

    return null
  }

  /**
   * Retrieve all errors
   */
  public getAll() {
    return this.errors
  }

  /**
   * Record the new errors
   */
  public record(data: any) {
    if (typeof data === 'object') {
      if (data.response && data.response.data && data.response.data.errors) {
        this.errors = data.response.data.errors
      }
    } else if (data.isArray()) {
      this.errors = data
    } else {
      this.errors = {}
    }
  }

  /**
   * Clear one or all error fields
   */
  public clear(field: string = null) {
    if (field) {
      delete this.errors[field]

      return
    }

    this.errors = {}
  }
}
