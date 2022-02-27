/* Use Examples

 // Default: parses all values wrapped by delimiter "(""
  parseExpression({
    ConditionExpression: '#balance > (5000)',
    UpdateExpression: 'SET #balance = #balance - (1200)',
  })

 // Custom 1: parse values wrapped by new delimiter "{"
  parseExpression({
    KeyConditionExpression: '#IsActive = {true}',
    FilterExpression: '#Genre = {Family}',
    }.
    {defaultDelimiter : "{" }
  )

  // Custom 2: parse values wrapped by new delimiter "$" and per expression 
  parseExpression(
    {
      ConditionExpression: {
        expression: '#balance > {1234} and attribute_not_exists(SK)',
        delimiter: '{',
      },
      UpdateExpression: 'SET #balance = #balance - ${"value": false}$',
      FilterExpression: '#Rating > $3$',
    },
    { delimiter: '$' }
  )
)

  // Custom 3: Skip parsing a single expression 
  parseExpression(
    {
      UpdateExpression: 'SET #Name = (Omar)',
      ConditionExpression: {
        expression: 'attribute_exists(Email) and attribute_not_exists(Name) ',
        delimiter: null,
      },
    },
  )
)
*/

export function parseExpression(
  {
    KeyConditionExpression,
    ProjectionExpression,
    ConditionExpression,
    UpdateExpression,
    FilterExpression,
    ...rest
  }: Record<string, any>,
  { delimiter = '(' } = {}
) {
  const [model, parse] = initExpression(delimiter)

  if (ConditionExpression) {
    model.ConditionExpression =
      typeof ConditionExpression === 'object'
        ? parse(ConditionExpression.expression, ConditionExpression.delimiter)
        : parse(ConditionExpression, delimiter)
  }
  if (KeyConditionExpression) {
    model.KeyConditionExpression =
      typeof KeyConditionExpression === 'object'
        ? parse(
            KeyConditionExpression.expression,
            KeyConditionExpression.delimiter
          )
        : parse(KeyConditionExpression)
  }
  if (ProjectionExpression) {
    model.ProjectionExpression =
      typeof ProjectionExpression === 'object'
        ? parse(ProjectionExpression.expression, ProjectionExpression.delimiter)
        : parse(ProjectionExpression)
  }
  if (UpdateExpression) {
    model.UpdateExpression =
      typeof UpdateExpression === 'object'
        ? parse(UpdateExpression.expression, UpdateExpression.delimiter)
        : parse(UpdateExpression)
  }
  if (FilterExpression) {
    model.FilterExpression =
      typeof FilterExpression === 'object'
        ? parse(FilterExpression.expression, FilterExpression.delimiter)
        : parse(FilterExpression)
  }

  return { ...model, ...rest }
}

function parseValue(value: any) {
  try {
    if (value === 'undefined') return 'undefined'
    if (value === 'null') return 'null'
    // eslint-disable-next-line prefer-const
    let obj = ''
    eval('obj =' + value)
    return obj
  } catch (error) {
    return value
  }
}

function initExpression(
  defaultDelimiter: string
): [Record<string, any>, (s: string, o?: string) => string] {
  const ExpressionAttributeValues: Record<string, any> = {}
  const ExpressionAttributeNames: Record<string, string> = {}
  const KEYS = {
    val: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'],
    count: 0,
  }
  const dms: Record<string, any> = {
    '{': ['{', '}'],
    '(': ['(', ')'],
    '[': ['[', ']'],
  }

  const model: Record<string, any> = {
    ExpressionAttributeValues,
    ExpressionAttributeNames,
  }

  return [
    model,
    (exp, delimiter = defaultDelimiter) => {
      let expression = ''
      const open = dms[delimiter] ? dms[delimiter][0] : delimiter
      const close = dms[delimiter] ? dms[delimiter][1] : delimiter

      for (let i = 0; i < exp.length; i++) {
        if (exp[i] === '#') {
          const space = exp.indexOf(' ', i)
          const bounds = space < 0
          const wrd = exp.substring(i + 1, bounds ? exp.length : space)
          const key = wrd.replace(',', '')
          ExpressionAttributeNames[`#${key}`] = key
          expression += `#${wrd}`
          i = space <= 0 ? i : space - 1
          if (bounds) break
        } else if (exp[i] === open) {
          const bracket = exp.indexOf(close, i + 1)
          const val = exp.substring(i + 1, bracket).trim()
          ExpressionAttributeValues[`:${KEYS.val[KEYS.count]}`] =
            parseValue(val)
          expression += `:${KEYS.val[KEYS.count++]}`
          i = bracket <= 0 ? i : bracket
        } else {
          expression += exp[i]
        }
      }
      return expression
    },
  ]
}
