/*
  * owner: borden@kupotech.com
 */
import React from 'react';
import styled from '@emotion/styled';
import Dialog from '@mui/Dialog';
import { _t, _tHTML } from 'utils/lang';

import deleteWarning_light from '@/assets/layoutSetting/delete-warning-light.png';

/** 样式开始 */
const ImgBox = styled.div`
  padding: 48px 0 16px;
  text-align: center;
`;
const WarnText = styled.div`
  font-weight: 700;
  font-size: 28px;
  line-height: 130%;
  text-align: center;
  color: ${props => props.theme.colors.text};
`;
/** 样式结束 */

const ConfirmModal = React.memo((props) => {
  return (
    <Dialog
      header={null}
      okText={_t('confirm')}
      cancelText={_t('cancel')}
      {...props}
    >
      <ImgBox>
        <img width={140} height={140} src={deleteWarning_light} alt="" />
      </ImgBox>
      <WarnText>{_t('2DHt3DtjvDRDxX1aE7cqWW')}</WarnText>
    </Dialog>
  );
});

export default ConfirmModal;
