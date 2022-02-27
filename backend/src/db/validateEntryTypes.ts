import { isValid as is } from '../utils/validations'

export function validateEntryTypes(entry: Record<string, any>) {
  const has = (k: string) => typeof entry[k] !== 'undefined'

  const errors = [
    has('name') && is.string({ value: entry.name, key: 'name' }),
    has('date') && is.dateString({ value: entry.date, key: 'date' }),
    has('price') &&
      is.number({ value: entry.price, range: [1, 1e4], key: 'price' }),
    has('cals') &&
      is.number({ value: entry.cals, range: [1, 1e4], key: 'cals' }),
    has('type') &&
      is.enum({
        value: entry.type,
        enums: ['single', 'averageDay', `averageWeek`, `averageMonth`],
      }),
  ].filter((d) => d)

  return errors.length ? errors : null
}
