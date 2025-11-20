/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { createRender } from '../../../test/test-utils';
import useForkRef from '../../hooks/useForkRef';

import Grow from '.';

describe('Grow', () => {
  const { clock, render } = createRender();

  const defaultProps = {
    in: true,
    children: <div />,
  };
  describe('calls the appropriate callbacks for each transition', () => {
    clock.withFakeTimers();

    it('calls the appropriate callbacks for each transition', () => {
      const handleAddEndListener = jest.fn();
      const handleEnter = jest.fn();
      const handleEntering = jest.fn();
      const handleEntered = jest.fn();
      const handleExit = jest.fn();
      const handleExiting = jest.fn();
      const handleExited = jest.fn();
      const { container, setProps } = render(
        <Grow
          addEndListener={handleAddEndListener}
          onEnter={handleEnter}
          onEntering={handleEntering}
          onEntered={handleEntered}
          onExit={handleExit}
          onExiting={handleExiting}
          onExited={handleExited}
        >
          <div id="test" />
        </Grow>,
      );

      const child = container.querySelector('#test');

      setProps({ in: true });

      expect(handleAddEndListener).toHaveBeenCalledTimes(1);
      expect(handleAddEndListener.mock.calls[0][0]).toEqual(child);
      expect(typeof handleAddEndListener.mock.calls[0][1]).toEqual('function');

      expect(handleEnter).toHaveBeenCalledTimes(1);
      expect(handleEnter.mock.calls[0][0]).toEqual(child);

      expect(handleEnter.mock.calls[0][0].style.transition).toMatch(
        /opacity (0ms )?cubic-bezier\(0.4, 0, 0.2, 1\)( 0ms)?,( )?transform (0ms )?cubic-bezier\(0.4, 0, 0.2, 1\)( 0ms)?/,
      );

      expect(handleEntering).toHaveBeenCalledTimes(1);
      expect(handleEntering.mock.calls[0][0]).toEqual(child);

      clock.tick(1000);

      expect(handleEntered).toHaveBeenCalledTimes(1);
      expect(handleEntered.mock.calls[0][0]).toEqual(child);

      setProps({ in: false });

      expect(handleExit).toHaveBeenCalledTimes(1);
      expect(handleExit.mock.calls[0][0]).toEqual(child);

      expect(handleExit.mock.calls[0][0].style.opacity).toEqual('0');
      expect(handleExit.mock.calls[0][0].style.transform).toEqual(
        'scale(0.75, 0.5625)',
        'should have the exit scale',
      );

      expect(handleExiting).toHaveBeenCalledTimes(1);
      expect(handleExiting.mock.calls[0][0]).toEqual(child);

      expect(handleExiting).toHaveBeenCalledTimes(1);
      expect(handleExiting.mock.calls[0][0]).toEqual(child);

      clock.tick(1000);

      expect(handleExited).toHaveBeenCalledTimes(1);
      expect(handleExited.mock.calls[0][0]).toEqual(child);
    });
  });

  describe('prop: timeout', () => {
    const enterDuration = 556;
    const leaveDuration = 446;
    clock.withFakeTimers();

    describe('onEnter', () => {
      it('should create proper easeOut animation', () => {
        const handleEnter = jest.fn();
        render(
          <Grow
            {...defaultProps}
            timeout={{
              enter: enterDuration,
              exit: leaveDuration,
            }}
            onEnter={handleEnter}
          />,
        );

        expect(handleEnter.mock.calls[0][0].style.transition).toMatch(
          new RegExp(`${enterDuration}ms`),
        );
      });

      it('should delay based on height when timeout is auto', () => {
        const handleEntered = jest.fn();

        const autoTransitionDuration = 10;
        const FakeDiv = React.forwardRef(function FakeDiv(props, ref) {
          const divRef = React.useRef(null);
          const handleRef = useForkRef(ref, divRef);

          React.useEffect(() => {
            // For jsdom
            Object.defineProperty(divRef.current, 'clientHeight', {
              value: autoTransitionDuration,
            });
          });

          return (
            <div
              ref={handleRef}
              style={{
                height: autoTransitionDuration,
              }}
              {...props}
            />
          );
        });

        function MyTest(props) {
          return (
            <Grow timeout="auto" onEntered={handleEntered} {...props}>
              <FakeDiv />
            </Grow>
          );
        }

        const { setProps } = render(<MyTest />);
        setProps({
          in: true,
        });

        expect(handleEntered).toHaveBeenCalledTimes(0);

        clock.tick(0);

        expect(handleEntered).toHaveBeenCalledTimes(0);

        clock.tick(autoTransitionDuration * 100);

        expect(handleEntered).toHaveBeenCalledTimes(1);

        const handleEntered2 = jest.fn();
        render(
          <Grow in timeout="auto" onEntered={handleEntered2}>
            <div />
          </Grow>,
        );

        expect(handleEntered2).toHaveBeenCalledTimes(0);

        clock.tick(0);

        expect(handleEntered2).toHaveBeenCalledTimes(1);
      });

      it('should use timeout as delay when timeout is number', () => {
        const timeout = 10;
        const handleEntered = jest.fn();

        render(<Grow {...defaultProps} timeout={timeout} onEntered={handleEntered} />);

        expect(handleEntered).toHaveBeenCalledTimes(0);

        clock.tick(0);

        expect(handleEntered).toHaveBeenCalledTimes(0);

        clock.tick(timeout);

        expect(handleEntered).toHaveBeenCalledTimes(1);
      });
    });

    describe('onExit', () => {
      it('should delay based on height when timeout is auto', () => {
        const handleExited = jest.fn();
        const { setProps } = render(
          <Grow in timeout="auto" onExited={handleExited}>
            <div />
          </Grow>,
        );

        clock.tick(0);

        setProps({
          in: false,
        });

        expect(handleExited).toHaveBeenCalledTimes(0);
        clock.tick(0);

        expect(handleExited).toHaveBeenCalledTimes(1);
      });

      it('should use timeout as delay when timeout is number', () => {
        const timeout = 20;
        const handleExited = jest.fn();
        const { setProps } = render(
          <Grow {...defaultProps} timeout={timeout} onExited={handleExited} />,
        );

        clock.tick(timeout);
        setProps({
          in: false,
        });

        expect(handleExited).toHaveBeenCalledTimes(0);
        clock.tick(0);

        expect(handleExited).toHaveBeenCalledTimes(0);
        clock.tick(timeout);

        expect(handleExited).toHaveBeenCalledTimes(1);
      });

      it('should create proper sharp animation', () => {
        const handleExit = jest.fn();
        const { setProps } = render(
          <Grow
            {...defaultProps}
            timeout={{
              enter: enterDuration,
              exit: leaveDuration,
            }}
            onExit={handleExit}
          />,
        );

        setProps({
          in: false,
        });

        expect(handleExit.mock.calls[0][0].style.transition).toMatch(
          new RegExp(`${leaveDuration}ms`),
        );
      });
    });
  });
});
