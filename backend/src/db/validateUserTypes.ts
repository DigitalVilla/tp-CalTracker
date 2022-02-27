import { isValid as is } from '../utils/validations'

export function validateUserTypes(user: Record<string, any>) {
  const has = (k: string) => typeof user[k] !== 'undefined'

  const errors = [
    has('verified') && is.boolean({ value: user.verified, key: 'verified' }),
    has('email') && is.email({ value: user.email }),
    has('email') && is.password({ value: user.password }),
    has('username') && is.username({ value: user.username, key: 'username' }),
    has('age') && is.number({ value: user.age, range: [12, 120], key: 'age' }),
    has('role') && is.number({ value: user.role, range: [0, 4], key: 'role' }),
    has('budget') &&
      is.number({
        value: user.budget,
        range: [100, 20000],
        key: 'budget',
      }),
    has('maxCals') &&
      is.number({
        value: user.maxCals,
        range: [100, 1e4],
        key: 'maxCals',
      }),
  ].filter((d) => d)

  return errors.length ? errors : null
}
