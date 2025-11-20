/*
 * Owner: terry@kupotech.com
 */
import showToast from 'src/components/SimpleToast/index.js';
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Notification from 'rc-notification';

jest.mock('rc-notification', () => {
  const newInstance = jest.fn((_, callback) => callback(mNotification));
  const mNotification = {
    notice: jest.fn(),
    newInstance,
  };

  return {
    newInstance,
    __esModule: true,
    default: mNotification,
  };

});

describe('showToast', () => {
  it('should create a notification instance and show a toast', () => {
    const text = 'Test notification';
    const onClose = jest.fn();

    showToast(text, onClose);

    expect(Notification.newInstance).toHaveBeenCalledWith(
      {

        prefixCls: expect.any(String),

        maxCount: 1,

      },

      expect.any(Function)

    );

    expect(Notification.notice).toHaveBeenCalledWith({

      content: expect.any(Object),

      duration: 2,

      onClose: expect.any(Function),

    });

    // Simulate onClose callback

    const noticeArgs = Notification.notice.mock.calls[0][0];

    noticeArgs.onClose();

    expect(onClose).toHaveBeenCalled();

  });

});
