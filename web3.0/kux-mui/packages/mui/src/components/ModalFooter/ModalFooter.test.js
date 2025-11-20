import React from 'react';
import { createRender, fireEvent } from '../../../test/test-utils';
import ModalFooter from './index';

describe('ModalFooter', () => {
  const { render } = createRender();

  it('renders default buttons when no custom footer is provided', () => {
    const { getByText } = render(<ModalFooter />);
    expect(getByText('Cancel')).toBeInTheDocument();
    expect(getByText('Ok')).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = jest.fn();
    const { getByText } = render(<ModalFooter onCancel={onCancel} />);
    fireEvent.click(getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('calls onOk when ok button is clicked', () => {
    const onOk = jest.fn();
    const { getByText } = render(<ModalFooter onOk={onOk} />);
    fireEvent.click(getByText('Ok'));
    expect(onOk).toHaveBeenCalled();
  });

  it('disables buttons when okLoading is true', () => {
    const { getByText } = render(<ModalFooter okLoading />);
    expect(getByText('Cancel')).toBeDisabled();
    expect(getByText('Ok')).toBeDisabled();
  });

  it('passes custom props to cancel and ok buttons', () => {
    const cancelButtonProps = { 'data-testid': 'cancel-button' };
    const okButtonProps = { 'data-testid': 'ok-button' };
    const { getByTestId } = render(<ModalFooter cancelButtonProps={cancelButtonProps} okButtonProps={okButtonProps} />);
    expect(getByTestId('cancel-button')).toBeInTheDocument();
    expect(getByTestId('ok-button')).toBeInTheDocument();
  });
});