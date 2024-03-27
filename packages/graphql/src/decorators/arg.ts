import Metadata, { MetaKey } from '../metadata.js'

type ArgOptions = {
  nullable?: boolean
  defaultValue?: any
  type?: () => any
}
export function Arg(name: string, options?: ArgOptions) {
  return (target: any, propertyKey: string, parameterIndex: number) => {
    const paramTypes = Reflect.getOwnMetadata(MetaKey.ParamTypes, target, propertyKey)
    Metadata.for(target)
      .with(propertyKey)
      .set(MetaKey.ParamTypes, {
        index: parameterIndex,
        name,
        type: options?.type ? options.type : () => paramTypes[parameterIndex],
        nullable: options?.nullable,
        defaultValue: options?.defaultValue,
      })
  }
}

export function Context() {
  return (target: any, propertyKey: string, parameterIndex: number) => {
    Metadata.for(target).with(propertyKey).set(MetaKey.ParamTypes, {
      index: parameterIndex,
      name: 'context',
    })
  }
}
