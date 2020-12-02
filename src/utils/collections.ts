import { Items } from '../types/collections'

export class Collection<T> {
  public collection: Items<T> = {}

  public all(): Items<T> {
    return this.collection
  }

  public first(
    key: string
  ) {
    const data = this.get(key)

    return Array.isArray(data) ? data[0] : data
  }

  public any(): boolean {
    return Object.keys(this.collection).length > 0
  }

  public fill(
    items: Items<T>
  ): this {
    this.collection = items

    return this
  }

  public push(
      key: string,
      data: any
    ): this {

    this.collection[key] = data

    return this
  }

  public has(
    item: string
  ): boolean {
    return this.collection.hasOwnProperty(item)
  }

  public get<D>(
    item: string,
    defaultValue: D = null
  ): T | D {
    if (!this.has(item)) {
      return defaultValue
    }

    return this.collection[item]
  }

  public unset(
    item: string
  ): this {
    if (!this.has(item)) {
      return this
    }

    delete this.collection[item]

    this.collection = {
      ...this.collection
    }

    return this
  }

  public clear(): this {
    this.collection = {}

    return this
  }
}
