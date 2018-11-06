// not exactly how vue.js doing reactivity yet a clear and simple
// implementation of the observer pattern needed for understanding vue.js

class Subject {

  constructor() {
    this.subscribers = {};
  }

  on(event, handlerFn) {
    if (!handlerFn) return;
    if (!this.subscribers[event]) this.subscribers[event] = [];
    this.subscribers[event].push(handlerFn);
    return (cb) => {
      this.subscribers[event] = this.subscribers[event].filter((fn) => fn !== cb);
    };
  }

  dispatch(name, ...args) {
    const events = this.subscribers[name];
    if (events) {
      events.forEach(fn => {
        fn(...args);
      });
    }
  }

}

const observable = new Subject();

let data = {
  name: 'liron',
  age: 30
};

Object.keys(data).forEach(prop => {
  let internal = data[prop];
  Object.defineProperty(data, prop, {
    get() {
      observable.on(prop, renderView);
      return internal;
    },
    set(newVal) {
      if (internal !== newVal) observable.dispatch(prop, newVal);
    }
  })
});

renderView = (newVal) => {
  console.log(newVal);
  console.log('compare vdom');
  console.log('render if changed');
};

console.log(data.age);
data.age = 31;
