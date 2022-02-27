export function sanitizeUser(Item: Record<string, any>, hasAuth = false) {
  const user: Record<string, any> = {}
  user.username = Item.Username || Item.Email
  user.email = Item.Email
  user.maxCals = Item.MaxCals
  user.budget = Item.Budget
  user.age = Item.Age

  if (hasAuth) {
    user.email = Item.Email
    user.createdAt = Item.CreatedAt
    user.maxCals = Item.MaxCals
    user.role = Item.Role
    user.GSI1PK = Item.GSI1PK
    user.GSI1SK = Item.GSI1SK
    user.username = Item.Username
    user.SK = Item.SK
    user.budget = Item.Budget
    user.PK = Item.PK
    user.id = Item.Id
    user.age = Item.Age
  }

  return user
}
