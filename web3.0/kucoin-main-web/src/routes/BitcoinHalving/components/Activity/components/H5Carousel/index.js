/**
 * Owner: ella@kupotech.com
 */
import { useRef, useState } from 'react';
import { Carousel } from '@kux/mui';
import moment from 'moment';
import { Dots, Point, Card, Box, CardTitle, Info } from './index.style';

export default ({ list }) => {
  const [current, setCurrent] = useState(0);
  const sliderRef = useRef();

  const settings = {
    ref: sliderRef,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: null,
    prevArrow: null,
    appendDots: (dots) => {
      return <div>{dots}</div>;
    },
    customPaging: (i) => {
      return <span key={i}>{i}</span>;
    },
    afterChange: (key) => {
      setCurrent(key);
    },
    autoplay: true,
  };

  return (
    <Box>
      <Carousel {...settings}>
        {list.map((item) => {
          return (
            <Card key={item.key}>
              <img src={item.img} alt="img" />
              <CardTitle>{item.title}</CardTitle>
              <Info>
                {moment(item.startTime).format('YYYY/MM/DD')} -{' '}
                {moment(item.endTime).format('YYYY/MM/DD')}
              </Info>
            </Card>
          );
        })}
      </Carousel>
      <Dots>
        {list.map((item, i) => (
          <Point
            key={item.key}
            active={current === i}
            onClick={() => sliderRef.current.slickGoTo(i)}
          />
        ))}
      </Dots>
    </Box>
  );
};
