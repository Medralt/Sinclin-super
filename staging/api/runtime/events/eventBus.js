class EventBus {

  constructor() {
    this.events = {};
  }

  on(event, listener) {

    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(listener);
  }

  emit(event, payload) {

    if (!this.events[event]) {
      return;
    }

    for (const listener of this.events[event]) {
      listener(payload);
    }
  }
}

module.exports = new EventBus();
