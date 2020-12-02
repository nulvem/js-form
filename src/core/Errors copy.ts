export class Errors {
  // /**
  //  * Stack data
  //  */
  public data: object = {}

  /**
   * Determine if an data exists for the given field
   */
  public has(
    field: string
  ): boolean {
    return this.data.hasOwnProperty(field)
  }

  /**
  * first
  */
  public first(
    field: string
  ): string | string[] {
    return this.get(field, false)
  }

  /**
   * Determine if we have any data
   */
  public any(): boolean {
    return Object.keys(this.data).length > 0
  }

  /**
   * Retrieve the error message for a field
   */
  public get(
    field: string,
    asArray = true
  ): string | string[] {
    const error = this.data[field]

    if (error) {
      return asArray ? error : error[0]
    }

    return null
  }

  /**
   * Retrieve all data
   */
  public getAll(): object {
    return this.data
  }

  /**
   * Record the new data
   */
  public record(
    data: object[] | object
  ): void {
    // if (data.response && data.response.data && data.response.data.errors) {
    //   this.errors = data.response.data.errors
    // }
    if (typeof data === 'object') {
      Object.keys(data).forEach((field: string) => {
        this.data[field] = data[field]
      })
    } else if (Array.isArray(data)) {
      this.data = data
    }
  }

  /**
   * Clear one or all error fields
   */
  public clear(field: string = null): void {
    field ?
      this.data[field] :
      this.data = {}
  }
}
