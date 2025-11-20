import React from 'react';
import { createRender, fireEvent } from '../../../test/test-utils';
import ModalHeader from './index';

describe('ModalHeader', () => {
  const { render } = createRender();

  it('renders the title correctly', () => {
    const { getByText } = render(<ModalHeader title="Test Title" />);
    expect(getByText('Test Title')).toBeInTheDocument();
  });

  it('renders the back button when back prop is true', () => {
    const onBack = jest.fn();
    render(<ModalHeader back onBack={onBack} />);
    const backButton = document.getElementsByClassName('KuxModalHeader-back')[0];
    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton);
    expect(onBack).toHaveBeenCalled();
  });

  it('renders the close button when close prop is true', () => {
    const onClose = jest.fn();
    render(<ModalHeader close onClose={onClose} />);
    const closeButton = document.getElementsByClassName('KuxModalHeader-close')[0];
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });

  it('does not render the back button when back prop is false', () => {
    render(<ModalHeader back={false} />);
    const backButton = document.getElementsByClassName('KuxModalHeader-back')[0];
    expect(backButton).toBe(undefined);
  });

  it('does not render the close button when close prop is false', () => {
    render(<ModalHeader close={false} />);
    const closeButton = document.getElementsByClassName('KuxModalHeader-close')[0];
    expect(closeButton).toBe(undefined);
  });

  it('does not call onClose and onBack when disableClose prop is true', () => {
    const onClose = jest.fn();
    const onBack = jest.fn();
    render(<ModalHeader back close disableClose onClose={onClose} onBack={onBack} />);
    const backButton = document.getElementsByClassName('KuxModalHeader-back')[0];
    const closeButton = document.getElementsByClassName('KuxModalHeader-close')[0];
    fireEvent.click(backButton);
    fireEvent.click(closeButton);
    expect(onBack).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });
});