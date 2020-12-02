const isProduction: boolean = process.env.NODE_ENV === 'production'

/**
 * Warn an error if NODE_ENV is not production
 *
 * @param message
 */
export default (message: string): void => {
  if (!isProduction) {
    console.warn(`[js-form warn]: ${message}`)
  }

}
