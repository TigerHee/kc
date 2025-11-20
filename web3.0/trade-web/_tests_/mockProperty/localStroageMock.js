export default class LocalStorageMock {
  constructor(jest) {
    if (!LocalStorageMock.instance) {
      this.store = {};
      this.setItem = jest.fn((key, val) => {
        this.store[key] = `${val}`;
      });
      this.getItem = jest.fn((key) => {
        return this.store[key];
      });
      this.removeItem = jest.fn((key) => {
        delete this.store[key];
      });
      this.clear = jest.fn(() => {
        this.store = {};
      });
      LocalStorageMock.instance = this;
    }
    return LocalStorageMock.instance;
  }

  get length() {
    return Object.keys(this.store).length;
  }
}
