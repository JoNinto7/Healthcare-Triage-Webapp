class MinHeap {
    constructor() {
      this.heap = [];
    }
  
    // Insert a new value into the heap
    insert(value) {
      this.heap.push(value);
      this.bubbleUp();
    }
  
    // Remove and return the smallest value from the heap
    extractMin() {
      if (this.heap.length === 0) return null;
      if (this.heap.length === 1) return this.heap.pop();
  
      const min = this.heap[0];
      this.heap[0] = this.heap.pop();
      this.bubbleDown();
      return min;
    }
  
    // Restore the heap property for the entire heap
    heapify() {
      for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
        this.bubbleDown(i);
      }
    }
  
    // Helper method to move a node up the heap to restore the heap property
    bubbleUp() {
      let index = this.heap.length - 1;
      while (index > 0) {
        const parentIndex = Math.floor((index - 1) / 2);
        if (this.heap[index].urgency >= this.heap[parentIndex].urgency) break;
  
        // Swap current node with its parent
        [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
        index = parentIndex;
      }
    }
  
    // Helper method to move a node down the heap to restore the heap property
    bubbleDown(index = 0) {
      const length = this.heap.length;
      const element = this.heap[index];
      while (true) {
        let leftChildIndex = 2 * index + 1;
        let rightChildIndex = 2 * index + 2;
        let smallest = index;
  
        if (leftChildIndex < length && this.heap[leftChildIndex].urgency < this.heap[smallest].urgency) {
          smallest = leftChildIndex;
        }
        if (rightChildIndex < length && this.heap[rightChildIndex].urgency < this.heap[smallest].urgency) {
          smallest = rightChildIndex;
        }
        if (smallest === index) break;
  
        // Swap with the smallest child
        [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
        index = smallest;
      }
    }
  
    // Return the heap array (used for debugging or serving data)
    getHeap() {
      return this.heap;
    }
  }
  
  module.exports = { MinHeap };
  