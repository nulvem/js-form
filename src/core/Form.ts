import { Errors } from './Errors'
import { Field, FieldDeclaration, Fields } from '../types/fields'
import { objectToFormData } from '../utils/helpers'
import { generateFieldDeclaration } from '../utils/fields'
import { Rules } from './Rules'
import { Messages } from './Messages'
import axios from 'axios'
import { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { validations as Validate } from '../utils/validations'
import warn from '../utils/warn'

export class Form {

  public $axios: AxiosInstance

  public $errors: Errors = new Errors()

  public $rules: Rules = new Rules()

  public $messages: Messages = new Messages()

  public $options

  public $initialValues: Fields = {}

  public $submitting: boolean = false

  public constructor(
    fields: {},
    options: {}
  ) {
    this.addFields(fields)
    this.addOptions(options)
    this.createHttpInstance()
  }

  public createHttpInstance() {
    this.$axios = axios
  }

  /**
   * fill
   */
  public fill(
    data: { [key: string]: any },
    updateInitialValues: boolean = false
  ) {
    Object.keys(data).forEach((field: string) => {
      let value = data[field]

      if (updateInitialValues) {
        this.$initialValues[field] = value
      }

      this[field] = value
    })

    return this
  }

  /**
   * getFieldsKeys
   */
  public $getFieldsKeys(): string[] {
    return Object.keys(this.$initialValues)
  }

  /**
   * addField
   */
  public addField(
    field: string,
    value: Field
  ) {
    const fieldDeclaration: FieldDeclaration = generateFieldDeclaration(value)

    this[field] = fieldDeclaration.value

    this.$initialValues[field] = fieldDeclaration.value

    this.$messages.push(field, fieldDeclaration.validation.messages)
    this.$rules.push(field, fieldDeclaration.validation.rules)

    return this
  }

  /**
   * addFields
   */
  public addFields(fields: Fields) {
    Object.keys(fields).forEach((field: string): void => {
      this.addField(field, fields[field])
    })

    return this
  }

  /**
   * addOptions
   */
  public addOptions(options: object) {
    this.$options = options || {}

    return this
  }

  /**
   * getField
   */
  public getField(field: string) {
    return this[field]
  }

  /**
   * removeField
   */
  public removeField(field: string) {
    delete this[field]
    delete this.$initialValues[field]

    this.$messages.unset(field)
    this.$rules.unset(field)

    return this
  }

  /**
   * removeFields
   */
  public removeFields(fields: string[]) {
    fields.forEach((field: string): void => {
      this.removeField(field)
    })

    return this
  }

  /**
   * valuespublic
   */
  public values() {
    const values = {}

    this.$getFieldsKeys().forEach((field: string): void => {
      let value = this[field]

      values[field] = value
    })

    return values
  }

  /**
   * valuesAsFormData
   */
  public $valuesAsFormData(): FormData {
    return objectToFormData(this.values)
  }

  /**
   * valuesAsFormJson
   */
  public $valuesAsFormJson() {
    return JSON.stringify(this.values)
  }

  /**
   * reset
   */
  public $reset() {
    this.resetValues()
    this.$errors.clear()

    return this
  }

  /**
   * resetValues
   */
  public resetValues() {
    this.fill(this.$initialValues)

    return this
  }

  /**
   * $validateField
   */
  public async $validateField(field: string): Promise<any> {
    this.$errors.unset(field)

    const value: any = this.getField(field)

    const rules: string[] = this.$rules.get(field)

    const promises = rules.map(
      (rule: string): Promise<any> => {
        if (Validate[rule]) {
          return Validate[rule](value)
          .then(() => {
            return Promise.resolve()
          })
          .catch((error) => {
            const message = this.$messages.get(field)

            if (message) {
              this.$errors.push(field, message[rule])
            }

            return Promise.reject(error)
          })
        }

        warn(`There is no validation rule called "${rule}"`)

        return Promise.reject()
      }
    )

    return Promise.all(promises)
  }

  /**
   * $validateForm
   */
  public $validateForm(): Promise<any> {
    const promises = this.$getFieldsKeys().map(
      (field: string): Promise<any> => {
        return this.$validateField(field)
      }
    )

    return Promise.all(promises)
  }

  /**
   * validate
   */
  public $validate(field: string | null): Promise<any> {
    return field ? this.$validateField(field) : this.$validateForm()
  }

  /**
   * Post handle
   *
   * @param url
   */
  public async post(url: string) {
    return await this.submit('post', url)
  }

  /**
   * Submit the form
   *
   * @param method
   * @param url
   */
  public submit(method: string, url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.$axios[method](url, this.values())
        .then((response: { data: AxiosResponse }) => {
          let data = response
          this.onSuccess(data, true)
          resolve(data)
        })
        .catch((error: { response: { data: { errors: AxiosError }; status: number } }) => {
          let data = error.response.data
          if (error.response.status === 422) {
            this.onFail(error.response.data.errors)
          } else {
            this.onFail(data)
          }
          reject(data)
        })
    })
  }

  /**
   * Handle a successful form submission
   *
   * @param response
   * @param resetForm
   */
  public onSuccess(response: { data: AxiosResponse }, resetForm: boolean) {
    if (resetForm) {
      this.$reset()
    }

    return response
  }

  /**
   * Handle a failed form submission
   *
   * @param errors
   */
  public onFail(errors: any) {
    this.$errors.fill(errors)
  }
}
