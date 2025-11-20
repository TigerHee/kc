/*
 * Owner: tom@kupotech.com
 */
import React from 'react';
import { render } from '@testing-library/react';
import CommonText from 'components/$/LeGo/components/CommonText';

jest.mock('dva', () => {
  return {
    __esModule: true,
    default: null,
    useSelector: jest.fn(() => ({
      translate: {
        title: 'This is a title',
        body: 'This is the first line.\nThis is the second line.\nThis is the third line.',
      },
    })),
  };
});

describe('CommonText Component', () => {
  test('renders title and content correctly', () => {
    const content = {
      title: 'title',
      text: 'body',
    };

    const { getByText } = render(<CommonText content={content} />);

    const titleElement = getByText(/This is a title/i);
    const contentElement1 = getByText(/This is the first line./i);
    const contentElement2 = getByText(/This is the second line./i);
    const contentElement3 = getByText(/This is the third line./i);

    expect(titleElement).toBeInTheDocument();
    expect(contentElement1).toBeInTheDocument();
    expect(contentElement2).toBeInTheDocument();
    expect(contentElement3).toBeInTheDocument();
  });
});
