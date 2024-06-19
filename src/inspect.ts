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
      for (const propertyName in Metadata.getProperties(this.definition)) {
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

  get queryProperties(): HydratedProperty[] {
    return this.getProperties(MetaKey.Query)
  }

  get mutationProperties(): HydratedProperty[] {
    return this.getProperties(MetaKey.Mutation)
  }

  // get subscriptionProperties(): HydratedProperty[] {
  //   return this.getProperties(MetaKey.Subscription)
  // }

  get inputProperties(): HydratedProperty[] {
    return this.getProperties(MetaKey.Property, { isInput: true })
  }

  // get propertyResolvers(): HydratedProperty[] {
  //   return this.getProperties(MetaKey.PropertyResolver)
  // }

  // for(propertyName: string | symbol): HydratedProperty {
  //   const designType = Reflect.getMetadata(
  //     MetaKey.DesignType,
  //     this.definition.prototype,
  //     propertyName
  //   )
  //   return new HydratedProperty(this.definition, propertyName as string, designType)
  // }
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
}
