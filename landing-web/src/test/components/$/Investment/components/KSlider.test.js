/*
 * Owner: terry@kupotech.com
 */
import React from 'react';
import KSlider from 'components/$/Investment/components/KSlider';
import { render, screen,fireEvent } from '@testing-library/react';


jest.mock('react-slick', () => {
  return {
    __esModule: true,
    default: ({
      children,
      prevArrow,
      nextArrow,
    }) => {
      return (
        <div>
          {prevArrow}
          <div>
            {children}
          </div>
          {nextArrow}
        </div>
      )
    },
    Settings: {},
  }
})

describe('KSlider', () => {

  it('should render success', () => {
    render(
      <KSlider
        data={[
          1,
          2,
          3
        ]}
        render={data => {
          return (
            <div>
              Slide: {data}
            </div>
          )
        }}
      />
    )
    expect(screen.getByText('Slide: 1')).toBeInTheDocument();
    expect(screen.getByText('Slide: 2')).toBeInTheDocument();
    expect(screen.getByText('Slide: 3')).toBeInTheDocument();
  });

  it('switch next pre', () => {
    const {container} = render(
      <KSlider
        data={[
          1,
          2,
          3
        ]}
        render={data => {
          return (
            <div>
              Slide: {data}
            </div>
          )
        }}
      />
    )
    expect(screen.getByText('Slide: 1')).toBeInTheDocument();
    expect(screen.getByText('Slide: 2')).toBeInTheDocument();
    expect(screen.getByText('Slide: 3')).toBeInTheDocument();
    const nextBtn = container.querySelectorAll('.k-next-arrow.k-arrow-icon')[1];
    const preBtn = container.querySelectorAll('.k-next-arrow.k-arrow-icon')[0];
    expect(nextBtn).toBeInTheDocument();
    expect(preBtn).toBeInTheDocument();
  })
});