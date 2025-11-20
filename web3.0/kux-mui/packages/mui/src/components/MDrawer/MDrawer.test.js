/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { screen } from '@testing-library/react';
import { createRender, fireEvent } from '../../../test/test-utils';
import MDrawer from './index';

describe('MDrawer', () => {
  const { render } = createRender();

  it('renders MDrawer with default props', () => {
    render(
      <MDrawer show>Test Content</MDrawer>
    );
    expect(document.querySelector('.KuxMDrawer-root')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders MDrawer with custom anchor', () => {
    render(
      <MDrawer anchor="left" show> Test Content </MDrawer>
    );
    expect(document.querySelector('.KuxMDrawer-anchorLeft')).toBeInTheDocument();
  });

  it('handles onClose event', () => {
    const onCloseMock = jest.fn();
    render(<MDrawer show onClose={onCloseMock}>Test Content</MDrawer>);
    fireEvent.click(document.querySelector('.KuxModalHeader-close'));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('handles onBack event', () => {
    const onBackMock = jest.fn();
    render(
      <MDrawer show back onBack={onBackMock} onClose={() => { }}> Test Content </MDrawer>
    );
    fireEvent.click(document.querySelector('.KuxModalHeader-back'));
    expect(onBackMock).toHaveBeenCalledTimes(1);
  });

  it('renders MDrawer with custom title', () => {
    render(<MDrawer show title="Custom Title" onClose={() => { }}> Test Content </MDrawer>);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('renders MDrawer without back button', () => {
    render(<MDrawer show back={false} onClose={() => { }}> Test Content </MDrawer>);
    expect(document.querySelector('.KuxModalHeader-back')).not.toBeInTheDocument();
  });
});