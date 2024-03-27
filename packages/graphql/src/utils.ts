export const isNil = (value: any): value is null | undefined =>
  value === null || value === undefined

export const isNotNil = (value: any) => !isNil(value)

export const isArray = (value: any) => Array.isArray(value)

export const isNotNullObject = (value: any): value is object =>
  typeof value === 'object' && value !== null

export const isFunction = (value: any) => typeof value === 'function'

export const isUndefined = (value: any): value is undefined => typeof value === 'undefined'

export const isTruthy = (value: any) => !!value

export const merge = (...objects: any[]): any => {
  if (objects.length === 0) return {}
  if (objects.length === 1) return objects[0]

  const [first, ...rest] = objects
  return rest.reduce((acc, obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        acc[key] = obj[key]
      }
    }
    return acc
  }, first)
}

export const defaultTo = <T>(value: T | null | undefined, defaultValue: T): T => {
  const shouldUseDefaultValue = isNil(value) || (typeof value === 'number' && Number.isNaN(value))
  return shouldUseDefaultValue ? defaultValue : (value as T)
}

export const defaultToChain = <T>(...args: Array<T | null | undefined>) => {
  for (const arg of args) {
    const shouldCheckNextArg = isNil(arg) || (typeof arg === 'number' && Number.isNaN(arg))
    const shouldReturnThisArg = !shouldCheckNextArg
    if (shouldReturnThisArg) return arg
  }
  return args[args.length - 1]
}

export function memoize<T extends Function>(func: T, resolver?: (...args: any[]) => any): T {
  /* istanbul ignore if */
  if (typeof func !== 'function' || (resolver && typeof resolver !== 'function')) {
    throw new TypeError('FUNC_ERROR_TEXT')
  }

  const memoized = function (this: any, ...args: any[]) {
    const key = resolver ? resolver.apply(this, args) : String(args[0])
    const cache = memoized.cache
    if (cache.has(key)) return cache.get(key)
    const result = func.apply(this, args)
    cache.set(key, result)
    return result
  }

  memoized.cache = new Map()
  return memoized as any
}
