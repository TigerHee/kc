/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useMemo } from 'react';
import AnimateNumber from 'components/AnimateNumber';
import { separateNumber, getUtcZeroTime } from 'helper';
import { _t } from 'utils/lang';
import { NFT_QUIZ_STATUS } from 'config';
import nftLogo from 'assets/NFTQuiz/nft_logo.png';
import logoSrc from 'assets/NFTQuiz/main-title-logo.png';
import {
  Maker,
  Logo,
  Name,
  TitleLine,
  TitleContent,
  TitleLogo,
  Desc,
  Wrapper,
} from './styled';
import styles from '../style.less';

const name = `Fracton & ${window._BRAND_NAME_}`;

const getDesc = (activityStatus, { start, signUpNum }) => {
  if (activityStatus === NFT_QUIZ_STATUS.NOT_BEGIN) {
    const date = `${getUtcZeroTime(start)} (UTC)`;
    return `${_t('aRbZX6dbLcBiRpwjzFX78a', { Data: date })}`;
  }
  if ([
    NFT_QUIZ_STATUS.CURRENT,
    NFT_QUIZ_STATUS.EXPIRED,
  ].includes(activityStatus)) {
    const langKey = '_RegisteredUser_';
    const txt = _t('iCDrFxAfqFCEYrzCncvCCZ', { RegisteredUser: langKey });
    const startIndex = txt.indexOf(langKey);
    const animateContent = (
      <AnimateNumber
        value={signUpNum}
        formatValue={(n) => {
          return `${separateNumber(n)}`;
        }}
        duration={1000}
        stepPrecision={0}
        className='light'
      />
    );
    if (startIndex === -1) {
      return (
        <>
          {animateContent}
          people have participated
        </>
      );
    }
    const prefix = txt.substring(0, startIndex);
    const suffix = txt.substring(startIndex + langKey.length);
    return (
      <>
        {prefix}
        {animateContent}
        {suffix}
      </>
    )
  }
};

const Info = ({
  config = {},
} = {}) => {
  const {
    activityStatus, // 活动状态
    start, // 活动开始时间-timestamp
    answer,
  } = config || {};
  const {
    signUpNum, // 活动总参与人数
  } = answer || {};

  const desc = useMemo(() => {
    return getDesc(activityStatus, { start, signUpNum });
  }, [activityStatus, start, signUpNum]);

  return (
    <>
      <Maker>
        <Logo src={nftLogo} />
        <Name>{name}</Name>
      </Maker>
      <Wrapper>
        <TitleLine>
          <TitleContent>
            <p>{_t('hLoUBrMagAkVBCfbvoqMad')}</p>
            <p>{_t('1foFgDS5xG3q71cdb8cPFW')}</p>
          </TitleContent>
          <TitleLogo src={logoSrc} className={styles.logo_amin} />
        </TitleLine>
          <Desc>
            {desc}
          </Desc>
      </Wrapper>
    </>
  );
};

export default Info;