export function sanitizeEntry(Item: Record<string, any>, hasAuth = false) {
  if (hasAuth) return Item

  const entry: Record<string, any> = {}
  entry.id = Item.Id
  entry.name = Item.Name
  entry.cals = Item.Cals
  entry.price = Item.Price
  entry.date = Item.Date

  return entry
}
