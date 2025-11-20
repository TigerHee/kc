/**
 * Owner: ella@kupotech.com
 */
import React, { useCallback } from 'react';
import moment from 'moment';
import { useResponsive } from '@kux/mui';
import { _t } from 'tools/i18n';
import { ActivityConfig } from './config';
import Crad from './components/Crad';
import Swiper from './components/Swiper';
import H5Carousel from './components/H5Carousel';
import { SpacingChapter, Title } from '../Article/index.style';

const COUNT = 2;

const getActivity = (list) => {
  const now = moment();
  if (list && list.length) {
    return list.filter((item) => {
      const startTime = moment(item.startTime);
      const endTime = moment(item.endTime);
      if (startTime.isBefore(now) && endTime.isAfter(now)) {
        return true;
      }
    });
  }
  return null;
};

export default () => {
  const responsive = useResponsive();

  const list = getActivity(ActivityConfig);
  if (!list || (list && !list.length)) {
    return '';
  }

  const renderCarousel = useCallback(
    (list) => {
      if (!responsive.sm) {
        return <H5Carousel list={list} />;
      }
      return <Swiper list={list} />;
    },
    [responsive],
  );

  return (
    <SpacingChapter mt={120}>
      <Title>{_t('qXHFZ7bKYuRy4NEFqJJvfv')}</Title>
      {list.length >= COUNT ? renderCarousel(list) : <Crad data={list[0]} />}
    </SpacingChapter>
  );
};
