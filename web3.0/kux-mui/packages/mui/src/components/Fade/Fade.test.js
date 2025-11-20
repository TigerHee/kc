/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { createRender } from '../../../test/test-utils';

import Fade from './index';

describe('Fade', () => {
  const { render, clock } = createRender();
  describe('transition lifecycle', () => {
    it('calls the appropriate callbacks for each transition', () => {
      const handleEnter = jest.fn();
      const handleEntering = jest.fn();
      const handleEntered = jest.fn();
      const handleExit = jest.fn();
      const handleExiting = jest.fn();
      const handleExited = jest.fn();

      const { container, setProps } = render(
        <Fade
          onEnter={handleEnter}
          onEntering={handleEntering}
          onEntered={handleEntered}
          onExit={handleExit}
          onExiting={handleExiting}
          onExited={handleExited}
        >
          <div id="test" />
        </Fade>,
      );
      const child = container.querySelector('#test');

      setProps({ in: true });

      expect(handleEnter).toHaveBeenCalledTimes(1);
      expect(handleEnter.mock.calls[0][0]).toEqual(child);
      expect(handleEnter.mock.calls[0][0].style.transition).toMatch(
        /opacity 225ms cubic-bezier\(0.4, 0, 0.2, 1\)( 0ms)?/,
      );

      expect(handleEntering).toHaveBeenCalledTimes(1);
      expect(handleEntering.mock.calls[0][0]).toEqual(child);

      clock.tick(1000);

      expect(handleEntered).toHaveBeenCalledTimes(1);
      expect(handleEntered.mock.calls[0][0]).toEqual(child);

      setProps({ in: false });

      expect(handleExit).toHaveBeenCalledTimes(1);
      expect(handleExit.mock.calls[0][0]).toEqual(child);

      expect(handleExit.mock.calls[0][0].style.transition).toMatch(
        /opacity 195ms cubic-bezier\(0.4, 0, 0.2, 1\)( 0ms)?/,
      );

      expect(handleExiting).toHaveBeenCalledTimes(1);
      expect(handleExiting.mock.calls[0][0]).toEqual(child);

      clock.tick(1000);

      expect(handleExited).toHaveBeenCalledTimes(1);
      expect(handleExited.mock.calls[0][0]).toEqual(child);
    });
  });

  describe('prop: appear', () => {
    it('should work when initially hidden, appear=true', () => {
      const { container } = render(
        <Fade in={false} appear>
          <div>Foo</div>
        </Fade>,
      );

      const element = container.querySelector('div');

      expect(element).toHaveStyle({ opacity: '0' });
      expect(element).toHaveStyle({ visibility: 'hidden' });
    });

    it('should work when initially hidden, appear=false', () => {
      const { container } = render(
        <Fade in={false} appear={false}>
          <div>Foo</div>
        </Fade>,
      );

      const element = container.querySelector('div');

      expect(element).toHaveStyle({ opacity: '0' });
      expect(element).toHaveStyle({ visibility: 'hidden' });
    });
  });
});
