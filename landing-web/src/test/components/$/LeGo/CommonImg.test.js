/*
 * Owner: jesse.shao@kupotech.com
 */
import CommonImg from 'src/components/$/LeGo/components/CommonImg';
import { render, screen, fireEvent, act } from '@testing-library/react';

jest.mock('dva', () => {
  const originalModule = jest.requireActual('dva');

  return {
    __esModule: true,
    ...originalModule,
    default: null,
    useDispatch: jest.fn(() => jest.fn()),
    useSelector: jest.fn(() => ({
      translate: {
        imgUrl0: 'imgUrl1',
      },
    })),
  };
});

jest.mock('components/$/MarketCommon/config', () => {
  const originalModule = jest.requireActual('components/$/MarketCommon/config');

  return {
    __esModule: true,
    ...originalModule,
    default: null,
    useIsMobile: jest.fn(() => true),
  };
});

describe('CommonImg', () => {
  const content = {
    imgUrl: 'imgUrl0',
  };

  it('renders CommonImg', () => {
    act(() => {
      render(<CommonImg />);
    });

    expect(screen.queryByText('Hello, world')).toBeFalsy();
  });

  it('renders CommonImg', () => {
    let container;
    act(() => {
      const { container: container1 } = render(<CommonImg content={content} />);
      container = container1;
    });

    expect(screen.queryByRole('img')).toBeInTheDocument();
    fireEvent.click(screen.queryByRole('img'));
    expect(screen.queryByTestId('enlarge-img')).toBeInTheDocument();
    expect(screen.queryByTestId('enlarge-img')).toHaveStyle('width:100%');
    fireEvent.click(screen.queryByTestId('enlarge-img'));
  });
});
