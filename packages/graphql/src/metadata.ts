import * as util from './utils.js'

type TargetClass = any
type MetaValue = any

const METADATA = Symbol('metadata')
const DEFINITION = Symbol('definition')

export enum MetaKey {
  DesignType = 'design:type',
  ParamTypes = 'design:paramtypes',
  ReturnType = 'design:returntype',
  Definition = 'Definition',
  Property = 'Property',
  EmbeddedType = 'EmbeddedType',
  Query = 'Query',
  Mutation = 'Mutation',
  Subscription = 'Subscription',
}

export default class Metadata {
  static getPropertiesByModel(
    target: TargetClass,
    metaKey: MetaKey
  ): { [property: string]: MetaValue } {
    const result: Record<string, any> = {}
    for (const property of Object.keys(util.defaultTo(target[METADATA], []))) {
      const value = this.getMetaValue(target, metaKey, property)
      if (util.isUndefined(value)) continue
      result[property] = value
    }
    return result
  }

  static getProperties(target: TargetClass): { [property: string]: MetaValue } {
    return target[METADATA]
  }

  static for(target: TargetClass) {
    return {
      set(key: MetaKey, value: MetaValue) {
        Metadata.setMetaValue(target, key, DEFINITION, value)
      },
      get<T = any>(key: MetaKey): T {
        return Metadata.getMetaValue(target, key, DEFINITION)
      },
      with(property: string | symbol) {
        return {
          set<T = any>(key: MetaKey, value: T) {
            Metadata.setMetaValue(target, key, property, value)
          },
          get<T = any>(key: MetaKey): T {
            return Metadata.getMetaValue(target, key, property)
          },
        }
      },
    }
  }

  private static getConstructor(target: TargetClass) {
    return typeof target === 'function' ? target : target.constructor
  }

  private static getMetaValue(
    target: TargetClass,
    metaKey: MetaKey,
    property: string | symbol
  ): MetaValue {
    return this.getConstructor(target)[METADATA]?.[property]?.[metaKey]
  }

  private static setMetaValue(
    target: TargetClass,
    metaKey: MetaKey,
    property: string | symbol,
    value: MetaValue
  ): void {
    const constructor = this.getConstructor(target)

    if (util.isUndefined(constructor[METADATA])) {
      constructor[METADATA] = {}
    }
    if (util.isUndefined(constructor[METADATA][property])) {
      constructor[METADATA][property] = {}
    }

    if ([MetaKey.Query, MetaKey.Mutation, MetaKey.Subscription].includes(metaKey)) {
      constructor[METADATA][property][metaKey] = {
        ...value,
        resolve: target[property],
      }
      return
    }

    if ([MetaKey.ParamTypes].includes(metaKey)) {
      if (!Array.isArray(constructor[METADATA][property][metaKey])) {
        constructor[METADATA][property][metaKey] = []
      }
      constructor[METADATA][property][metaKey].push(value)
      return
    }

    constructor[METADATA][property][metaKey] = value
  }
}
