export function setTimeStamp(D: Date | string = ''): string {
  let ISO = ''
  if (!D) ISO = new Date().toISOString()
  else ISO = new Date(D).toISOString()

  return ISO.replace(/Z/, '000')
}
