export const isValid: Record<string, (opt?: any) => any> = {
  fullName: ({ value, silent = false }) => {
    if (
      /^[A-Z-. ]{2,40}$/i.test(value) &&
      value.replace(/[\s-.]/g, '').length >= 4
    )
      return
    const err: Record<string, any> = new Error('Enter a valid name')
    err.code = 400
    if (silent) return err.message
    throw err
  },
  username: ({ value, silent = false }) => {
    if (
      /^[A-Z0-9-. ]{2,40}$/i.test(value) &&
      value.replace(/[\s-.]/g, '').length >= 2
    )
      return
    const err: Record<string, any> = new Error('Enter a valid username')
    err.code = 400
    if (silent) return err.message
    throw err
  },
  websiteURL: ({ value, silent = false }) => {
    if (/^[a-z0-9:/]+[.]+[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i.test(value))
      return
    const err: Record<string, any> = new Error('Enter a valid web url')
    err.code = 400
    if (silent) return err.message
    throw err
  },
  email: ({ value, silent = false }) => {
    if (
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
        value
      )
    )
      return
    const err: Record<string, any> = new Error('Enter a valid email')
    err.code = 400
    if (silent) return err.message
    throw err
  },
  phone: ({ value, silent = false }) => {
    if (
      /(\+?( |-|\.)?\d{1,2}( |-|\.)?)?(\(?\d{3}\)?|\d{3})( |-|\.)?(\d{3}( |-|\.)?\d{4})/.test(
        value
      )
    ) {
      const length = value.replace(/[\s-]/g, '').length
      if (length === 10) return
      if (value.includes('+')) return
    }
    const err: Record<string, any> = new Error('Enter a valid 10 digit number')
    err.code = 400
    if (silent) return err.message
    throw err
  },
  password: ({ value, silent = false }) => {
    const err: Record<string, any> = new Error()
    err.code = 400
    if (value.length < 8) err.message = 'Password is less than 8 characters'
    else if (!/[A-Z]/.test(value))
      err.message = 'Password missing Uppercase letters'
    else if (!/[a-z]/.test(value))
      err.message = 'Password missing Lowercase letters'
    else if (!/[0-9]/.test(value)) err.message = 'Password missing Numbers'
    if (err.message && silent) return err.message
    if (err.message) throw err
  },
  number: ({
    value,
    key = 'Number',
    range = [-Infinity, Infinity],
    silent,
  }) => {
    const isNumber = !isNaN(value) && !isNaN(parseFloat(`${value}`))
    const err: Record<string, any> = new Error()
    err.code = 400

    if (!isNumber) err.message = `Key '${key}' is not a valid Number`
    else if (value < range[0] || value > range[1])
      err.message = `Key '${key}' should be between ${range[0]} and ${range[1]}`

    if (err.message && silent) return err.message
    if (err.message) throw err
  },
}
