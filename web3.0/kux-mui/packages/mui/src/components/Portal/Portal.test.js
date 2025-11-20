/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

import { createRender } from '../../../test/test-utils';

import Portal from '.';

describe('Portal', () => {
  const { render } = createRender();

  describe('ref', () => {
    it('should have access to the mountNode when disabledPortal={false}', () => {
      const refSpy = jest.fn();
      const { unmount } = render(
        <Portal ref={refSpy}>
          <h1>Foo</h1>
        </Portal>,
      );
      expect(refSpy.mock.calls).toEqual([[document.body]]);
      unmount();
      expect(refSpy.mock.calls).toEqual([[document.body], [null]]);
    });

    it('should have access to the mountNode when disabledPortal={true}', () => {
      const refSpy = jest.fn();
      const { unmount } = render(
        <Portal disablePortal ref={refSpy}>
          <h1 className="woofPortal">Foo</h1>
        </Portal>,
      );
      const mountNode = document.querySelector('.woofPortal');
      expect(refSpy.mock.calls).toEqual([[mountNode]]);
      unmount();
      expect(refSpy.mock.calls).toEqual([[mountNode], [null]]);
    });

    it('should have access to the mountNode when switching disabledPortal', () => {
      const refSpy = jest.fn();
      const { setProps, unmount } = render(
        <Portal disablePortal ref={refSpy}>
          <h1 className="woofPortal">Foo</h1>
        </Portal>,
      );
      const mountNode = document.querySelector('.woofPortal');
      expect(refSpy.mock.calls).toEqual([[mountNode]]);
      setProps({
        disablePortal: false,
        ref: refSpy,
      });
      expect(refSpy.mock.calls).toEqual([[mountNode], [null], [document.body]]);
      unmount();
      expect(refSpy.mock.calls).toEqual([[mountNode], [null], [document.body], [null]]);
    });
  });

  it('should render in a different node', () => {
    render(
      <div id="test1">
        <h1 className="woofPortal1">Foo</h1>
        <Portal>
          <h1 className="woofPortal2">Foo</h1>
        </Portal>
      </div>,
    );
    const rootElement = document.querySelector('#test1');
    expect(rootElement.contains(document.querySelector('.woofPortal1'))).toEqual(true);
    expect(rootElement.contains(document.querySelector('.woofPortal2'))).toEqual(false);
  });

  it('should unmount when parent unmounts', () => {
    function Child() {
      const containerRef = React.useRef();
      return (
        <div>
          <div ref={containerRef} />
          <Portal container={() => containerRef.current}>
            <div id="test1" />
          </Portal>
        </div>
      );
    }

    function Parent(props) {
      const { show = true } = props;
      return <div>{show ? <Child /> : null}</div>;
    }

    const { setProps } = render(<Parent />);
    expect(document.querySelectorAll('#test1').length).toEqual(1);
    setProps({ show: false });
    expect(document.querySelectorAll('#test1').length).toEqual(0);
  });

  it('should render overlay into container (document)', () => {
    render(
      <Portal>
        <div className="test2" />
        <div className="test2" />
      </Portal>,
    );
    expect(document.querySelectorAll('.test2').length).toEqual(2);
  });

  it('should render overlay into container (DOMNode)', () => {
    const container = document.createElement('div');
    render(
      <Portal container={container}>
        <div id="test2" />
      </Portal>,
    );
    expect(container.querySelectorAll('#test2').length).toEqual(1);
  });

  it('should change container on prop change', () => {
    function ContainerTest(props) {
      const { containerElement = false, disablePortal = true } = props;
      const containerRef = React.useRef();
      const container = React.useCallback(() => (containerElement ? containerRef.current : null), [
        containerElement,
      ]);

      return (
        <span>
          <strong ref={containerRef} />
          <Portal disablePortal={disablePortal} container={container}>
            <div id="test3" />
          </Portal>
        </span>
      );
    }

    const { setProps } = render(<ContainerTest />);
    expect(document.querySelector('#test3').parentElement.nodeName).toEqual('SPAN');
    setProps({
      containerElement: true,
      disablePortal: true,
    });
    expect(document.querySelector('#test3').parentElement.nodeName).toEqual('SPAN');
    setProps({
      containerElement: true,
      disablePortal: false,
    });
    expect(document.querySelector('#test3').parentElement.nodeName).toEqual('STRONG');
    setProps({
      containerElement: false,
      disablePortal: false,
    });
    expect(document.querySelector('#test3').parentElement.nodeName).toEqual('BODY');
  });

  it('should call ref after child effect', () => {
    const callOrder = [];
    const handleRef = (node) => {
      if (node) {
        callOrder.push('ref');
      }
    };
    const updateFunction = () => {
      callOrder.push('effect');
    };

    function Test(props) {
      const { container } = props;
      const containerRef = React.useRef();

      React.useEffect(() => {
        if (containerRef.current !== container) {
          updateFunction();
        }
        containerRef.current = container;
      }, [container]);

      return (
        <Portal ref={handleRef} container={container}>
          <div />
        </Portal>
      );
    }

    const { setProps } = render(<Test container={document.createElement('div')} />);

    setProps({ container: null });
    setProps({ container: document.createElement('div') });
    setProps({ container: null });

    expect(callOrder).toEqual(['effect', 'ref', 'effect', 'ref', 'effect', 'ref', 'effect', 'ref']);
  });
});
