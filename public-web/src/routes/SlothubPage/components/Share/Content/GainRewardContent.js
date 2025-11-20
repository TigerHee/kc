/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-05 01:34:17
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-26 20:04:08
 */
import { css } from '@emotion/css';
import { px2rem } from '@kux/mui/utils';
import { TASK_REWARD_POINT_COMMON_TYPE } from 'src/routes/SlothubPage/Portal/PrizeDialog/constant';
import { _t, _tHTML } from 'src/tools/i18n';
import { MiddleTip } from './MiddleTip';
import { ContentWrap, RewardAndTipSubtitle, RewardTitle } from './styled';

const GainRewardContent = ({ data }) => {
  const { totalPoints = 0, coin = 0 } = data || {};
  const isCommonToken = coin === TASK_REWARD_POINT_COMMON_TYPE;

  return (
    <ContentWrap>
      <RewardTitle>{_t('f1cab5baf4564000a5f4')}</RewardTitle>
      <RewardAndTipSubtitle>
        {/* <RewardGreenContentText> */}
        {isCommonToken
          ? _tHTML('dfaadd2afd694000a052', { x: totalPoints })
          : _tHTML('b2a2b47acef44000ae2c', { x: totalPoints, tok: coin })}
        {/* </RewardGreenContentText> */}
      </RewardAndTipSubtitle>
      <MiddleTip
        className={css`
          margin-top: ${px2rem(32)};
        `}
      />
    </ContentWrap>
  );
};

export default GainRewardContent;
