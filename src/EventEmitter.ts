type Callback<E, T extends keyof E> = (data: E[T]) => void;

export class EventEmitter<E> {
  private callbacks: { eventType: keyof E; cb: Function }[] = [];

  emit = <T extends keyof E>(eventType: T, data: E[T]) => {
    this.callbacks.forEach(callback => {
      if (callback.eventType === eventType) {
        callback.cb(data);
      }
    });
  };

  on = <T extends keyof E>(eventType: T, cb: Callback<E, T>) => {
    const newCallback = { eventType, cb };
    this.callbacks.push(newCallback);
    return () => {
      this.callbacks = this.callbacks.filter(
        callback => callback !== newCallback
      );
    };
  };

  removeAll = () => {
    this.callbacks = [];
  };
}
