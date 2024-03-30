export const isNil = (value: any): value is null | undefined =>
  value === null || value === undefined

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

export function memoize<T extends Function>(func: T, resolver?: (...args: any[]) => any): T {
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
