/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-05 01:34:17
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-05 11:48:52
 */
import { css } from '@emotion/css';
import { px2rem } from '@kux/mui/utils';
import { _t } from 'src/tools/i18n';
import { MiddleTip } from './MiddleTip';
import { AirdropTitle, ContentWrap, RewardAndTipSubtitle, RewardGreenContentText } from './styled';

const AirdropTipContent = () => {
  return (
    <ContentWrap>
      <AirdropTitle>{_t(`afb0a20371e74000aefa`)}</AirdropTitle>
      <RewardAndTipSubtitle>{_t(`e1eef0560eec4000acfd`)}</RewardAndTipSubtitle>

      <RewardGreenContentText>{_t(`f07736abaf554000a58b`)}</RewardGreenContentText>

      <MiddleTip
        className={css`
          margin-top: ${px2rem(32)};
        `}
      />
    </ContentWrap>
  );
};

export default AirdropTipContent;
