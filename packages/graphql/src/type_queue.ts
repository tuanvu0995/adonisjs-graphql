type QueueItem = {
  name: string
  fields: any
}

export default class TypeQueue {
  private static queue: Record<string, QueueItem> = {}

  static put(queue: QueueItem) {
    this.queue[queue.name] = queue
  }

  static get(name: string) {
    return this.queue[name]
  }

  static del(name: string) {
    delete this.queue[name]
  }
}
