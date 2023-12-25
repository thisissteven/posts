type SubscriberFn = (state: MutationState) => void

export type MutationState = {
  state: 'idle' | 'loading' | 'success' | 'error'
  mutatedBy?: string
}

class SWRObserver {
  subscribers: Record<string, Array<SubscriberFn>>
  mutationStates: Record<string, MutationState>

  constructor() {
    this.subscribers = {}
    this.mutationStates = {}
  }

  subscribe = (key: string, subscriber: SubscriberFn) => {
    if (!this.subscribers[key]) {
      this.subscribers[key] = []
    }

    this.subscribers[key].push(subscriber)

    // Provide current mutation state to the subscriber upon subscription
    subscriber(
      this.mutationStates[key] || {
        state: 'idle',
      }
    )

    return () => {
      this.subscribers[key] = this.subscribers[key].filter(
        (s) => s !== subscriber
      )
    }
  }

  setMutationState = (key: string, state: MutationState) => {
    this.mutationStates[key] = state
    this.notify(key, state)
  }

  notify = (key: string, state: MutationState) => {
    if (this.subscribers[key]) {
      this.subscribers[key].forEach((s) => s(state))
    }
  }
}

export const swrObserver = new SWRObserver()
