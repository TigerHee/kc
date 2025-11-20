
import React from 'react';
import '@testing-library/jest-dom';
import { renderWithTheme } from '_tests_/test-setup';
import MuiButton, { ButtonWeight } from 'src/trade4.0/components/mui/Button.js';

describe('ButtonWeight', () => {
  it('renders ButtonWeight with default props', () => {
    const { wrapper: { container } } = renderWithTheme(<ButtonWeight>Test ButtonWeight</ButtonWeight>);
    expect(container).toHaveTextContent('Test ButtonWeight');
    expect(container.querySelector('button')).toHaveClass('KuxButton-sizeMini');
    expect(container.querySelector('button')).toHaveStyle('font-weight: 400');
  });

  it('renders ButtonWeight with custom props', () => {
    const { wrapper: { container } } = renderWithTheme(
      <ButtonWeight fontWeight={700} size="large">Test ButtonWeight</ButtonWeight>,
    );
    expect(container.querySelector('button')).toHaveClass('KuxButton-sizeLarge');
    expect(container.querySelector('button')).toHaveStyle('font-weight: 700');
  });
});

describe('MuiButton', () => {
  it('renders MuiButton with children', () => {
    const { wrapper: { container } } = renderWithTheme(<MuiButton>Test MuiButton</MuiButton>);
    expect(container.querySelector('button')).toHaveTextContent('Test MuiButton');
  });

  it('renders MuiButton with custom type', () => {
    const { wrapper: { container } } = renderWithTheme(<MuiButton type="brandGreen">Test MuiButton</MuiButton>);
    expect(container.querySelector('button')).toHaveStyle('color: #FFFFFF; background: #01BC8D');
  });

  it('renders MuiButton with custom type2', () => {
    const { wrapper: { container } } = renderWithTheme(<MuiButton type="brandGreen" variant="outlined">Test MuiButton</MuiButton>);
    expect(container.querySelector('button')).toHaveStyle('color: #1D1D1D; background: rgba(29, 29, 29, 0.08)');
  });
});