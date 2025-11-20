/*
 * Owner: jesse.shao@kupotech.com
 */
// main.test.js
import NpsTextArea from 'src/components/$/Nps/components/Question/NpsTextArea.js';

import React from 'react';
import { render, fireEvent } from '@testing-library/react';

describe('NpsTextArea', () => {
  test('renders with default props', () => {
    const { getByRole, getByText } = render(<NpsTextArea />);
    const textarea = getByRole('textbox');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('maxLength', '200');
    const foot = getByText('0/200');
    expect(foot).toBeInTheDocument();
  });

  test('calls onChange callback when value changes', () => {
    const onChangeMock = jest.fn();
    const { getByRole } = render(<NpsTextArea onChange={onChangeMock} />);
    const textarea = getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Hello, world!' } });
    expect(onChangeMock).toHaveBeenCalledWith('Hello, world!');
  });
});

// Note: This is just an example of what the unit tests could look like
// and is not necessarily a comprehensive test suite. Additional tests may be needed.
