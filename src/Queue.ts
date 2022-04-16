export class Queue<T> {
  private readonly elements: T[] = [];

  /** Insert element at begin of queue. */
  public enqueue(element: T) {
    this.elements.unshift(element);
  }

  /** Return first inserted element. */
  public dequeue() {
    return this.elements.pop();
  }

  public peek(): T | undefined {
    return this.elements[this.elements.length - 1];
  }

  public size() {
    return this.elements.length;
  }
}
