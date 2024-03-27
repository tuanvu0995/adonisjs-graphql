import Metadata, { MetaKey } from '../metadata.js'

export type DefinitionOptions = {
  modelOptions?: any
  isInputType?: boolean
}

export type Definition = new (...args: any[]) => any

export function Definition(options: DefinitionOptions = {}): ClassDecorator {
  return (target: any) => {
    Metadata.for(target).set(MetaKey.Definition, options)
  }
}

export function InputType(): ClassDecorator {
  return (target: any) => {
    Definition({ isInputType: true })(target)
  }
}
