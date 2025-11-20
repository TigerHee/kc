/*
 * @Owner: jesse.shao@kupotech.com
 */
// import ScrollWrapper from '@kp-toc/anti-duplication';
import ScrollWrapper from 'components/common/ScrollWrapper';
import React, { useState } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';

jest.mock('dva', () => {
  return {
    __esModule: true,
    default: null,
    useSelector: jest.fn(() => ({
      app: {
        appVersion: '13.4',
      },
    })),
  };
});

describe('test ScrollWrapper', () => {
  test('renders ScrollWrapper component', () => {
    render(
      <ScrollWrapper categories={{}} numberBoxClassName="numberBoxClassName" className="className">
        <div className={'wqw'}>1234</div>
      </ScrollWrapper>,
    );

    expect(screen.queryByText('1234')).toBeInTheDocument();
  });

  test('renders ScrollWrapper component', () => {
    render(
      <ScrollWrapper
        categories={{}}
        numberBoxClassName="numberBoxClassName"
        className="className"
        // eslint-disable-next-line
        children={() => {}}
      />,
    );

    expect(screen.queryByText('1234')).toBeNull();
  });
});
