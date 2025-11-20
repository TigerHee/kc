/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-07-18 12:11:04
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-10-24 22:18:38
 * @FilePath: /trade-web/_tests_/components/trade4.0/mui/Dialog.test.js
 * @Description: 
 */
import React from 'react';
import '@testing-library/jest-dom';
import { useResponsive } from '@kux/mui';
import { fireEvent } from '@testing-library/react';
import { renderWithTheme } from '_tests_/test-setup';
import MuiDialog from 'src/trade4.0/components/mui/Dialog.js';

jest.mock('@kux/mui', () => ({
  ...jest.requireActual('@kux/mui'),
  useResponsive: jest.fn(),
}));

describe('MuiDialog', () => {
  const onOkMock = jest.fn();
  const onCancelMock = jest.fn();
  it('renders MDialog with default props', () => {
    useResponsive.mockReturnValue({ sm: false });
    renderWithTheme(
      <MuiDialog size="xlarge" open header={null}>
        Test MDialog
      </MuiDialog>,
    );
    const wrapper = document.getElementsByClassName('KuxMDialog-root');
    const container = wrapper[wrapper.length - 1];
    expect(container).toHaveTextContent('Test MDialog');
    expect(container.querySelector('.KuxMDialog-content')).toHaveStyle('padding: 16px 16px');
  });

  it('renders MDialog with height', () => {
    useResponsive.mockReturnValue({ sm: false });
    renderWithTheme(
      <MuiDialog open header={null} height="90%">
        Test MDialog
      </MuiDialog>,
    );
    const wrapper = document.getElementsByClassName('KuxMDialog-root');
    const container = wrapper[wrapper.length - 1];
    expect(container).toHaveStyle('height: 90%');
  });

  it('renders MDialog with contentPadding', () => {
    useResponsive.mockReturnValue({ sm: false });
    renderWithTheme(
      <MuiDialog open header={null} contentPadding="20px 20px">
        Test MDialog
      </MuiDialog>,
    );
    const wrapper = document.getElementsByClassName('KuxMDialog-root');
    const container = wrapper[wrapper.length - 1];
    expect(container.querySelector('.KuxMDialog-content')).toHaveStyle('padding: 20px 20px');
  });

  it('renders MDialog with maskClosable', () => {
    useResponsive.mockReturnValue({ sm: false });
    renderWithTheme(
      <MuiDialog open maskClosable onCancel={onCancelMock} header={null}>
        Test Dialog
      </MuiDialog>,
    );
    fireEvent.click(document.querySelector('.KuxDrawer-mask'));
    expect(onCancelMock).toHaveBeenCalledTimes(0);
  });

  it('renders Dialog', () => {
    useResponsive.mockReturnValue({ sm: true });
    renderWithTheme(
      <MuiDialog open header={null}>
        Test Dialog
      </MuiDialog>,
    );
    const wrapper = document.getElementsByClassName('KuxDialog-root');
    const container = wrapper[wrapper.length - 1];
    expect(container).toHaveTextContent('Test Dialog');
  });

  it('renders Dialog with keyboard', () => {
    useResponsive.mockReturnValue({ sm: true });
    const { rerenderWithTheme } = renderWithTheme(
      <MuiDialog open keyboard size="xlarge" onCancel={onCancelMock} onOk={onOkMock} header={null}>
        Test Dialog
      </MuiDialog>,
    );
    const wrapper = document.getElementsByClassName('KuxDialog-root');
    const container = wrapper[wrapper.length - 1];
    fireEvent.keyDown(container, { key: 'Escape', code: 27 });
    expect(onCancelMock).toHaveBeenCalledTimes(0);
    fireEvent.keyDown(container, { key: 'Enter', code: 13 });
    expect(onOkMock).toHaveBeenCalledTimes(0);
    rerenderWithTheme(<></>);
  });
});
