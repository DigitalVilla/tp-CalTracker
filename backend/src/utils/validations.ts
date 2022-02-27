export const isValid: Record<string, (opt?: any) => any> = {
  fullName: ({ value, key = 'fullName', max = 60, throws = false }) => {
    const err: Record<string, any> = new Error()
    err.code = 400

    if (typeof value !== 'string') err.message = `${key} should be a string`
    else if (value.length > max)
      err.message = `${key} is larger than ${max} characters`
    else if (
      !/^[A-Z-. ]{2,60}$/i.test(value) &&
      value.replace(/[\s-.]/g, '').length >= 4
    )
      err.message = `${key} can oly contain these characters: '-' '.'`

    if (!throws) return err.message
    throw err
  },
  username: ({ value, max = 40, key = 'username', throws = false }) => {
    const err: Record<string, any> = new Error()
    err.code = 400

    if (typeof value !== 'string') err.message = `${key} should be a string`
    else if (value.length > max)
      err.message = `${key} is larger than ${max} characters`
    else if (
      !/^[A-Z0-9-. ]{2,40}$/i.test(value) &&
      value.replace(/[\s-_.]/g, '').length >= 2
    )
      err.message = `${key} can oly contain these characters: [-, ., _, '] `

    if (!throws) return err.message
    throw err
  },
  websiteURL: ({ value, throws = false }) => {
    if (/^[a-z0-9:/]+[.]+[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i.test(value))
      return
    const err: Record<string, any> = new Error('enter a valid web url')
    err.code = 400
    if (!throws) return err.message
    throw err
  },
  email: ({ value, key = 'email', max = 120, throws = false }) => {
    const err: Record<string, any> = new Error()
    err.code = 400
    if (typeof value !== 'string') err.message = `${key} should be a string`
    else if (value.length > max)
      err.message = `${key} is larger than ${max} characters`
    else if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
        value
      )
    )
      err.message = `${key} should be in a valid format`
    if (!throws) return err.message
    throw err
  },
  phone: ({ value, throws = false }) => {
    if (
      /(\+?( |-|\.)?\d{1,2}( |-|\.)?)?(\(?\d{3}\)?|\d{3})( |-|\.)?(\d{3}( |-|\.)?\d{4})/.test(
        value
      )
    ) {
      const length = value.replace(/[\s-]/g, '').length
      if (length === 10) return
      if (value.includes('+')) return
    }
    const err: Record<string, any> = new Error('enter a valid 10 digit number')
    err.code = 400
    if (!throws) return err.message
    throw err
  },
  password: ({
    value,
    key = 'password',
    max = 60,
    min = 8,
    throws = false,
  }) => {
    const err: Record<string, any> = new Error()
    err.code = 400

    if (typeof value !== 'string') err.message = `${key} should be a string`
    else if (value.length > max)
      err.message = `${key} is larger than ${max} characters`
    else if (value.length < min)
      err.message = `${key} is shorter than ${min} characters`
    else if (!/[A-Z]/.test(value))
      err.message = `${key} should have uppercase letters`
    else if (!/[a-z]/.test(value))
      err.message = `${key} should have lowercase letters`
    else if (!/[0-9]/.test(value)) err.message = `${key} should have numbers`
    if (err.message && !throws) return err.message
    if (err.message) throw err
  },
  number: ({
    value,
    key = 'Number',
    range = [-Infinity, Infinity],
    throws,
  }) => {
    const isNumber =
      typeof value === 'number' &&
      !isNaN(value) &&
      !isNaN(parseFloat(`${value}`))
    const err: Record<string, any> = new Error()
    err.code = 400

    if (!isNumber) err.message = `${key || value} must be a number`
    else if (value < range[0] || value > range[1])
      err.message = `${key || value} should be between ${range[0]} and ${
        range[1]
      }`

    if (err.message && !throws) return err.message
    if (err.message) throw err
  },
  enum: ({ value, enums = [], throws }) => {
    const err: Record<string, any> = new Error()
    err.code = 400

    if (!enums.includes(value))
      err.message = `${value} must be within [${enums}]`
    if (err.message && !throws) return err.message
    if (err.message) throw err
  },
  string: ({ value, max = 50, throws, key }) => {
    const err: Record<string, any> = new Error()
    err.code = 400

    if (!value || typeof value !== 'string')
      err.message = `${key || value} should be a valid string`
    else if (value.length > max)
      err.message = `${key || value} is larger than ${max} characters`
    if (err.message && !throws) return err.message
    if (err.message) throw err
  },
  dateString: ({ value, throws, key }) => {
    const err: Record<string, any> = new Error()
    err.code = 400
    try {
      if (typeof value !== 'string') throw false
      const d = new Date(value)
      if (!d.getFullYear()) throw false
    } catch (error) {
      err.message = `${key || value} should be a valid date string`
      if (err.message && !throws) return err.message
      if (err.message) throw err
    }
  },
  boolean: ({ value, throws, key }) => {
    if (typeof value !== 'boolean') {
      const err: Record<string, any> = new Error(
        `${key || value} should be a valid boolean`
      )
      err.code = 400
      if (err.message && !throws) return err.message
      if (err.message) throw err
    }
  },
}
