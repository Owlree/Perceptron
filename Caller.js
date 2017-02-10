class Caller {

  constructor() {
    this.m_Methods = {};
  }

  setMethod(name, method) {
    if (typeof method !== 'function') {
      throw new Error('Caller: method can only be a function.');
    } else {
      this.m_Methods[name] = method;
    }
  }

  removeMethod(name) {
    if (name in this.m_Methods) {
      delete this.m_Methods[name];
    }
  }

  call(name, args) {
    if (name in this.m_Methods) {
      let method = this.m_Methods[name];
      setTimeout(function() {
        method(...args);
      }, 0);
    }
  }
}
