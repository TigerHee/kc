import Dialog from './index';
import React from 'react';
import { createRender, fireEvent } from '../../../test/test-utils';

describe('Dialog', () => {
  const { render } = createRender();

  it('renders custom footer content when provided', () => {
    const customFooter = <div>Custom Footer</div>;
    const { getByText } = render(<Dialog open footer={customFooter}>Test Content</Dialog>);
    expect(getByText('Custom Footer')).toBeInTheDocument();
  });

  it('renders custom header content when provided', () => {
    const customHeader = <div>Custom Header</div>;
    const { getByText } = render(<Dialog open header={customHeader}>Test Content</Dialog>);
    expect(getByText('Custom Header')).toBeInTheDocument();
  });

  it('renders the title and content', () => {
    const { getByText } = render(
      <Dialog open title="Test Title">
        Test Content
      </Dialog>
    );
    expect(getByText('Test Title')).toBeInTheDocument();
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('handles onCancel and onOk callbacks', () => {
    const onCancel = jest.fn();
    const onOk = jest.fn();
    const { getByText } = render(
      <Dialog open onCancel={onCancel} onOk={onOk}>
        Test Content
      </Dialog>
    );

    fireEvent.click(getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);
    fireEvent.click(getByText('Ok'));
    expect(onOk).toHaveBeenCalledTimes(1);
  });

  it('renders custom footer', () => {
    const { getByText } = render(
      <Dialog open footer={<div>Custom Footer</div>}>
        Test Content
      </Dialog>
    );
    expect(getByText('Custom Footer')).toBeInTheDocument();
  });

  it('closes the dialog when mask is clicked and maskClosable is true', () => {
    const onCancel = jest.fn();
    render(
      <Dialog open maskClosable onCancel={onCancel}>
        Test Content
      </Dialog>
    );
    fireEvent.click(document.getElementsByClassName('KuxDialog-mask')[0]);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('does not close the dialog when mask is clicked and maskClosable is false', () => {
    const onCancel = jest.fn();
    render(
      <Dialog open maskClosable={false} onCancel={onCancel}>
        Test Content
      </Dialog>
    );
    fireEvent.click(document.getElementsByClassName('KuxDialog-mask')[0]);
    expect(onCancel).toHaveBeenCalledTimes(0);
  });
});