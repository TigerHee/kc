/*
 * Owner: terry@kupotech.com
 */
import React from 'react';
import JumpImg from "src/components/img/JumpImg";
import { render, screen, fireEvent } from '@testing-library/react';

describe('JumpImg', () => {
  const _open = jest.fn();
  const __open = (...args) => {
    _open(...args);
    return {opener: null};
  }
  beforeEach(() => {
    Object.defineProperty(window, 'open', {
      value: __open
    })
  })
  afterEach(() => {
    jest.resetAllMocks();
  })

  it('should render success', () => {
    const {baseElement} = render(
      <JumpImg
        link="https://www.kucoin.com"
        imgUrl="https://assets.staticimg.com/cms/media/6iM2B0zaI27FJy5w7KAzJLrdxnzcsAihb23HwKvyQ.png?d=564x322"
        className='test-img'
      />
    )
    expect(baseElement.querySelector('.test-img')).toBeInTheDocument();
  })

  it('should click success', () => {
    const _link = "https://www.kucoin.com";
    const {baseElement} = render(
      <JumpImg
        link={_link}
        imgUrl="https://assets.staticimg.com/cms/media/6iM2B0zaI27FJy5w7KAzJLrdxnzcsAihb23HwKvyQ.png?d=564x322"
        className='test-img'
      />
    )
    expect(baseElement.querySelector('.test-img')).toBeInTheDocument();
    fireEvent.click(baseElement.querySelector('.test-img'));
    expect(_open).toBeCalledWith(_link, '_blank');
  })
})
