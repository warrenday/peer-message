type EventCallback = (data?: { [key: string]: any }) => void;

export class EventEmitter<Type extends string, Callback extends EventCallback> {
  private callbacks: { name: Type; cb: Callback }[] = [];

  emit = (eventType: Type, data?: object) => {
    this.callbacks.forEach(callback => {
      if (callback.name === eventType) {
        callback.cb(data);
      }
    });
  };

  on = (eventType: Type, cb: Callback) => {
    const newCallback = { name: eventType, cb };
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
