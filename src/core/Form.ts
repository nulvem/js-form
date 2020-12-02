import { Errors } from './Errors'
import { Field, FieldDeclaration, Fields } from '../types/fields'
import { objectToFormData } from '../utils/helpers'
import { generateFieldDeclaration } from '../utils/fields'
import { Rules } from './Rules'
import { Messages } from './Messages'

export class Form {
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
  public valuesAsFormData(): FormData {
    return objectToFormData(this.values)
  }

  /**
   * valuesAsFormJson
   */
  public valuesAsFormJson() {
    return JSON.stringify(this.values)
  }

  /**
   * reset
   */
  public reset() {
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
    // this.$validating.push(fieldKey)

    // const defaultMessage = createRuleMessageFunction(
    //   this.$options.validation.defaultMessage
    // )
    // const field: Field = this.$getField(fieldKey)

    // let fieldRulesChain: (Rule | ConditionalRules)[] = Array.from(
    //   this.$rules.get(fieldKey)
    // )

    // while (fieldRulesChain.length) {
    //   let rule = fieldRulesChain.shift()

    //   if (rule === undefined) {
    //     continue
    //   }

    //   try {
    //     if (rule instanceof ConditionalRules) {
    //       rule.condition(field, this) &&
    //         (fieldRulesChain = [...rule.all(), ...fieldRulesChain])

    //       continue
    //     }

    //     await rule.validate(field, this, defaultMessage)
    //   } catch (error) {
    //     // If the error is not a RuleValidationError - the error will bubble up
    //     if (!(error instanceof RuleValidationError)) {
    //       throw error
    //     }

    //     this.$errors.push(fieldKey, error.message)

    //     this.$options.validation.stopAfterFirstRuleFailed &&
    //       (fieldRulesChain = [])
    //   }
    // }

    // this.$validating.unset(fieldKey)
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
   * submit
   */
  // public submit(): Promise<any> {
  // }
}
