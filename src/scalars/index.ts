import { GraphQLFloat, GraphQLID, GraphQLInt, GraphQLString, GraphQLBoolean } from 'graphql'

export const Int = GraphQLInt
export const Float = GraphQLFloat
export const ID = GraphQLID
export const String = GraphQLString
export const Boolean = GraphQLBoolean

export * from './datetime.js'
export * from './enum.js'
