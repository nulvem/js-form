import { Collection } from '../utils/collections'

export class Errors extends Collection<string[]> {
  public push(
    item: string,
    data: any
  ): this {
    this.collection = {
      ...this.collection,
      [item]: [...this.get(item), data]
    }

    return this
  }

  public get(key: string): string[] {
    return super.get(key, [])
  }
}
