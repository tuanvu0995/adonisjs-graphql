import { Definition } from './decorators/definition.js'
import Metadata, { MetaKey } from './metadata.js'
import * as util from './utils.js'

type ClassType = any

class InspectedDefinition {
  constructor(private definition: Definition) {}

  private getPropertiesUncached(
    metaKey: MetaKey = MetaKey.Property,
    options?: { isInput: boolean }
  ): HydratedProperty[] {
    const result: HydratedProperty[] = []
    if (options?.isInput) {
      for (const propertyName in Metadata.getDefinationProperties(this.definition)) {
        const designType = Reflect.getMetadata(
          MetaKey.DesignType,
          this.definition.prototype,
          propertyName
        )
        const property = new HydratedProperty(this.definition, propertyName, designType)
        result.push(property)
      }
    } else {
      for (const propertyName in Metadata.getPropertiesByModel(this.definition, metaKey)) {
        const designType = Reflect.getMetadata(
          MetaKey.DesignType,
          this.definition.prototype,
          propertyName
        )

        const property = new HydratedProperty(this.definition, propertyName, designType)
        result.push(property)
      }
    }

    return result
  }

  getProperties = util.memoize(this.getPropertiesUncached)

  get embeddedProperties(): HydratedProperty[] {
    return this.getProperties(MetaKey.EmbeddedType)
  }

  get manyToManyProperties(): HydratedProperty[] {
    return this.getProperties(MetaKey.ManyToManyType)
  }

  get belongsToProperties(): HydratedProperty[] {
    return this.getProperties(MetaKey.BelongsToType)
  }

  get hasOneProperties(): HydratedProperty[] {
    return this.getProperties(MetaKey.HasOneType)
  }
  get hasManyProperties(): HydratedProperty[] {
    return this.getProperties(MetaKey.HasManyType)
  }

  get queryProperties(): HydratedProperty[] {
    return this.getProperties(MetaKey.Query)
  }

  get mutationProperties(): HydratedProperty[] {
    return this.getProperties(MetaKey.Mutation)
  }

  get subscriptionProperties(): HydratedProperty[] {
    return this.getProperties(MetaKey.Subscription)
  }

  get inputProperties(): HydratedProperty[] {
    return this.getProperties(MetaKey.Property, { isInput: true })
  }

  for(propertyName: string | symbol): HydratedProperty {
    const designType = Reflect.getMetadata(
      MetaKey.DesignType,
      this.definition.prototype,
      propertyName
    )
    return new HydratedProperty(this.definition, propertyName as string, designType)
  }
}

export const inspect = util.memoize((definition: Definition) => new InspectedDefinition(definition))

export class HydratedProperty {
  constructor(
    public definition: any,
    public name: string,
    public designType: ClassType
  ) {}

  get<T = any>(key: MetaKey) {
    return Metadata.for(this.definition).with(this.name).get<T>(key)
  }

  getManyToMany() {
    const referencesMany = this.get<any>(MetaKey.ManyToManyType)

    /* istanbul ignore if */
    if (util.isNil(referencesMany)) {
      throw new Error(`Property ${this.name} is not an many to many property`)
    }

    return referencesMany
  }

  getHasOne() {
    const result = this.get<any>(MetaKey.HasOneType)

    /* istanbul ignore if */
    if (util.isNil(result)) {
      throw new Error(`Property ${this.name} is not an has one property`)
    }

    return result
  }

  getEmbedded() {
    const result = this.get<any>(MetaKey.EmbeddedType)

    /* istanbul ignore if */
    if (util.isNil(result)) {
      throw new Error(`Property ${this.name} is not an embedded property`)
    }

    return result
  }

  getBelongsTo() {
    const result = this.get<any>(MetaKey.BelongsToType)

    /* istanbul ignore if */
    if (util.isNil(result)) {
      throw new Error(`Property ${this.name} is not an has one property`)
    }

    return result
  }

  getHasMany() {
    const result = this.get<any>(MetaKey.HasManyType)

    /* istanbul ignore if */
    if (util.isNil(result)) {
      throw new Error(`Property ${this.name} is not an has many property`)
    }

    return result
  }
}
