type SubscriberFn = (isLoading: boolean) => void

class SWRObserver {
  subscribers: Record<string, Array<SubscriberFn>>
  loadingStates: Record<string, boolean>

  constructor() {
    this.subscribers = {}
    this.loadingStates = {}
  }

  subscribe = (key: string, subscriber: SubscriberFn) => {
    if (!this.subscribers[key]) {
      this.subscribers[key] = []
    }

    this.subscribers[key].push(subscriber)

    // Provide current loading state to the subscriber upon subscription
    subscriber(this.loadingStates[key] || false)

    return () => {
      this.subscribers[key] = this.subscribers[key].filter(
        (s) => s !== subscriber
      )
    }
  }

  setLoadingState = (key: string, isLoading: boolean) => {
    this.loadingStates[key] = isLoading
    this.notify(key, isLoading)
  }

  notify = (key: string, isLoading: boolean) => {
    if (this.subscribers[key]) {
      this.subscribers[key].forEach((s) => s(isLoading))
    }
  }
}

export const swrObserver = new SWRObserver()
