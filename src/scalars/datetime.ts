// @ts-ignore
import { DateTime } from 'luxon'
import { GraphQLScalarType } from 'graphql'

export const parseValue = (value: any) => {
  return DateTime.fromISO(value)
}

export const serialize = (value: any) => {
  if (value instanceof DateTime) {
    return value.toISO()
  }
  throw Error('GraphQL Date Scalar serializer expected a `Date` object')
}

export const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'Data type representing the date and time',
  parseValue,
  serialize,
})
