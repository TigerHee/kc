import { renderHook } from '@testing-library/react-hooks';
import { useBrowserPrompt } from 'src/utils/hooks';

describe('useBrowserPrompt', () => {
  let originalOnBeforeUnload;

  beforeEach(() => {
    originalOnBeforeUnload = window.onbeforeunload;
    window.onbeforeunload = jest.fn();
  });

  afterEach(() => {
    window.onbeforeunload = originalOnBeforeUnload;
  });

  it('should set window.onbeforeunload event', () => {
    renderHook(useBrowserPrompt);

    expect(window.onbeforeunload).toBeInstanceOf(Function);
  });

  it('should return the correct message', () => {
    renderHook(useBrowserPrompt);
    const evt = { preventDefault: jest.fn() };
    window.onbeforeunload();
    const returnValue = window.onbeforeunload(evt);
    expect(returnValue).toEqual('是否离开页面?');
  });
});
