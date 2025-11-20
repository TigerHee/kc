/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';

import { Carousel } from '@kux/mui';
import { LeftMultiOutlined, RightMultiOutlined } from '@kux/icons';

import Wrapper from './wrapper';

const style = {
  background: 'rgba(0,0,0, 0.4)',
  color: '#fff',
  height: '300px',
  margin: 0,
};

class SimpleSlider extends React.Component {
  render() {
    const settings = {
      rtl: true,
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: <RightMultiOutlined size="24" />,
      prevArrow: <LeftMultiOutlined size="24" />,
      appendDots: (dots) => {
        return <div>{dots}</div>;
      },
      customPaging: (i) => {
        return <span key={i}>{i}</span>;
      },
      // vertical: true,
      // autoplay: true,
    };
    return (
      <div>
        <h2> Single Item</h2>
        <Carousel {...settings}>
          <div>
            <h3 style={style}>1</h3>
          </div>
          <div>
            <h3 style={style}>2</h3>
          </div>
          <div>
            <h3 style={style}>3</h3>
          </div>
          <div>
            <h3 style={style}>4</h3>
          </div>
          <div>
            <h3 style={style}>5</h3>
          </div>
          <div>
            <h3 style={style}>6</h3>
          </div>
        </Carousel>
      </div>
    );
  }
}

export default () => {
  return (
    <Wrapper>
      <SimpleSlider />
    </Wrapper>
  );
};
