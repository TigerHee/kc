/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { screen } from '@testing-library/react';
import { createRender, fireEvent, act } from '../../../test/test-utils';
import Drawer from './index';

describe('Drawer', () => {
  const { render, clock } = createRender();

  it('renders children correctly', () => {
    const { getByText } = render(<Drawer show><div>Test Content</div></Drawer>);
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('handles onClose callback correctly', async (done) => {
    const onClose = jest.fn();
    render(
      <Drawer show onClose={onClose}>
        <div>Test Content</div>
      </Drawer>
    );
    const mask = document.querySelector('.KuxDrawer-mask');
    fireEvent.click(mask);
    act(() => {
      clock.tick(400);
    })
    expect(onClose).toHaveBeenCalledTimes(1);
    done();
  });

  it('renders with correct anchor', () => {
    render(
      <Drawer show anchor="bottom">
        <div>Test Content</div>
      </Drawer>
    );
    const drawerRoot = document.querySelector('.KuxDrawer-root');
    expect(drawerRoot).toHaveClass('KuxDrawer-anchorBottom');
  });

  it('renders custom header content when provided', () => {
    const customHeader = <div>Custom Header</div>;
    const { getByText } = render(<Drawer show header={customHeader}>Test Content</Drawer>);
    expect(getByText('Custom Header')).toBeInTheDocument();
  });

  it('handles onBack event', () => {
    const onBackMock = jest.fn();
    render(
      <Drawer show back onBack={onBackMock} onClose={() => { }}> Test Content </Drawer>
    );
    fireEvent.click(document.querySelector('.KuxModalHeader-back'));
    expect(onBackMock).toHaveBeenCalledTimes(1);
  });

  it('renders Drawer with custom title', () => {
    render(<Drawer show title="Custom Title" onClose={() => { }}> Test Content </Drawer>);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('renders Drawer without back button', () => {
    render(<Drawer show back={false} onClose={() => { }}> Test Content </Drawer>);
    expect(document.querySelector('.KuxModalHeader-back')).not.toBeInTheDocument();
  });
});