import React from 'react';
import {fireEvent, screen} from '@testing-library/react-native';

import Button from 'components/Common/Button';
import {customRender as render} from '../../setup';

describe('Button', () => {
  test('renders text', () => {
    const res = render(<Button>Test</Button>);
    expect(res.toJSON()).toMatchSnapshot();
    const button = screen.getByText('Test');
    expect(button).toHaveTextContent('Test');
  });

  test('renders text and style correctly', () => {
    render(<Button>Test</Button>);
    const button = screen.getByText('Test');
    expect(button).toHaveStyle({
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    });
  });
  test('responds to onPress event', () => {
    const mockFn = jest.fn();
    render(
      <Button size="large" type="secondary" onPress={mockFn}>
        Test
      </Button>,
    );
    const button = screen.getByText('Test');
    fireEvent.press(button);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test('does not respond to onPress event when disabled', () => {
    const mockFn = jest.fn();
    render(
      <Button size="small" onPress={mockFn} disabled={true}>
        Test
      </Button>,
    );
    const button = screen.getByText('Test');
    expect(button).toBeDisabled();
    fireEvent.press(button);
    expect(mockFn).not.toHaveBeenCalled();
  });
});
