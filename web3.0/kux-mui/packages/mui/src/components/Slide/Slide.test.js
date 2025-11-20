/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { stub } from 'sinon';
import { createRender, act } from '../../../test/test-utils';
import useForkRef from '../../hooks/useForkRef';
import Slide from '.';

describe('Slide', () => {
  const { clock, render } = createRender();

  const defaultProps = {
    in: true,
    children: <div id="testChild" />,
    direction: 'down',
  };

  it('should not override children styles', () => {
    const { container } = render(
      <Slide {...defaultProps} style={{ color: 'red', backgroundColor: 'yellow' }}>
        <div id="with-slide" style={{ color: 'blue' }} />
      </Slide>,
    );

    const slide = container.querySelector('#with-slide');
    expect(slide).toHaveStyle({ backgroundColor: 'yellow' });
    expect(slide).toHaveStyle({ color: 'blue' });
    expect(slide).toHaveStyle({ visibility: 'visible' });
  });

  describe('transition lifecycle', () => {
    clock.withFakeTimers();

    it('tests', () => {
      const handleAddEndListener = jest.fn();
      const handleEnter = jest.fn();
      const handleEntering = jest.fn();
      const handleEntered = jest.fn();
      const handleExit = jest.fn();
      const handleExiting = jest.fn();
      const handleExited = jest.fn();

      let child;
      const { setProps } = render(
        <Slide
          addEndListener={handleAddEndListener}
          onEnter={handleEnter}
          onEntering={handleEntering}
          onEntered={handleEntered}
          onExit={handleExit}
          onExiting={handleExiting}
          onExited={handleExited}
        >
          <div
            ref={(ref) => {
              child = ref;
            }}
          />
        </Slide>,
      );

      setProps({ in: true });

      expect(handleAddEndListener).toHaveBeenCalledTimes(1);
      expect(handleAddEndListener.mock.calls[0][0]).toEqual(child);
      expect(typeof handleAddEndListener.mock.calls[0][1]).toEqual('function');

      expect(handleEntering).toHaveBeenCalledTimes(1);
      expect(handleEntering.mock.calls[0][0]).toEqual(child);

      expect(handleEntering.mock.calls[0][0].style.transform).toMatch(/none/);

      expect(handleEntering).toHaveBeenCalledTimes(1);
      expect(handleEntering.mock.calls[0][0]).toEqual(child);

      clock.tick(1000);
      expect(handleEntered).toHaveBeenCalledTimes(1);

      setProps({ in: false });

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
    it('should create proper enter animation onEntering', () => {
      const handleEntering = jest.fn();

      render(
        <Slide
          {...defaultProps}
          timeout={{
            enter: 556,
          }}
          onEntering={handleEntering}
        />,
      );

      expect(handleEntering.mock.calls[0][0].style.transition).toMatch(
        /transform 556ms cubic-bezier\(0(.0)?, 0, 0.2, 1\)( 0ms)?/,
      );
    });

    it('should create proper exit animation', () => {
      const handleExit = jest.fn();
      const { setProps } = render(
        <Slide
          {...defaultProps}
          timeout={{
            exit: 446,
          }}
          onExit={handleExit}
        />,
      );

      setProps({ in: false });

      expect(handleExit.mock.calls[0][0].style.transition).toMatch(
        /transform 446ms cubic-bezier\(0.4, 0, 0.6, 1\)( 0ms)?/,
      );
    });
  });

  describe('prop: easing', () => {
    it('should create proper enter animation', () => {
      const handleEntering = jest.fn();

      render(
        <Slide
          {...defaultProps}
          easing={{
            enter: 'cubic-bezier(1, 1, 0, 0)',
          }}
          onEntering={handleEntering}
        />,
      );

      expect(handleEntering.mock.calls[0][0].style.transition).toMatch(
        /transform 225ms cubic-bezier\(1, 1, 0, 0\)( 0ms)?/,
      );
    });

    it('should create proper exit animation', () => {
      const handleExit = jest.fn();
      const { setProps } = render(
        <Slide
          {...defaultProps}
          easing={{
            exit: 'cubic-bezier(0, 0, 1, 1)',
          }}
          onExit={handleExit}
        />,
      );

      setProps({ in: false });

      expect(handleExit.mock.calls[0][0].style.transition).toMatch(
        /transform 195ms cubic-bezier\(0, 0, 1, 1\)( 0ms)?/,
      );
    });
  });

  describe('prop: direction', () => {
    it('should update the position', () => {
      const { container, setProps } = render(
        <Slide {...defaultProps} in={false} direction="left" />,
      );
      const child = container.querySelector('#testChild');

      const transition1 = child.style.transform;
      setProps({
        direction: 'right',
      });

      const transition2 = child.style.transform;
      expect(transition1).not.toEqual(transition2);
    });
  });

  describe('transform styling', () => {
    const FakeDiv = React.forwardRef((props, ref) => {
      const stubBoundingClientRect = (element) => {
        if (element !== null) {
          element.fakeTransform = 'none';
          try {
            stub(element, 'getBoundingClientRect').callsFake(() => ({
              width: 500,
              height: 300,
              left: 300,
              right: 800,
              top: 200,
              bottom: 500,
              ...props.rect,
            }));
          } catch (error) {
            // already stubbed
          }
        }
      };
      const handleRef = useForkRef(ref, stubBoundingClientRect);
      return <div {...props} style={{ height: 300, width: 500 }} ref={handleRef} />;
    });

    describe('handleEnter()', () => {
      it('should set element transform and transition in the `left` direction', () => {
        let nodeEnterTransformStyle;
        const { setProps } = render(
          <Slide
            direction="left"
            onEnter={(node) => {
              nodeEnterTransformStyle = node.style.transform;
            }}
          >
            <FakeDiv />
          </Slide>,
        );

        setProps({ in: true });

        expect(nodeEnterTransformStyle).toEqual(`translateX(${global.innerWidth - 300}px)`);
      });

      it('should set element transform and transition in the `right` direction', () => {
        let nodeEnterTransformStyle;
        const { setProps } = render(
          <Slide
            direction="right"
            onEnter={(node) => {
              nodeEnterTransformStyle = node.style.transform;
            }}
          >
            <FakeDiv />
          </Slide>,
        );

        setProps({ in: true });

        expect(nodeEnterTransformStyle).toEqual(`translateX(-${300 + 500}px)`);
      });

      it('should set element transform and transition in the `up` direction', () => {
        let nodeEnterTransformStyle;
        const { setProps } = render(
          <Slide
            direction="up"
            onEnter={(node) => {
              nodeEnterTransformStyle = node.style.transform;
            }}
          >
            <FakeDiv />
          </Slide>,
        );

        setProps({ in: true });

        expect(nodeEnterTransformStyle).toEqual(`translateY(${global.innerHeight - 200}px)`);
      });

      it('should set element transform and transition in the `down` direction', () => {
        let nodeEnterTransformStyle;
        const { setProps } = render(
          <Slide
            direction="down"
            onEnter={(node) => {
              nodeEnterTransformStyle = node.style.transform;
            }}
          >
            <FakeDiv />
          </Slide>,
        );

        setProps({ in: true });

        expect(nodeEnterTransformStyle).toEqual('translateY(-500px)');
      });

      it('should reset the previous transition if needed', () => {
        const childRef = React.createRef();
        let nodeEnterTransformStyle;
        const { setProps } = render(
          <Slide
            direction="right"
            onEnter={(node) => {
              nodeEnterTransformStyle = node.style.transform;
            }}
          >
            <FakeDiv ref={childRef} />
          </Slide>,
        );

        childRef.current.style.transform = 'translateX(-800px)';
        setProps({ in: true });

        expect(nodeEnterTransformStyle).toEqual('translateX(-800px)');
      });

      it('should set element transform in the `up` direction when element is offscreen', () => {
        const childRef = React.createRef();
        let nodeEnterTransformStyle;
        const { setProps } = render(
          <Slide
            direction="up"
            onEnter={(node) => {
              nodeEnterTransformStyle = node.style.transform;
            }}
          >
            <FakeDiv rect={{ top: -100 }} ref={childRef} />
          </Slide>,
        );

        setProps({ in: true });

        expect(nodeEnterTransformStyle).toEqual(`translateY(${global.innerHeight + 100}px)`);
      });

      it('should set element transform in the `left` direction when element is offscreen', () => {
        const childRef = React.createRef();
        let nodeEnterTransformStyle;
        const { setProps } = render(
          <Slide
            direction="left"
            onEnter={(node) => {
              nodeEnterTransformStyle = node.style.transform;
            }}
          >
            <FakeDiv rect={{ left: -100 }} ref={childRef} />
          </Slide>,
        );

        setProps({ in: true });

        expect(nodeEnterTransformStyle).toEqual(`translateX(${global.innerWidth + 100}px)`);
      });
    });

    describe('handleExiting()', () => {
      it('should set element transform and transition in the `left` direction', () => {
        let nodeExitingTransformStyle;
        const { setProps } = render(
          <Slide
            direction="left"
            in
            onExit={(node) => {
              nodeExitingTransformStyle = node.style.transform;
            }}
          >
            <FakeDiv />
          </Slide>,
        );

        setProps({ in: false });

        expect(nodeExitingTransformStyle).toEqual(`translateX(${global.innerWidth - 300}px)`);
      });

      it('should set element transform and transition in the `right` direction', () => {
        let nodeExitingTransformStyle;
        const { setProps } = render(
          <Slide
            direction="right"
            in
            onExit={(node) => {
              nodeExitingTransformStyle = node.style.transform;
            }}
          >
            <FakeDiv />
          </Slide>,
        );

        setProps({ in: false });

        expect(nodeExitingTransformStyle).toEqual('translateX(-800px)');
      });

      it('should set element transform and transition in the `up` direction', () => {
        let nodeExitingTransformStyle;
        const { setProps } = render(
          <Slide
            direction="up"
            in
            onExit={(node) => {
              nodeExitingTransformStyle = node.style.transform;
            }}
          >
            <FakeDiv />
          </Slide>,
        );

        setProps({ in: false });

        expect(nodeExitingTransformStyle).toEqual(`translateY(${global.innerHeight - 200}px)`);
      });

      it('should set element transform and transition in the `down` direction', () => {
        let nodeExitingTransformStyle;
        const { setProps } = render(
          <Slide
            direction="down"
            in
            onExit={(node) => {
              nodeExitingTransformStyle = node.style.transform;
            }}
          >
            <FakeDiv />
          </Slide>,
        );

        setProps({ in: false });

        expect(nodeExitingTransformStyle).toEqual('translateY(-500px)');
      });
    });

    describe('prop: container', () => {
      it('should set element transform and transition in the `up` direction', function test() {
        let nodeExitingTransformStyle;
        const height = 200;
        function Test(props) {
          const [container, setContainer] = React.useState(null);
          return (
            <div
              ref={(node) => {
                setContainer(node);
              }}
              style={{ height: `${height}px`, width: '200px' }}
            >
              <Slide
                direction="up"
                in
                {...props}
                container={container}
                onExit={(node) => {
                  nodeExitingTransformStyle = node.style.transform;
                }}
              >
                <FakeDiv rect={{ top: 8 }} />
              </Slide>
            </div>
          );
        }
        const { setProps } = render(<Test />);
        setProps({ in: false });
        expect(nodeExitingTransformStyle).toEqual(`translateY(${-8}px)`);
      });
    });

    describe('mount', () => {
      it('should work when initially hidden', () => {
        const childRef = React.createRef();
        render(
          <Slide in={false}>
            <div ref={childRef}>Foo</div>
          </Slide>,
        );
        const transition = childRef.current;

        expect(transition.style.visibility).toEqual('hidden');
        expect(transition.style.transform).not.toEqual(undefined);
      });
    });

    describe('resize', () => {
      clock.withFakeTimers();

      it('should recompute the correct position', () => {
        const { container } = render(
          <Slide direction="up" in={false}>
            <div id="testChild">Foo</div>
          </Slide>,
        );

        act(() => {
          window.dispatchEvent(new window.Event('resize', {}));
        });
        clock.tick(166);

        const child = container.querySelector('#testChild');
        expect(child.style.transform).not.toEqual(undefined);
      });

      it('should do nothing when visible', () => {
        render(<Slide {...defaultProps} />);
        act(() => {
          window.dispatchEvent(new window.Event('resize', {}));
        });
        clock.tick(166);
      });
    });
  });
});
