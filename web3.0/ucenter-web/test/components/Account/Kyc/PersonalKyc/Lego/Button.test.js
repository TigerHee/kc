/**
 * Owner: tiger@kupotech.com
 */
import { fireEvent, screen } from '@testing-library/react';
import { useSelector } from 'react-redux';
import Button from 'src/components/Account/Kyc/OcrSupplier/Lego/Button';
import { customRender } from 'test/setup';

const state = {
  kyc: {},
};

jest.mock('react-redux', () => {
  return {
    __esModule: true,
    default: null,
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(() => jest.fn()),
    useSelector: jest.fn((cb) => cb(state)),
  };
});

const baseProps = {
  onClick: () => {},
  onOk: () => {},
  btnText: 'btnText',
};

describe('test Button', () => {
  test('test Button no onOk', () => {
    customRender(<Button {...baseProps} onCancel={() => {}} onOk={null} />);
  });
  test('test Button render 1', () => {
    customRender(<Button {...baseProps} onCancel={() => {}} />);

    fireEvent.click(screen.getByTestId('preButton'));
  });

  ['legoIndex', 'legoCamera'].forEach((currentRoute) => {
    test(`test Button render ${currentRoute}`, () => {
      useSelector.mockImplementation((selector) =>
        selector({
          kyc: { currentRoute },
        }),
      );
      customRender(<Button {...baseProps} />);

      fireEvent.click(screen.getByTestId('preButton'));
    });
  });

  ['backPhoto', 'backCamera', 'frontPhoto', 'frontCamera'].forEach((legoCameraStep) => {
    test(`test Button render legoCamera ${legoCameraStep}`, () => {
      useSelector.mockImplementation((selector) =>
        selector({
          kyc: { currentRoute: 'legoCamera', legoCameraStep },
        }),
      );
      customRender(<Button {...baseProps} />);

      fireEvent.click(screen.getByTestId('preButton'));
    });
  });
});
