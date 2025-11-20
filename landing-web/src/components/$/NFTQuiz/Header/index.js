/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useMemo } from 'react';
import { useIsMobile } from 'components/Responsive';
import { _t, _tHTML } from 'src/utils/lang';

import AnniversaryHeader from 'src/components/AnniversaryHeader';
import ArrowBackSvg from 'assets/NFTQuiz/back.svg';
import SHARESVG from 'assets/NFTQuiz/share.svg';
import LANG_CHECKED from 'assets/NFTQuiz/lang_icon.svg';
import {
  HeaderWrapper,
  Share,
} from './styled';
import { useQuizContext } from '../context';

const Header = (props) => {
  const { isFix, ...reset } = props || {};
  const isMobile = useIsMobile();
  const { openShare } = useQuizContext();
  const customRightOpt = useMemo(
    () => {
      return (
        <Share src={SHARESVG} alt="SHARESVG"  onClick={openShare} />
      );
    },
    [openShare],
  );

  return (
    <HeaderWrapper isFix={isFix} mobile={isMobile}>
      <AnniversaryHeader
        showRightBox
        logoUrl={ArrowBackSvg}
        logoStyle={{ width: '24px', height: '24px' }}
        showCheckedImg
        checkedImgUrl={LANG_CHECKED}
        blockId="Login"
        customRightOpt={customRightOpt}
        noUserInfo
        darkLang
        {...reset}
      />
    </HeaderWrapper>
  );
};

export default Header;