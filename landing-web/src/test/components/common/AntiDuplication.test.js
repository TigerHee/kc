/*
 * @Owner: jesse.shao@kupotech.com
 */
// import AntiDuplication from '@kp-toc/anti-duplication';
import AntiDuplication from 'components/common/AntiDuplication';
import React, { useState } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';

function App({ onClick }) {
  return <div onClick={onClick}>fooApp</div>;
}

describe('test AntiDuplication', () => {
  test('renders App component', () => {
    render(
      <AntiDuplication>
        <App />
      </AntiDuplication>,
    );
    expect(screen.getByText('fooApp')).toBeInTheDocument();
  });

  test('click App component', () => {
    const fn = jest.fn();
    render(
      <AntiDuplication>
        <App onClick={fn} />
      </AntiDuplication>,
    );

    fireEvent.click(screen.getByText('fooApp'));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('click App component times', () => {
    const fn = jest.fn();
    render(
      <AntiDuplication>
        <App onClick={fn} />
      </AntiDuplication>,
    );

    fireEvent.click(screen.getByText('fooApp'));
    fireEvent.click(screen.getByText('fooApp'));
    fireEvent.click(screen.getByText('fooApp'));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('click App component blockFeedback', () => {
    const fn = jest.fn();
    const blockFeedbackFn = jest.fn();
    render(
      <AntiDuplication blockFeedback={blockFeedbackFn}>
        <App onClick={fn} />
      </AntiDuplication>,
    );

    fireEvent.click(screen.getByText('fooApp'));
    fireEvent.click(screen.getByText('fooApp'));
    fireEvent.click(screen.getByText('fooApp'));
    expect(blockFeedbackFn).toHaveBeenCalledTimes(2);
  });

  test('click App component injectPropsFn', async () => {
    const fn = jest.fn();
    render(
      <AntiDuplication
        injectPropsFn={(lƒoading) => {
          return {
            'data-x': '12',
          };
        }}
      >
        <App onClick={fn} />
      </AntiDuplication>,
    );

    act(() => {
      fireEvent.click(screen.getByText('fooApp'));
    });
    expect(fn).toHaveBeenCalledTimes(1);
  });

  // test('click App component multiple child', async () => {
  //   render(
  //     <AntiDuplication>
  //       <button>wq</button>
  //       <App />
  //     </AntiDuplication>,
  //   );
  //   expect(screen.getByText(/antiDuplication occupy/i)).toBeInTheDocument();
  // });

  // test('click App component no child', async () => {
  //   const throwError = () => {
  //     try {
  //       render(<AntiDuplication />);
  //     } catch (e) {}
  //   };

  //   expect(throwError).toThrow();
  //   // expect(screen.getByText(/antiDuplication occupy/i)).toBeInTheDocument();
  // });

  // test('click App component wait', async () => {
  //   const fn = jest.fn();
  //   render(
  //     <AntiDuplication>
  //       <App onClick={fn} />
  //     </AntiDuplication>,
  //   );
  //   fireEvent.click(await screen.findByText('fooApp'));
  //   await act(async () => {
  //     await new Promise((r) => setTimeout(r, 1000));
  //   });

  //   fireEvent.click(await screen.getByText('fooApp'));
  //   expect(fn).toHaveBeenCalledTimes(2);
  // });

  // test('click App component wait 400ms', async () => {
  //   const fn = jest.fn();
  //   render(
  //     <AntiDuplication>
  //       <App onClick={fn} />
  //     </AntiDuplication>,
  //   );
  //   fireEvent.click(await screen.findByText('fooApp'));
  //   await act(async () => {
  //     await new Promise((r) => setTimeout(r, 400));
  //   });
  //   fireEvent.click(await screen.findByText('fooApp'));
  //   await act(async () => {
  //     await new Promise((r) => setTimeout(r, 400));
  //   });
  //   fireEvent.click(await screen.findByText('fooApp'));

  //   expect(fn).toHaveBeenCalledTimes(1);
  // });

  // test('click App component wait 400ms throttle', async () => {
  //   const fn = jest.fn();
  //   render(
  //     <AntiDuplication type="throttle">
  //       <App onClick={fn} />
  //     </AntiDuplication>,
  //   );
  //   fireEvent.click(await screen.findByText('fooApp'));
  //   await act(async () => {
  //     await new Promise((r) => setTimeout(r, 400));
  //   });
  //   fireEvent.click(await screen.findByText('fooApp'));
  //   await act(async () => {
  //     await new Promise((r) => setTimeout(r, 400));
  //   });
  //   fireEvent.click(await screen.findByText('fooApp'));

  //   expect(fn).toHaveBeenCalledTimes(2);
  // });
});




// import React from 'react';
// import { render, fireEvent, act } from '@testing-library/react';
// import AntiDuplication from './AntiDuplication';

describe('AntiDuplication component', () => {
  const onClickMock = jest.fn();
  const blockFeedbackMock = jest.fn();
  const injectPropsFnMock = jest.fn((loading) => ({ disabled: loading }));

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should render children', () => {
    const { getByText } = render(
      <AntiDuplication>
        <button>Click me</button>
      </AntiDuplication>,
    );
    expect(getByText('Click me')).toBeInTheDocument();
  });

  it('should throw an error if there is no child', () => {
    expect(() => {
      render(<AntiDuplication />);
    }).toThrow('get children error');
  });

  it('should disable click function for a period of time when clicked', () => {
    const { getByText } = render(
      <AntiDuplication>
        <button onClick={onClickMock}>Click me</button>
      </AntiDuplication>,
    );

    fireEvent.click(getByText('Click me'));
    expect(onClickMock).toHaveBeenCalledTimes(1);

    // fast-forward until after the interval
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(getByText('Click me')).toBeEnabled();
  });

  it('should call blockFeedback function when clicked during the loading period', () => {
    const { getByText } = render(
      <AntiDuplication blockFeedback={blockFeedbackMock}>
        <button onClick={onClickMock}>Click me</button>
      </AntiDuplication>,
    );

    fireEvent.click(getByText('Click me'));
    fireEvent.click(getByText('Click me'));
    expect(blockFeedbackMock).toHaveBeenCalledTimes(1);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('should call injectPropsFn function with the correct loading state', () => {
    const { getByText } = render(
      <AntiDuplication injectPropsFn={injectPropsFnMock}>
        <button onClick={onClickMock}>Click me</button>
      </AntiDuplication>,
    );

    expect(injectPropsFnMock).toHaveBeenCalledTimes(1);
    expect(injectPropsFnMock).toHaveBeenCalledWith(false);

    fireEvent.click(getByText('Click me'));
    expect(injectPropsFnMock).toHaveBeenCalledTimes(2);
    expect(injectPropsFnMock).toHaveBeenCalledWith(true);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(injectPropsFnMock).toHaveBeenCalledTimes(3);
    expect(injectPropsFnMock).toHaveBeenCalledWith(false);
  });

  it('should work with throttle type', () => {
    const { getByText } = render(
      <AntiDuplication type="throttle">
        <button onClick={onClickMock}>Click me</button>
      </AntiDuplication>,
    );

    fireEvent.click(getByText('Click me'));
    expect(onClickMock).toHaveBeenCalledTimes(1);

    fireEvent.click(getByText('Click me'));
    fireEvent.click(getByText('Click me'));
    fireEvent.click(getByText('Click me'));
    expect(onClickMock).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});