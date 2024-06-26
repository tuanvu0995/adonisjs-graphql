import { MetaValue, TargetClass } from './types.js'
import * as util from './utils.js'

const METADATA = Symbol('metadata')
const DEFINITION = Symbol('definition')

export enum MetaKey {
  DesignType = 'design:type',
  ParamTypes = 'design:paramtypes',
  ReturnType = 'design:returntype',
  InputType = 'design:inputtype',
  Definition = 'Definition',
  Property = 'Property',
  PropertyResolver = 'PropertyResolver',
  Middleware = 'Middleware',
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
      if (util.isNil(value)) continue
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
      exists(): boolean {
        return Metadata.exists(target)
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
    if (!this.getConstructor(target)?.[METADATA]?.[property]) return
    return this.getConstructor(target)[METADATA]?.[property]?.[metaKey]
  }

  private static exists(target: TargetClass): boolean {
    return !util.isNil(this.getConstructor(target)?.[METADATA])
  }

  private static setMetaValue(
    target: TargetClass,
    metaKey: MetaKey,
    property: string | symbol,
    value: MetaValue
  ): void {
    const constructor = this.getConstructor(target)

    if (util.isNil(constructor[METADATA])) {
      constructor[METADATA] = {}
    }
    if (util.isNil(constructor[METADATA][property])) {
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
