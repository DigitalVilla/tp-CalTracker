export const isValid: Record<string, (opt?: any) => any> = {
  fullName: ({ value, throws = false }) => {
    if (
      /^[A-Z-. ]{2,40}$/i.test(value) &&
      value.replace(/[\s-.]/g, '').length >= 4
    )
      return
    const err: Record<string, any> = new Error('enter a valid name')
    err.code = 400
    if (!throws) return err.message
    throw err
  },
  username: ({ value, throws = false }) => {
    if (
      /^[A-Z0-9-. ]{2,40}$/i.test(value) &&
      value.replace(/[\s-.]/g, '').length >= 2
    )
      return
    const err: Record<string, any> = new Error('enter a valid username')
    err.code = 400
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
  email: ({ value, throws = false }) => {
    if (
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
        value
      )
    )
      return
    const err: Record<string, any> = new Error('enter a valid email')
    err.code = 400
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
  password: ({ value, throws = false }) => {
    const err: Record<string, any> = new Error()
    err.code = 400
    if (value.length < 8) err.message = 'password is less than 8 characters'
    else if (!/[A-Z]/.test(value))
      err.message = 'password missing Uppercase letters'
    else if (!/[a-z]/.test(value))
      err.message = 'password missing Lowercase letters'
    else if (!/[0-9]/.test(value)) err.message = 'password missing Numbers'
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
