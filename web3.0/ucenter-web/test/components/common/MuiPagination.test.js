import { fireEvent } from '@testing-library/react';
import MuiPagination from 'src/components/common/MuiPagination/index';
import { customRender } from 'test/setup';

describe('test MuiPagination', () => {
  test('test MuiPagination', () => {
    const { container } = customRender(
      <MuiPagination
        {...{
          total: 100,
          current: 3,
          pageSize: 10,
          onChange: () => {},
        }}
      />,
      {},
    );

    fireEvent.click(container.querySelector('[data-item="page"]'));
  });
});
