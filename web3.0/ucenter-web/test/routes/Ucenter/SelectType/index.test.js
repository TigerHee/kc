import { fireEvent } from '@testing-library/react';
import SelectType from 'src/routes/Ucenter/SelectType/index';
import { customRender } from 'test/setup';

jest.mock('@kux/mui', () => {
  return {
    __esModule: true,
    ...jest.requireActual('@kux/mui'),
    useSnackbar: () => {
      return {
        message: {
          info: () => {},
          error: () => {},
        },
      };
    },
  };
});

describe('test SelectType', () => {
  test('test SelectType', () => {
    customRender(
      <SelectType
        blockId="blockId"
        renderOptions={[
          {
            key: '1',
            preImgs: ['src', 'src2'],
            label: () => 'label1',
          },
          {
            key: '2',
            preImgs: ['src', 'src2'],
            label: () => 'label2',
          },
        ]}
      />,
      {},
    );

    fireEvent.click(document.querySelector('button'));
  });
});
