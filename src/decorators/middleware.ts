import Metadata, { MetaKey } from '../metadata.js'

export function Middleware(middleware: any | Function): MethodDecorator {
  return (target: any, propertyKey: string | symbol) => {
    const middlewareMetadata = Metadata.for(target).with(propertyKey).get(MetaKey.Middleware)
    Metadata.for(target)
      .with(propertyKey)
      .set(MetaKey.Middleware, [...(middlewareMetadata || []), middleware])
  }
}
