/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { createRender, act, screen, fireEvent } from '../../../test/test-utils';

import Popper from './index';
import Grow from '../Grow';
import ThemeProvider from '../ThemeProvider';

describe('Popper', () => {
  const { clock, render } = createRender({ clock: 'fake' });

  const defaultProps = {
    anchorEl: () => document.createElement('svg'),
    children: <span>Hello World</span>,
    open: true,
  };
  describe('prop: placement', () => {
    it('should have top placement', () => {
      render(
        <Popper {...defaultProps} placement="top">
          {({ placement }) => {
            return <span data-testid="renderSpy" data-placement={placement} />;
          }}
        </Popper>,
      );

      expect(screen.getByTestId('renderSpy')).toHaveAttribute('data-placement', 'top');
    });

    [
      {
        in: 'bottom-end',
        out: 'bottom-start',
      },
      {
        in: 'bottom-start',
        out: 'bottom-end',
      },
      {
        in: 'top-end',
        out: 'top-start',
      },
      {
        in: 'top-start',
        out: 'top-end',
      },
      {
        in: 'top',
        out: 'top',
      },
    ].forEach((test) => {
      it(`should ${test.in === test.out ? 'not ' : ''}flip ${test.in}`, () => {
        function Test() {
          const [anchorEl, setAnchorEl] = React.useState(null);

          return (
            <ThemeProvider>
              <div style={{ margin: '5em' }} ref={setAnchorEl} />
              <Popper anchorEl={anchorEl} open={Boolean(anchorEl)} placement={test.in}>
                {({ placement }) => {
                  return <div data-testid="placement">{placement}</div>;
                }}
              </Popper>
            </ThemeProvider>
          );
        }
        render(<Test />);

        expect(screen.getByTestId('placement')).toHaveTextContent(test.in);
      });
    });

    it('should flip placement when edge is reached', async function test() {
      const popperRef = React.createRef();
      render(
        <Popper popperRef={popperRef} {...defaultProps} placement="bottom">
          {({ placement }) => {
            return <div data-testid="placement">{placement}</div>;
          }}
        </Popper>,
      );
      expect(screen.getByTestId('placement')).toHaveTextContent('bottom');

      await act(async () => {
        await popperRef.current.setOptions({ placement: 'top' });
      });

      expect(screen.getByTestId('placement')).toHaveTextContent('top');
    });
  });

  describe('prop: open', () => {
    it('should open without any issue', () => {
      const { queryByRole, getByRole, setProps } = render(
        <Popper {...defaultProps} open={false} />,
      );
      expect(queryByRole('tooltip')).toEqual(null);
      setProps({ open: true });
      expect(getByRole('tooltip')).toHaveTextContent('Hello World');
    });

    it('should close without any issue', () => {
      const { queryByRole, getByRole, setProps } = render(<Popper {...defaultProps} />);
      expect(getByRole('tooltip')).toHaveTextContent('Hello World');
      setProps({ open: false });
      expect(queryByRole('tooltip')).toEqual(null);
    });
  });

  describe('prop: popperOptions', () => {
    it('should pass all popperOptions to popperjs', () => {
      const popperRef = React.createRef();
      const { setProps } = render(
        <Popper {...defaultProps} popperRef={popperRef} placement="top" open />,
      );

      setProps({
        popperOptions: {
          placement: 'bottom',
        },
      });

      expect(popperRef.current.state.placement).toEqual('bottom');
    });
  });

  describe('prop: keepMounted', () => {
    it('should keep the children mounted in the DOM', () => {
      render(<Popper {...defaultProps} keepMounted open={false} />);
      const tooltip = document.querySelector('[role="tooltip"]');
      expect(tooltip).toHaveTextContent('Hello World');
      expect(tooltip.style.display).toEqual('none');
    });

    describe('by default', () => {
      it('should remove the transition children in the DOM when closed whilst transition status is entering', () => {
        const children = <p>Hello World</p>;

        class OpenClose extends React.Component {
          // eslint-disable-next-line react/state-in-constructor
          state = {
            open: false,
          };

          handleClick = () => {
            this.setState({ open: true }, () => {
              this.setState({ open: false });
            });
          };

          render() {
            return (
              <div>
                <button type="button" onClick={this.handleClick}>
                  Toggle Tooltip
                </button>
                <Popper {...defaultProps} open={this.state.open} transition>
                  {({ TransitionProps }) => (
                    <Grow {...TransitionProps}>
                      <span>{children}</span>
                    </Grow>
                  )}
                </Popper>
              </div>
            );
          }
        }

        const { getByRole } = render(<OpenClose />);
        expect(document.querySelector('p')).toEqual(null);
        fireEvent.click(getByRole('button'));
        expect(document.querySelector('p')).toEqual(null);
      });
    });
  });

  describe('prop: transition', () => {
    clock.withFakeTimers();

    it('should work', () => {
      const { queryByRole, getByRole, setProps } = render(
        <Popper {...defaultProps} transition>
          {({ TransitionProps }) => (
            <Grow {...TransitionProps}>
              <span>Hello World</span>
            </Grow>
          )}
        </Popper>,
      );

      expect(getByRole('tooltip')).toHaveTextContent('Hello World');

      setProps({ anchorEl: null, open: false });
      clock.tick(0);

      expect(queryByRole('tooltip')).toEqual(null);
    });
  });

  describe('prop: popperRef', () => {
    it('should return a ref', () => {
      const ref1 = React.createRef();
      const ref2 = React.createRef();
      const { setProps } = render(<Popper {...defaultProps} popperRef={ref1} />);
      expect(ref1.current).not.toEqual(null);
      setProps({
        popperRef: ref2,
      });
      expect(ref1.current).toEqual(null);
      expect(ref2.current).not.toEqual(null);
    });
  });

  describe('prop: disablePortal', () => {
    it('should work', () => {
      const popperRef = React.createRef();
      const { getByRole } = render(
        <Popper {...defaultProps} disablePortal popperRef={popperRef} />,
      );
      // renders
      expect(getByRole('tooltip')).not.toEqual(null);
      // correctly sets modifiers
      expect(popperRef.current.state.options.modifiers[0].options.altBoundary).toEqual(true);
    });

    it('sets preventOverflow altBoundary to false when disablePortal is false', () => {
      const popperRef = React.createRef();
      const { getByRole } = render(<Popper {...defaultProps} popperRef={popperRef} />);
      // renders
      expect(getByRole('tooltip')).not.toEqual(null);
      // correctly sets modifiers
      expect(popperRef.current.state.options.modifiers[0].options.altBoundary).toEqual(false);
    });
  });

  describe('display', () => {
    clock.withFakeTimers();

    it('should keep display:none when not toggled and transition/keepMounted/disablePortal props are set', () => {
      const { getByRole, setProps } = render(
        <Popper {...defaultProps} open={false} keepMounted transition disablePortal>
          {({ TransitionProps }) => (
            <Grow {...TransitionProps}>
              <span>Hello World</span>
            </Grow>
          )}
        </Popper>,
      );

      expect(getByRole('tooltip', { hidden: true }).style.display).toEqual('');

      setProps({ open: true });
      clock.tick(0);

      setProps({ open: false });
      clock.tick(0);
      expect(getByRole('tooltip', { hidden: true }).style.display).toEqual('');
    });
  });
});
