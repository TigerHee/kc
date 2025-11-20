/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { stub } from 'sinon';
import { createRender, act } from '../../../test/test-utils';

import Collapse from '.';

describe('Collapse', () => {
  const { clock, render } = createRender();

  const defaultProps = {
    in: true,
    children: <div data-testid="descendant" />,
  };

  it('should render a container around the wrapper', () => {
    const { container, getByTestId } = render(<Collapse {...defaultProps} />);
    const descendant = getByTestId('descendant');
    const collapse = container.firstChild;
    expect(collapse).toContainElement(descendant);
  });

  describe('transition lifecycle', () => {
    clock.withFakeTimers();
    let setProps;
    let collapse;
    let container;
    let nodeEnterHeightStyle;
    let nodeEnteringHeightStyle;
    let nodeExitHeightStyle;

    const handleEnter = jest.fn();
    const handleEnterWrapper = (...args) => {
      handleEnter(...args);
      nodeEnterHeightStyle = args[0].style.height;
    };
    const handleEntering = jest.fn();
    const handleEnteringWrapper = (...args) => {
      handleEntering(...args);
      nodeEnteringHeightStyle = args[0].style.height;
    };
    const handleEntered = jest.fn();
    const handleExit = jest.fn();
    const handleExitWrapper = (...args) => {
      handleExit(...args);
      nodeExitHeightStyle = args[0].style.height;
    };
    const handleExiting = jest.fn();
    const handleExited = jest.fn();
    const handleAddEndListener = jest.fn();

    beforeEach(() => {
      const renderProps = render(
        <Collapse
          addEndListener={handleAddEndListener}
          onEnter={handleEnterWrapper}
          onEntering={handleEnteringWrapper}
          onEntered={handleEntered}
          onExit={handleExitWrapper}
          onExiting={handleExiting}
          onExited={handleExited}
          timeout={300}
        >
          <div />
        </Collapse>,
      );
      container = renderProps.container;
      setProps = renderProps.setProps;
      collapse = container.firstChild;
      stub(collapse.firstChild, 'clientHeight').get(() => 666);
    });

    it('should run in', () => {
      setProps({ in: true });
      expect(nodeEnterHeightStyle).toEqual('0px');
      expect(handleEnter.mock.calls[0][0]).toEqual(collapse);
      expect(handleEnter.mock.calls[0][1]).toEqual(false);
      expect(nodeEnteringHeightStyle).toEqual('666px');
      expect(handleEntering).toHaveBeenCalledTimes(1);
      expect(handleEntering.mock.calls[0][0]).toEqual(collapse);
      expect(handleEntering.mock.calls[0][1]).toEqual(false);
      expect(handleAddEndListener).toHaveBeenCalledTimes(1);
      expect(handleAddEndListener.mock.calls[0][0]).toEqual(collapse);
      expect(typeof handleAddEndListener.mock.calls[0][1]).toEqual('function');
      clock.tick(300);

      expect(handleEntered.mock.calls[0][0].style.height).toEqual('auto');
      expect(handleEntered.mock.calls[0][1]).toEqual(false);
      expect(handleEntered).toHaveBeenCalledTimes(1);
    });

    it('should run out', () => {
      setProps({ in: true });
      setProps({ in: false });

      expect(nodeExitHeightStyle).toEqual('666px');
      expect(handleExiting.mock.calls[0][0].style.height).toEqual('0px');
      expect(handleExiting).toHaveBeenCalledTimes(1);
      expect(handleExiting.mock.calls[0][0]).toEqual(collapse);
      clock.tick(300);

      expect(handleExited.mock.calls[0][0].style.height).toEqual('0px');
      clock.tick(300);

      expect(handleExited).toHaveBeenCalledTimes(1);
      expect(handleExited.mock.calls[0][0]).toEqual(collapse);
    });
  });

  describe('prop: timeout', () => {
    clock.withFakeTimers();

    it('should delay based on height when timeout is auto', () => {
      const next1 = jest.fn();
      const Test = (props) => (
        <Collapse timeout="auto" onEntered={next1} {...props}>
          <div />
        </Collapse>
      );
      const renderProps1 = render(<Test />);
      const collapse = renderProps1.container.firstChild;

      stub(collapse.firstChild, 'clientHeight').get(() => 10);

      renderProps1.setProps({
        in: true,
      });

      const autoTransitionDuration = 10;
      expect(next1).toHaveBeenCalledTimes(0);
      clock.tick(0);

      expect(next1).toHaveBeenCalledTimes(0);
      clock.tick(autoTransitionDuration * 100);

      expect(next1).toHaveBeenCalledTimes(1);

      const next2 = jest.fn();
      const renderProps2 = render(
        <Collapse timeout="auto" onEntered={next2}>
          <div />
        </Collapse>,
      );
      renderProps2.setProps({ in: true });

      expect(next2).toHaveBeenCalledTimes(0);
      clock.tick(0);

      expect(next2).toHaveBeenCalledTimes(1);
    });

    it('should use timeout as delay when timeout is number', () => {
      const timeout = 10;
      const next = jest.fn();
      const { setProps } = render(
        <Collapse timeout={timeout} onEntered={next}>
          <div />
        </Collapse>,
      );

      setProps({ in: true });

      expect(next).toHaveBeenCalledTimes(0);

      act(() => {
        clock.tick(0);
      });

      expect(next).toHaveBeenCalledTimes(0);
      act(() => {
        clock.tick(timeout);
      });

      expect(next).toHaveBeenCalledTimes(1);
    });

    it('should create proper easeOut animation onEntering', () => {
      const handleEntering = jest.fn();

      const { setProps } = render(
        <Collapse
          onEntering={handleEntering}
          timeout={{
            enter: 556,
          }}
        >
          <div />
        </Collapse>,
      );

      setProps({ in: true });
      expect(handleEntering.mock.calls[0][0].style.transitionDuration).toEqual('556ms');
    });

    it('should create proper sharp animation onExiting', () => {
      const handleExiting = jest.fn();

      const { setProps } = render(
        <Collapse
          {...defaultProps}
          onExiting={handleExiting}
          timeout={{
            exit: 446,
          }}
        />,
      );

      setProps({
        in: false,
      });
      expect(handleExiting.mock.calls[0][0].style.transitionDuration).toEqual('446ms');
    });
  });

  describe('prop: collapsedSize', () => {
    const collapsedSize = '10px';

    it('should work when closed', () => {
      const { container } = render(<Collapse {...defaultProps} collapsedSize={collapsedSize} />);
      const collapse = container.firstChild;
      expect(collapse.style.minHeight).toEqual(collapsedSize);
    });

    it('should be taken into account in handleExiting', () => {
      const handleExiting = jest.fn();
      const { setProps } = render(
        <Collapse {...defaultProps} collapsedSize={collapsedSize} onExiting={handleExiting} />,
      );
      setProps({ in: false });

      expect(handleExiting.mock.calls[0][0].style.height).toEqual(collapsedSize);
    });
  });
});
