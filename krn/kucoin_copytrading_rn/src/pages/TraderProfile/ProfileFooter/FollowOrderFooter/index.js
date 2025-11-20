import {isEmpty} from 'lodash';
import React, {memo} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {css} from '@emotion/native';

import {TraderProfitBottomUserIcon} from 'components/Common/SvgIcon';
import {RowWrap} from 'constants/styles';
import {greaterThanOrEqualTo} from 'utils/operation';
import {useTraderCopyDurationAndProfitQuery} from '../../hooks/useTraderCopyDurationAndProfitQuery';
import {ProfileFooterArea} from '../components/styles';
import {ActionButton} from './ActionButton';
import AlreadyCopyBar from './AlreadyCopyBar';
import {
  AllCopyText,
  AlreadyCopyText,
  AlreadyLeftBox,
  BottomUserIconBox,
} from './index.styles';

/** 跟随订单底部区域： 已跟单展示跟单收益 未跟单展示 交易员跟单操作相关（跟单/暂停跟单）按钮 */
const FollowOrderFooter = ({summaryData}) => {
  const {allowCopyTraders, alreadyCopyTraders, leadStatus, status} =
    summaryData || {};

  const {
    data: profitResp,
    isSuccess,
    isFetching,
  } = useTraderCopyDurationAndProfitQuery();
  const {days, totalPnl, copying} = profitResp?.data || {};
  const isFull = greaterThanOrEqualTo(alreadyCopyTraders)(allowCopyTraders);

  const userInfo = useSelector(state => state.app.userInfo);

  if (isEmpty(summaryData) || !isSuccess || isFetching) {
    return null;
  }

  if (copying) {
    return (
      <ProfileFooterArea showBorder>
        <AlreadyCopyBar userInfo={userInfo} days={days} totalPnl={totalPnl} />
      </ProfileFooterArea>
    );
  }

  return (
    <ProfileFooterArea>
      <RowWrap>
        <AlreadyLeftBox>
          <BottomUserIconBox>
            <TraderProfitBottomUserIcon />
          </BottomUserIconBox>

          <RowWrap>
            <AlreadyCopyText>{alreadyCopyTraders}</AlreadyCopyText>
            <View
              style={css`
                margin: 0 2px;
              `}>
              <AllCopyText>{'/'}</AllCopyText>
            </View>
            <AllCopyText>{allowCopyTraders}</AllCopyText>
          </RowWrap>
        </AlreadyLeftBox>

        <ActionButton leadStatus={leadStatus} status={status} isFull={isFull} />
      </RowWrap>
    </ProfileFooterArea>
  );
};

export default memo(FollowOrderFooter);
