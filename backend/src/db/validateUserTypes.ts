import { isValid } from '../utils/validations'

export function validateUserTypes(user: Record<string, any>) {
  const errors = [
    user.verified && isValid.boolean({ value: user.verified, key: 'verified' }),
    user.email && isValid.email({ value: user.email }),
    user.email && isValid.password({ value: user.password }),
    user.username && isValid.string({ value: user.username, key: 'username' }),
    user.age &&
      isValid.number({ value: user.age, range: [12, 120], key: 'age' }),
    user.role &&
      isValid.number({ value: user.role, range: [0, 54000], key: 'role' }),
    user.budget &&
      isValid.number({
        value: user.budget,
        range: [100, 10000],
        key: 'budget',
      }),
    user.maxCals &&
      isValid.number({
        value: user.maxCals,
        range: [500, 1e4],
        key: 'maxCals',
      }),
  ].filter((d) => d)

  return errors.length ? errors : null
}
