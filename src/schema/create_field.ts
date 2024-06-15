export function createField(acc: any, options: any, fieldType: any, property: any) {
  acc[property.name] = {
    type: fieldType,
    description: options.description,
    deprecationReason: options.deprecationReason,
  }
  return acc
}
