export class Queue<T> {
  private readonly elements: T[] = [];

  public enqueue(element: T) {
    this.elements.unshift(element);
  }

  public dequeue() {
    return this.elements.pop();
  }

  public peek(): T | undefined {
    return this.elements[this.elements.length - 1];
  }
}