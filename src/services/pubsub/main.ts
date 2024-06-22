import EventEmitter from 'node:events'
import app from '@adonisjs/core/services/app'
import { PubSubOptions } from 'graphql-subscriptions'

export declare abstract class PubSubEngine {
  abstract publish(triggerName: string, payload: any): Promise<void>
  abstract subscribe(triggerName: string, onMessage: Function, options: Object): Promise<number>
  abstract unsubscribe(subId: number): any
  asyncIterator<T>(triggers: string | string[]): AsyncIterator<T>
}

export declare class PubSub extends PubSubEngine {
  protected ee: EventEmitter
  private subscriptions
  private subIdCounter
  constructor(options?: PubSubOptions)
  publish(triggerName: string, payload: any): Promise<void>
  subscribe(triggerName: string, onMessage: (...args: any[]) => void): Promise<number>
  unsubscribe(subId: number): void
}

let pubsub: PubSub

await app.booted(async () => {
  const graphqlCore = await app.container.make('graphql')
  pubsub = graphqlCore.getPubSub()
})

export { pubsub as default }
