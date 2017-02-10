class Counter {

  constructor() {
    this.m_CounterDictionary = {};
  }

  increment(type) {
    if (!(type in this.m_CounterDictionary)) {
      this.m_CounterDictionary[type] = 0;
    }
    this.m_CounterDictionary[type] += 1;
  }

  decrement(type) {
    if (!(type in this.m_CounterDictionary)) {
      throw new Error('Cannot decrement below 0.');
    }
  }

  set(type, value) {
    if (value !== parseInt(value, 10)) {
      throw new Error('Can only set counter value to an integer.');
    } else if (value < 0) {
      throw new Error(
        'Can only set counter value to a POSITIVE integer () (${value} < 0).'
      );
    } else {
      this.m_CounterDictionary[type] = value;
      if (this.m_CounterDictionary[type] === 0) {
        delete this.m_CounterDictionary[type];
      }
    }
  }

  reset(type) {
    if (type in this.m_CounterDictionary) {
      delete this.m_CounterDictionary[type];
    }
  }

  resetAll() {
    this.m_CounterDictionary = {};
  }

  get(type) {
    if (type in this.m_CounterDictionary) {
      return this.m_CounterDictionary[type];
    } else {
      return 0;
    }
  }
}
