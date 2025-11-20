import React from 'react';
import { render } from '@testing-library/react';
import Index from 'src/components/Tips/modalForbid';

// mock @kucoin-biz/entrance
jest.mock('@kucoin-biz/entrance', () => {
  return {
    __esModule: true,
    ModalForbid: () => {
      return 'ModalForbid';
    }
  };
});

describe('Test Index component', () => {
  test('render ok', () => {
    const onCancelMock = jest.fn();
    const { getByText } = render(<Index onCancel={onCancelMock} />);
    expect(getByText('ModalForbid')).toBeInTheDocument();
  });
});
