export default class NavigatorMock {
  constructor() {
    if (!NavigatorMock.instance) {
      this.useAgent = '';
      NavigatorMock.instance = this;
    }
    return NavigatorMock.instance;
  }

  get userAgent() {
    return this.useAgent;
  }

  set userAgent(val) {
    this.useAgent = val;
  }
}
