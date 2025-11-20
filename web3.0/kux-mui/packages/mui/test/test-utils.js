/**
 * Owner: victor.ren@kupotech.com
 */
import '@testing-library/jest-dom/extend-expect';
import { configureAxe } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import createRender, { screen } from './createRender';
import { fireEvent, act } from '@testing-library/react';
import * as fireDiscreteEvent from './fireDiscreteEvent';

export { userEvent, createRender, fireEvent, screen, act, fireDiscreteEvent };

export const axe = configureAxe({
  rules: {
    region: { enabled: false },
  },
});

export const sleep = async (timeout = 0) => {
  await act(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  });
};
