/**
 * Owner: garuda@kupotech.com
 */

import React from 'react';
import configureStore from 'redux-mock-store';
import { customRender, fireEvent } from '_tests_/test-setup';
import { trackClick } from 'utils/ga';

import EventProxy from 'components/EventProxy';

jest.mock('utils/ga', () => ({
  trackClick: jest.fn(),
}));

const mockStore = configureStore();
const store = mockStore({});

describe('EventProxy', () => {
  afterEach(() => {
    // 重制全部吧mock
    jest.clearAllMocks();
  });

  it('dispatches an action and calls trackClick when a click event is triggered on an element with data-key="login"', () => {
    const { container } = customRender(
      <EventProxy>
        <button data-key="login">Login</button>
      </EventProxy>,
      {
        store,
      },
    );

    const button = container.querySelector('button');
    fireEvent.click(button);

    const actions = store.getActions();
    expect(actions).toEqual([
      {
        type: 'app/update',
        payload: {
          open: true,
        },
      },
    ]);

    expect(trackClick).toHaveBeenCalledWith(['login', '1']);
  });

  it('calls trackClick when a click event is triggered on an element with data-key="register"', () => {
    const { container } = customRender(
      <EventProxy>
        <button data-key="register">Register</button>
      </EventProxy>,
      {
        store,
      },
    );

    const button = container.querySelector('button');
    fireEvent.click(button);

    expect(trackClick).toHaveBeenCalledWith(['register', '1']);
  });
  it('does not call dispatch or trackClick when a click event is triggered on an element without data-key', () => {
    const { container } = customRender(
      <EventProxy>
        <button>No Data Key</button>
      </EventProxy>,
      {
        store,
      },
    );

    const button = container.querySelector('button');
    fireEvent.click(button);

    expect(trackClick).not.toHaveBeenCalled();
  });

  it('does not call dispatch or trackClick when a click event is triggered on an element with data-key not equal to "login" or "register"', () => {
    const { container } = customRender(
      <EventProxy>
        <button data-key="other">Other</button>
      </EventProxy>,
      {
        store,
      },
    );

    const button = container.querySelector('button');
    fireEvent.click(button);

    expect(trackClick).not.toHaveBeenCalled();
  });
});
