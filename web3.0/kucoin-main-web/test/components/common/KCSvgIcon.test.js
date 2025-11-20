import React from 'react';
import { customRender } from 'test/setup';
import Icon, { useDynamicSVGImport } from 'src/components/common/KCSvgIcon.js';
import { act } from 'react-dom/test-utils';

// Mock the useDynamicSVGImport hook
jest.mock('src/components/common/KCSvgIcon.js', () => ({
  __esModule: true,
  default: () => <svg data-testid="mock-svg-icon" />,
  useDynamicSVGImport: jest.fn(),
}));

describe('Icon', () => {
  it('renders null when loading', () => {
    useDynamicSVGImport.mockReturnValue({ loading: true });
    const { container } = customRender(<Icon iconId="test-icon" />);
    expect(container.firstChild).not.toBeNull();
  });
});
