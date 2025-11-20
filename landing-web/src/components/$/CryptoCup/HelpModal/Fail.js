/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'dva';
import { styled } from '@kufox/mui/emotion';
import { get } from 'lodash';
import { _t } from 'utils/lang';
import CupCommonDialog from 'components/$/CryptoCup/common/CupCommonDialog';
import { HELP_FAIL_NAMES, HELP_FAIL_TEXT_CONFIG } from 'components/$/CryptoCup/config';

const Intro = styled.p`
  margin: 4px 0;
  font-size: 14px;
  line-height: 21px;
  color: ${props => props.theme.colors.text40};
`;

const FailModal = () => {
  const dispatch = useDispatch();
  const { helpModalName } = useSelector(state => state.cryptoCup);
  const NoticeTextFunc = get(HELP_FAIL_TEXT_CONFIG, helpModalName, () => null);
  // 三种失败情形共用一个弹窗
  const isOpen = HELP_FAIL_NAMES.indexOf(helpModalName) > -1;

  const handleClose = useCallback(
    () => {
      dispatch({
        type: 'cryptoCup/update',
        payload: {
          helpModalName: '',
        },
      });
    },
    [dispatch],
  );

  return (
    <CupCommonDialog
      open={isOpen}
      title={_t('69At58xgER5LsgA5Yv3V34')}
      okText={_t('j7L4pgXJ2axRhwXZnmUzK1')}
      onOk={handleClose}
      onCancel={handleClose}
    >
      <Intro>{NoticeTextFunc()}</Intro>
    </CupCommonDialog>
  );
};

export default FailModal;
