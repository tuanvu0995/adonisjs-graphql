import type { HttpContext } from '@adonisjs/core/http'
import { PropertyRelation } from '../types.js'
import { GraphQLList } from 'graphql'

export function createRelation(
  acc: Record<string, any>,
  options: any,
  fieldType: any,
  property: any
) {
  const isManyRelation = [PropertyRelation.HasMany, PropertyRelation.ManyToMany].includes(
    options.relation!
  )
  const relationType = isManyRelation ? new GraphQLList(fieldType) : fieldType

  acc[property.name] = {
    type: relationType,
    description: options.description,
    deprecationReason: options.deprecationReason,
    resolve: async (parent: any, _args: any, _: HttpContext) => {
      if (isManyRelation) {
        return await parent.related(property.name).query().orderBy('id', 'asc')
      }
      return await parent.related(property.name).query().first()
    },
  }

  return acc
}
