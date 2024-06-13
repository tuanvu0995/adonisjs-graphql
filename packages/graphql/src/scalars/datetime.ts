import { GraphQLScalarType } from 'graphql'
import { DateTime } from 'luxon'

export const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'Data type representing the date and time',
  parseValue: (value: string) => {
    return DateTime.fromISO(value)
  },
  serialize: (value: DateTime) => {
    return value.toISO()
  },
})
