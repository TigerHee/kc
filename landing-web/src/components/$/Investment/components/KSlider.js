/**
 * Owner: odan.ou@kupotech.com
 */
import React, { memo, useMemo } from 'react';
import Slider, { Settings } from 'react-slick';
import { map } from 'lodash';
import { ArrowRightOutlined } from '@kufox/icons';
import styles from './styles.less';

/**
 * Next
 * @param {{
 *  onClick(): void
 * }} props
 */
const Next = (props) => {
  return (
    <ArrowRightOutlined
      className={`${styles.nextArrow} k-next-arrow k-arrow-icon`}
      iconId="arrowright"
      onClick={() => {
        props.onClick();
      }}
    />
  );
};

/**
 * Prev
 * @param {{
 *  onClick(): void
 * }} props
 */
const Prev = (props) => {
  return (
    <ArrowRightOutlined
      className={`${styles.prevArrow} k-next-arrow k-arrow-icon`}
      iconId="arrowright"
      onClick={() => {
        props.onClick();
      }}
    />
  );
};

const DefaultSettings = {
  infinite: true,
  speed: 500,
  slidesToScroll: 1,
  prevArrow: <Prev />,
  nextArrow: <Next />,
};

/**
 * Slider
 * @template T
 * @param {{
 *  data: T[],
 *  render(item: T): React.ReactNode,
 *  slidesToShow?: number,
 *  settings?: Omit<Settings, 'slidesToShow'>,
 * }} props
 */
const KSlider = (props) => {
  const { slidesToShow, settings: settingsProp, data, render } = props;
  const settings = useMemo(() => {
    return {
      ...DefaultSettings,
      ...settingsProp,
      slidesToShow,
    };
  }, [slidesToShow, settingsProp]);
  return <Slider {...settings}>{map(data, render)}</Slider>;
};

export default memo(KSlider);
