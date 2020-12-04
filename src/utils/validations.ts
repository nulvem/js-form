export const isBigInt = (value: any): boolean => {
  return typeof value === 'bigint' || typeof BigInt(value) === 'bigint'
}

export const isBool = (value: any): boolean => {
  return typeof value === 'boolean'
}

export const isBooly = (value: any): boolean => {
  return isBool(value) || isFalsy(value) || isTruthy(value)
}

export const isEmpty = (value: any): boolean => {
  if (value === null || value === '') return true

  if (Array.isArray(value)) return value.length === 0

	if (typeof value === 'object') return Object.keys(value).length === 0

	if (isNumeric(value) || isBooly(value)) return false

	return true
}

export const isFalsy = (value: any): boolean => {
  const falsy = [
		0, '0',
		'no', 'No', 'NO',
		'off', 'Off', 'OFF',
		false, 'false', 'False', 'FALSE'
	]

	return falsy.includes(value)
}

export const isNotEmpty = (value: any) : boolean => {
  return isEmpty(value) === false
}

export const isNotNull = (value: any) : boolean => {
  return value !== null && value !== 'null'
}

export const isNotUndefined = (value: any) : boolean => {
  return typeof value !== undefined && typeof value !== 'undefined'
}

export const isNumber = (value: any): boolean => {
  return typeof value === 'number'
}

export const isNumeric = (value: any): boolean => {
  return (isNumber(value) || typeof Number(value) === 'number' || isBigInt(value))
}

export const isTruthy = (value: any): boolean => {
	const truthy = [
		1, '1',
		'on', 'On', 'ON',
		'yes', 'Yes', 'YES',
		true, 'true', 'True', 'TRUE'
	]

	return truthy.includes(value)
}

export const validations = {
  required: (value): Promise<any> => {
    let condition = true === (isNotNull(value) && isNotUndefined(value) && isNotEmpty(value))

    return condition ?
      Promise.resolve(value) :
      Promise.reject(value)
  }
}
