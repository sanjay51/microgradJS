import { Value } from '../src/engine';

let a = new Value(6);
let b = new Value(10);
let c = a.add(b).add(new Value(4));
let d = new Value(2);
let e = c.multiply(d);

e.backward()
e.print()