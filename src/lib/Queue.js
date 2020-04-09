export class Queue {
  queue = [];

  pendingPromise = false;

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

  enqueue(promise) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        promise,
        resolve,
        reject,
      });
      this.dequeue();
    });
  }

  dequeue() {
    if (this.workingOnPromise || this.pause) {
      return false;
    }
    const item = this.queue.shift();
    if (!item) {
      return false;
    }
    try {
      this.workingOnPromise = true;
      item
        .promise()
        .then((value) => {
          this.workingOnPromise = false;
          console.log('value', value);
          item.resolve(value);
          this.dequeue();
        })
        .catch((err) => {
          this.workingOnPromise = false;
          item.reject(err);
          this.dequeue();
        });
    } catch (err) {
      this.workingOnPromise = false;
      item.reject(err);
      this.dequeue();
    }
    return true;
  }
}
