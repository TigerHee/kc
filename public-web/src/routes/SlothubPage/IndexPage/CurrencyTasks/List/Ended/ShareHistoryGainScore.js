/*
 * Owner: harry.lai@kupotech.com
 * @Date: 2024-06-25 00:21:19
 * @LastEditors: harry.lai harry.lai@kupotech.com
 * @LastEditTime: 2024-06-25 01:51:17
 */
import styled from '@emotion/styled';
import { ICShareOutlined } from '@kux/icons';
import { useColor, useResponsive } from '@kux/mui/hooks';
import { memo, useCallback } from 'react';
import useRequest from 'src/hooks/useRequest';
import { useSelector } from 'src/hooks/useSelector';
import { SlotHubShareScene } from 'src/routes/SlothubPage/components/Share/constant';
import { useOpenSlothubShare } from 'src/routes/SlothubPage/components/Share/useOpenSlothubShare';
import { getMyRewardRecord } from 'src/services/slothub';
import { _t } from 'src/tools/i18n';

const ShareBox = styled.div`
  color: #01bc8d;
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 130%;
  cursor: pointer;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 12px;
  }
`;

const ShareHistoryGainScore = (props) => {
  const { isCheckedJoin } = props;
  const isLogin = useSelector((state) => state.user.isLogin);
  const colors = useColor();
  const { sm } = useResponsive();
  const { open } = useOpenSlothubShare();
  const { data } = useRequest(getMyRewardRecord);
  const { joinCount, items: prizeList } = data?.data || {};

  const openShare = useCallback(() => {
    open(SlotHubShareScene.recordHistory, { prizeList, joinCount });
  }, [open, prizeList, joinCount]);

  if ([isLogin, isCheckedJoin, prizeList?.length].some((i) => !i)) {
    return null;
  }

  return (
    <ShareBox onClick={openShare}>
      <ICShareOutlined color={colors.primary} size={sm ? 16 : 12} className="mr-4" />
      {_t('2c5d5a2f58084000a463')}
    </ShareBox>
  );
};

export default memo(ShareHistoryGainScore);
