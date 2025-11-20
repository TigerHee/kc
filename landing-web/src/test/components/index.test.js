/*
 * @Owner: jesse.shao@kupotech.com
 */
import Toast from 'components/Toast';
import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

describe('test Toast', () => {
  test('should show text on document1', () => {
    const handler = jest.fn();
    Toast({
      type: 'success',
      msg: 'msg1',
      duration: 100,
      theme: 'light',
      className: 'className123',
      onClose: handler,
    });
    expect(screen.queryByText('msg1')).toBeInTheDocument();
    expect(handler).toBeCalledTimes(0);
  });

  test('should show text on document2', async () => {
    const handler = jest.fn();
    Toast({
      type: 'success',
      msg: 'msg2',
      duration: 100,
      theme: 'light',
      className: 'className123',
      onClose: handler,
    });
    expect(screen.queryByText('msg2')).toBeInTheDocument();
    await new Promise((r) => setTimeout(r, 1000));
    expect(handler).toBeCalledTimes(1);
  });

  test('should show text on document3', async () => {
    const handler = jest.fn();
    Toast({
      msg: 'msg2',
      theme: 'dark',
    });
    expect(screen.queryByText('msg2')).toBeInTheDocument();
  });

  test('should show text on document3', async () => {
    const handler = jest.fn();
    Toast({
      theme: 'dark',
    });
    expect(screen.queryByText('msg2')).toBeInTheDocument();
  });

  test('should show text on document3', async () => {
    Toast({
      duration: 0,
    });
    expect(screen.queryByText('msg2')).toBeInTheDocument();
  });
});
