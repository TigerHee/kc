/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { screen } from '@testing-library/react';
import { createRender, fireEvent, act } from '../../../test/test-utils';
import MDialog from './index';

describe('MDialog', () => {
  const { render, clock } = createRender();

  test('renders MDialog with children', () => {
    render(<MDialog show>Test content</MDialog>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  test('MDialog is hidden when show prop is false', () => {
    const { container } = render(<MDialog show={false}>Test content</MDialog>);
    expect(container.querySelector('.KuxMDrawer-root')).not.toBeInTheDocument();
  });

  test('MDialog calls onClose when clicking on the mask', () => {
    const onClose = jest.fn();
    render(<MDialog show onClose={onClose} maskClosable>Test content</MDialog>);
    fireEvent.click(document.querySelector('.KuxDrawer-mask'));
    act(() => {
      clock.tick(400);
    })
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('MDialog does not call onClose when maskClosable is false', () => {
    const onClose = jest.fn();
    render(<MDialog show onClose={onClose} maskClosable={false}>Test content</MDialog>);
    fireEvent.click(document.querySelector('.KuxDrawer-mask'));
    act(() => {
      clock.tick(400);
    })
    expect(onClose).toHaveBeenCalledTimes(0);
  });

  test('MDialog calls onOk when clicking on the ok button', () => {
    const onOk = jest.fn();
    render(<MDialog show onOk={onOk}>Test content</MDialog>);
    fireEvent.click(screen.getByText('Ok'));
    act(() => {
      clock.tick(400);
    })
    expect(onOk).toHaveBeenCalledTimes(1);
  });

  test('MDialog calls onCancel when clicking on the cancel button', () => {
    const onCancel = jest.fn();
    render(<MDialog show onCancel={onCancel}>Test content</MDialog>);
    fireEvent.click(screen.getByText('Cancel'));
    act(() => {
      clock.tick(400);
    })
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('MDialog calls onBack when clicking on the back button', () => {
    const onBack = jest.fn();
    render(<MDialog show back onBack={onBack}>Test content</MDialog>);
    fireEvent.click(document.querySelector('.KuxModalHeader-back'));
    act(() => {
      clock.tick(400);
    })
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('renders MDrawer with custom title', () => {
    render(<MDialog show title="Custom Title" onClose={() => { }}> Test Content </MDialog>);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });
});