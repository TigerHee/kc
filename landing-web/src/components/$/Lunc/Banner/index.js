/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { useSelector } from 'dva';
import { _t } from 'src/utils/lang';
import { Index, Slogan, Title, SubTitle } from './StyledComps';

const Banner = () => {
  const { isInApp } = useSelector(state => state.app);

  return (
    <Index isInApp={isInApp}>
      <Slogan>
        <Title>{_t('miR5tNdnUqpfXkvYXsvgfe')}</Title>
        <SubTitle>{_t('mxD9wmLaMv9dKfFH8DB6dT')}</SubTitle>
      </Slogan>
    </Index>
  );
};

export default Banner;
