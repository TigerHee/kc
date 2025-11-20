/*
  * owner: borden@kupotech.com
 */
import React from 'react';
import { _t, _tHTML } from 'src/utils/lang';
import SvgComponent from '@/components/SvgComponent';
import LabelWithLeverage from '../../common/LabelWithLeverage';
import useStateAndLogic, { showActivity } from './useStateAndLogic';
import { Container, Label } from './style';

const FuturesTab = React.memo(() => {
  const {
    showUrl,
    onClick,
    iconProps,
    kumexOpenFlag,
  } = useStateAndLogic();
  return (
    <Container
      href={showUrl}
      target="_blank"
      onClick={onClick}
      rel="noopener noreferrer"
    >
      <Label>{_t('tradeType.kumex')}</Label>
      {showActivity ? (
        <SvgComponent {...iconProps} />
      ) : kumexOpenFlag ? (
        <LabelWithLeverage leverage={100} />
      ) : (
        <SvgComponent {...iconProps} />
      )}
    </Container>
  );
});

export default FuturesTab;
