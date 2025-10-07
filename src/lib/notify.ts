type Listener = (message: string) => void;

class NotifyBus {
  private listeners: Set<Listener> = new Set();

  subscribe(listener: Listener): () => void {
    // this.listeners.add(listener);
    // return () => this.listeners.delete(listener);
    return () => {};
  }

  show(message: string) {
    // for (const listener of this.listeners) listener(message);
  }
}

export const notify = new NotifyBus();


