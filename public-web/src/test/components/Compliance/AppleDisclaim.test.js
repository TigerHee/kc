/**
 * Owner: terry@kupotech.com
 */
import '@testing-library/jest-dom';
import { customRender } from 'src/test/setup';
import { AppleDisclaim } from 'src/components/Compliance/AppleDisclaim.js';

const originAgent = window.navigator.userAgent;
describe('AppleDisclaim', () => {
  afterAll(() => {
    Object.defineProperty(window, 'navigator', {
      writable: true,
      value: { ...window.navigator, userAgent: originAgent },
    });
  });
  it('normal render', () => {
    Object.defineProperty(window, 'navigator', {
      writable: true,
      value: { ...window.navigator, userAgent: 'iPhone' },
    });
    const { getByText } = customRender(<AppleDisclaim  />);
    expect(getByText('8fe6fe99cef24000a0dd')).toBeInTheDocument();
  })

  it('normal render:android', () => {
    Object.defineProperty(window, 'navigator', {
      writable: true,
      value: { ...window.navigator, userAgent: 'Android' },
    });
    const { queryByText } = customRender(<AppleDisclaim  />);
    expect(queryByText('8fe6fe99cef24000a0dd')).toBeNull();
  })

  it('normal render: withTheme=false', () => {
    Object.defineProperty(window, 'navigator', {
      writable: true,
      value: { ...window.navigator, userAgent: 'iPhone' },
    });
    const { getByText } = customRender(<AppleDisclaim  withTheme={false} />);
    expect(getByText('8fe6fe99cef24000a0dd')).toBeInTheDocument();
  })
})