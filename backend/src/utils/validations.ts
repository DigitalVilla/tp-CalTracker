export const isInvalid: Record<string, (v: string) => string | undefined> = {
  fullName: (v) => {
    if (/^[A-Z-. ]{2,40}$/i.test(v) && v.replace(/[\s-.]/g, '').length >= 4)
      return
    return 'Enter a valid name'
  },
  businessName: (v) => {
    if (/^[A-Z0-9-. ]{2,40}$/i.test(v) && v.replace(/[\s-.]/g, '').length >= 2)
      return
    return 'Enter a valid business name'
  },
  websiteURL: (v) => {
    if (/^[a-z0-9:/]+[.]+[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/i.test(v)) return
    return 'Enter a valid web url'
  },
  email: (v) => {
    if (
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
        v
      )
    )
      return
    return 'Enter a valid email'
  },
  phone: (v) => {
    if (
      /(\+?( |-|\.)?\d{1,2}( |-|\.)?)?(\(?\d{3}\)?|\d{3})( |-|\.)?(\d{3}( |-|\.)?\d{4})/.test(
        v
      )
    ) {
      const length = v.replace(/[\s-]/g, '').length
      if (length === 10) return
      if (v.includes('+')) return
    }
    return 'Enter a valid 10 digit number'
  },
  password: (v) => {
    if (v.length < 8) return 'Password is less than 8 characters'
    if (!/[A-Z]/.test(v)) return 'Password missing Uppercase letters'
    if (!/[a-z]/.test(v)) return 'Password missing Lowercase letters'
    if (!/[0-9]/.test(v)) return 'Password missing Numbers'
  },
}
