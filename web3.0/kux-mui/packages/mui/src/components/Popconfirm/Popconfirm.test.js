/**
 * Owner: victor.ren@kupotech.com
 */
import React, { useState } from 'react';
import { InfoOutlined } from '@kux/icons';
import { createRender, fireEvent } from '../../../test/test-utils';
import Popconfirm from './index';

describe('Popconfirm', () => {
  const { render } = createRender();

  const Child = ({ title = 'Are you sure to delete this task?', ...rest }) => (
    <Popconfirm title={title} placement="top" {...rest}>
      <button data-testid="button">click</button>
    </Popconfirm>
  );

  it('should render children', () => {
    const { getByTestId } = render(<Child />);
    expect(document.body.childNodes.length).toBe(1);
    fireEvent.click(getByTestId('button'));
    expect(document.body.childNodes.length).toBe(2);
    expect(document.body.lastChild.firstChild.classList.contains('KuxPopconfirm-root'));
  });

  it('should render correct', () => {
    const { getByTestId } = render(<Child />);
    fireEvent.click(getByTestId('button'));
    const body = document.body;
    expect(body.lastChild.firstChild.firstChild.classList.contains('KuxPopconfirm-content')).toBe(
      true,
    );
    expect(
      body.lastChild.firstChild.firstChild.firstChild.firstChild.classList.contains(
        'KuxPopconfirm-icon',
      ),
    ).toBe(true);
    expect(body.lastChild.firstChild.firstChild.firstChild.firstChild.firstChild.nodeName).toBe(
      'svg',
    );
    expect(
      body.lastChild.firstChild.firstChild.firstChild.lastChild.classList.contains(
        'KuxPopconfirm-title',
      ),
    ).toBe(true);
    expect(body.lastChild.firstChild.firstChild.firstChild.lastChild.textContent).toBe(
      'Are you sure to delete this task?',
    );
    expect(
      body.lastChild.firstChild.firstChild.lastChild.classList.contains('KuxPopconfirm-buttons'),
    ).toBe(true);
    expect(body.lastChild.firstChild.firstChild.lastChild.childNodes.length).toBe(2);
    expect(body.lastChild.firstChild.firstChild.lastChild.firstChild.nodeName).toBe('BUTTON');
    expect(body.lastChild.firstChild.firstChild.lastChild.firstChild.textContent).toBe('no');
    expect(body.lastChild.firstChild.lastChild.classList.contains('KuxPopconfirm-arrow')).toBe(
      true,
    );
  });

  it('should render correct title', () => {
    const { getByTestId } = render(<Child title="This is test title." />);
    fireEvent.click(getByTestId('button'));
    const body = document.body;
    expect(body.lastChild.firstChild.firstChild.firstChild.lastChild.textContent).toBe(
      'This is test title.',
    );
  });

  it('should render correct button text', () => {
    const { getByTestId } = render(<Child cancelText="取消" okText="确认" />);
    fireEvent.click(getByTestId('button'));
    const body = document.body;
    expect(body.lastChild.firstChild.firstChild.lastChild.firstChild.textContent).toBe('取消');
    expect(body.lastChild.firstChild.firstChild.lastChild.lastChild.textContent).toBe('确认');
  });

  it('should show correct icon', () => {
    const { getByTestId } = render(<Child showIcon={false} />);
    fireEvent.click(getByTestId('button'));
    const body = document.body;
    expect(body.lastChild.firstChild.firstChild.firstChild.childNodes.length).toBe(1);
    expect(body.lastChild.firstChild.firstChild.firstChild.firstChild.textContent).toBe(
      'Are you sure to delete this task?',
    );
  });

  it('should render custom icon', () => {
    const { getByTestId } = render(<Child icon={<InfoOutlined />} />);
    fireEvent.click(getByTestId('button'));
    const body = document.body;
    expect(body.lastChild.firstChild.firstChild.firstChild.childNodes.length).toBe(2);
    expect(body.lastChild.firstChild.firstChild.firstChild.firstChild.firstChild.nodeName).toBe(
      'svg',
    );
    expect(
      body.lastChild.firstChild.firstChild.firstChild.firstChild.firstChild.classList.contains(
        'info_svg__icon',
      ),
    ).toBe(true);
  });

  it('should show correct arrow', () => {
    const { getByTestId } = render(<Child arrow={false} />);
    fireEvent.click(getByTestId('button'));
    const body = document.body;
    expect(body.lastChild.firstChild.childNodes.length).toBe(1);
  });

  it('should render with placement bottom', () => {
    const { getByTestId } = render(<Child placement="bottom" />);
    fireEvent.click(getByTestId('button'));
    const body = document.body;
    expect(body.lastChild.style.transform).toBe('translate(0px, 10px)');
  });

  it('should render with placement left', () => {
    const { getByTestId } = render(<Child placement="left" />);
    fireEvent.click(getByTestId('button'));
    const body = document.body;
    expect(body.lastChild.style.transform).toBe('translate(-10px, 0px)');
  });

  it('should render with placement top', () => {
    const { getByTestId } = render(<Child placement="top" />);
    fireEvent.click(getByTestId('button'));
    const body = document.body;
    expect(body.lastChild.style.transform).toBe('translate(0px, -10px)');
  });

  it('should render with placement right', () => {
    const { getByTestId } = render(<Child placement="right" />);
    fireEvent.click(getByTestId('button'));
    const body = document.body;
    expect(body.lastChild.style.transform).toBe('translate(10px, 0px)');
  });

  it('should render with correct callback', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    const { getByTestId } = render(<Child onConfirm={onConfirm} onCancel={onCancel} />);
    fireEvent.click(getByTestId('button'));
    const body = document.body;
    fireEvent.click(body.lastChild.firstChild.firstChild.lastChild.firstChild);
    expect(onCancel).toHaveBeenCalledTimes(1);
    fireEvent.click(body.lastChild.firstChild.firstChild.lastChild.lastChild);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
