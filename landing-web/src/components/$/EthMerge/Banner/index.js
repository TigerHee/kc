/**
 * Owner: jesse.shao@kupotech.com
 */
import React from 'react';
import { useSelector } from 'dva';
import { _t, _tHTML } from 'src/utils/lang';
import { Index, Slogan, Title, Dec, SubTitle } from './StyledComps';

const Banner = ({ btnClickCheck }) => {
  const { isInApp, currentLang } = useSelector(state => state.app);
  const showSubTitle = ['en_US'].includes(currentLang);

  return (
    <Index isInApp={isInApp}>
      <Slogan>
        <Title>{_t('bpPtxxfacZkieQaPEVgfiK')}</Title>
        <SubTitle>{_t('81vHANDcjizYoU6k5hpWdb')}</SubTitle>
        <Dec>
          <li>{_t('mxC5fgk2XuzMZP9uNBqnFH')}</li>
          <li>{_t('hRN99DWwcZh97dZgDxro4i')}</li>
        </Dec>
      </Slogan>
    </Index>
  );
};

export default Banner;
