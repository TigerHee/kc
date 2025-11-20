import createProxy from 'utils/toolProxy';

describe('createProxy', () => {
  let target;

  let init;

  beforeEach(() => {
    target = {
      someMethod: jest.fn().mockReturnValue('someValue'),
    };

    init = jest.fn();
  });

  it('should call init function only once when a property is accessed', () => {
    const proxy = createProxy(target, init);

    // Access a property to trigger the init function

    proxy.someMethod();

    expect(init).toHaveBeenCalledTimes(1);

    expect(target.someMethod).toHaveBeenCalledTimes(1);
  });

  it('should not call init function again on subsequent property accesses', () => {
    const proxy = createProxy(target, init);

    // Access a property to trigger the init function

    proxy.someMethod();

    // Access the property again

    proxy.someMethod();

    expect(init).toHaveBeenCalledTimes(1);

    expect(target.someMethod).toHaveBeenCalledTimes(2);
  });

  it('should return the correct method from the target object', () => {
    const proxy = createProxy(target, init);

    const method = proxy.someMethod;

    expect(method).toBe(target.someMethod);
  });

  it('should not call init function if no property is accessed', () => {
    createProxy(target, init);

    expect(init).not.toHaveBeenCalled();
  });
});
