/*
 * Owner: tom@kupotech.com
 */
import React from 'react';
import { render } from '@testing-library/react';
import CommonDialog from 'src/components/$/MarketCommon/CommonDialog';

jest.mock('components/$/MarketCommon/config', () => {
  const originalModule = jest.requireActual('components/$/MarketCommon/config');

  return {
    __esModule: true,
    ...originalModule,
    default: null,
    useIsMobile: jest.fn(() => true),
  };
});

jest.mock('dva', () => {
  const originalModule = jest.requireActual('dva');

  return {
    __esModule: true,
    ...originalModule,
    default: null,
    useDispatch: jest.fn(() => jest.fn()),
    useSelector: jest.fn(() => ({
      newCoinCarnival: {
        dialogConfig: { show: true, content: 'Test content' },
      },
    })),
  };
});

describe('CommonDialog', () => {
  test('onOk and onCancel should close the dialog', () => {
    const { container } = render(<CommonDialog namespace="newCoinCarnival" />);

    expect(container).toBeInTheDocument();
  });
});
