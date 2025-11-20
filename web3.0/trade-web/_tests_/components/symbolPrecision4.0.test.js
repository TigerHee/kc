/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-06-28 12:36:33
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-03-13 18:24:20
 * @FilePath: /trade-web/_tests_/components/symbolPrecision4.0.test.js
 * @Description: 
 */
import React from 'react';
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { renderWithTheme } from '_tests_/test-setup';
import SymbolPrecision from 'src/trade4.0/components/SymbolPrecision/index';
import { useSelector } from 'dva';
jest.mock('dva', () => ({
  useSelector: jest.fn(),
}));

afterEach(cleanup);

test("test SymbolPrecision with stopMark", () => {
  useSelector.mockImplementation((selectorFn) => [
    { code: 'CSP-BTC', basePrecision: 5, quotePrecision: 5 },
  ]);
  const { wrapper, rerenderWithTheme } = renderWithTheme(
    <SymbolPrecision symbol="CSP-BTC" value={0.000001} stopMark={true} />
  );
  const { container } = wrapper;
  expect(container).toHaveTextContent("0.000001");
  rerenderWithTheme(
    <SymbolPrecision symbol="CSP-BTC" value={-0.000001} stopMark={true} />
  );
  expect(container).toHaveTextContent("-0.000001");
});

test('test SymbolPrecision', () => {
  const { wrapper, rerenderWithTheme } = renderWithTheme(
    <SymbolPrecision symbol="CSP-BTC" value={1234} />,
  );
  const { container } = wrapper;
  expect(container).toHaveTextContent('1,234');

  rerenderWithTheme(
    <SymbolPrecision symbol="CSP-BTC" value={1234} precisionKey="basePrecision" coin={4} />,
  );
  expect(container).toHaveTextContent('1,234');

  rerenderWithTheme(<SymbolPrecision symbol="CSP-BTC" value={1234} coin={4} />);
  expect(container).toHaveTextContent('1,234');

  rerenderWithTheme(
    <SymbolPrecision symbol="CSP-BTC" value={1234} coin={4} isBeautifulNumber fillZero />,
  );
  expect(container).toHaveTextContent('1,234');

  rerenderWithTheme(<SymbolPrecision symbol="ETH-USDT" value={1235} />);
  expect(container).toHaveTextContent('1235');

  rerenderWithTheme(<SymbolPrecision symbol="SHIB-USDT" value={1234} />);
  expect(container).toHaveTextContent('1234');
});
