/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import Index from 'src/components/AnchorNavigator';
import { fireEvent, screen } from '@testing-library/react';
import { customRender } from 'test/setup';

jest.mock('@kufox/mui', () => {
  const originalModule = jest.requireActual('@kufox/mui');
  return {
    __esModule: true,
    ...originalModule,
    useMediaQuery: jest
      .fn()
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true),
  };
});

describe('test Alert', () => {
  test('test AlertInfo', () => {
    const { rerender, container } = customRender(<Index showDrawerTitle={false} />);
    rerender(<Index showDrawerTitle={false} />);
    rerender(
      <Index
        title="title"
        showListTitle
        activeAnchorKey="123"
        anchorList={[
          { key: '123', title: 'anchor1' },
          { key: '321', title: 'anchor2' },
        ]}
      />,
    );
    fireEvent.click(screen.getByTestId('btn'));
    fireEvent.click(screen.getByText('anchor1').parentElement);
    fireEvent.click(screen.getByText('anchor2').parentElement);
  });
});
