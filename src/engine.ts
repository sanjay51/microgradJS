import * as treeify from 'treeify';

export class Value {
  data: number;
  grad: number = 0;
  prev: Value[] = [];
  op = ''
  private _backward: () => void = () => {};

  constructor(data: number) {
    this.data = data;
  }

  private _topologicalSort() {
    let sorted: Value[] = [];
    let visited = new Set();

    let visit = (v: Value) => {
      if (visited.has(v)) return;
      visited.add(v);
      v.prev.forEach(visit);
      sorted.push(v);
    }

    visit(this);
    return sorted;
  }

  public backward(): void {
    this.grad = 1;
    let sorted = this._topologicalSort();
    for (let v of sorted.reverse()) {
      v._backward();
    }
  }

  add(value: Value): Value {
    if (!(value instanceof Value)) {
        value = new Value(value);
    }

    let ret = new Value(this.data + value.data);
    ret.prev = [this, value];
    ret.op = '+';

    ret._backward = () => {
      this.grad += ret.grad;
      value.grad += ret.grad;
    }
    return ret;
  }

  private _negate(value: Value) {
    return new Value(-value.data);
  }
  
  subtract(value: Value) {
    return this.add(this._negate(value));
  }

  multiply(value: Value): Value {
    let ret = new Value(this.data * value.data);
    ret.prev = [this, value];
    ret.op = '*';

    ret._backward = () => {
      this.grad += value.data * ret.grad;
      value.grad += this.data * ret.grad;
    }

    return ret;
  }

  tree(): any {
    let t = {
       data: this.data,      //  ├─ apples: gala
       grad: this.grad,  //  └─ oranges: mandarin
       op: this.op,
       prev: this.prev.map((v) => v.tree()) || []
    }

    return t
  }

  print() {
    console.log(treeify.asTree(this.tree(), true))
  }
}