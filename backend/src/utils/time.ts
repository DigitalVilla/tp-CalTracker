export function setTimeStamp(D: Date | string = ''): string {
  let ISO = ''
  if (!D) ISO = new Date().toISOString()
  else ISO = new Date(D).toISOString()
  const mills = Math.floor(Math.random() * (999 - 1 + 1) + 1)
  return ISO.replace(/Z/, `${mills}`.padEnd(3, '0'))
}
