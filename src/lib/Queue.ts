interface QueueElement {
  promise: () => Promise<any>,
  resolve: Function,
  reject: Function,
}

export class Queue {
  queue: QueueElement[] = [];

  pendingPromise = false;
  pause: boolean = false;
  workingOnPromise: boolean = false;

  constructor() {
    window.addEventListener('focus', () => {
      if (this.queue.length && this.pause) {
        console.log('resume execution');
        this.pause = false;
        this.dequeue();
      }
    });

    window.addEventListener('blur', () => {
      console.log('pause execution');
      this.pause = true;
    });
  }

  enqueue(asynchronousCallback: () => Promise<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        promise: asynchronousCallback,
        resolve,
        reject,
      });
      this.dequeue();
    });
  }

  async dequeue() {
    if (this.workingOnPromise || this.pause) {
      return false;
    }
    const firstElement = this.queue.shift();
    if (!firstElement) {
      return false;
    }
    try {
      this.workingOnPromise = true;
      const value = await firstElement.promise()
      this.workingOnPromise = false;
      firstElement.resolve(value);
      this.dequeue();
    } catch (err) {
      this.workingOnPromise = false;
      firstElement.reject(err);
      this.dequeue();
    } finally {
      return true;
    }
  }
}
