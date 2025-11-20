/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-01-03 15:41:45
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-04-23 19:40:34
 * @FilePath: /trade-web/src/trade4.0/pages/OrderForm/components/TradeForm/components/DoubleValidateDialog.js
 * @Description:
 */
import React, { memo } from 'react';

import Dialog from '@mui/Dialog';
import styled from '@emotion/styled';
import { _t, _tHTML } from 'utils/lang';
import { useTheme } from '@kux/mui/hooks';

import SuspensionDark from '@/assets/toolbar/suspension_dark.png';
import SuspensionLight from '@/assets/toolbar/suspension_light.png';

export const DialogContentWrapper = styled.div`
  a,
  button {
    color: ${(props) => props.theme.colors.textPrimary};
    text-decoration: none;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    color: ${(props) => props.theme.colors.text60};
  }
  .KuxButton-root {
    text-align: left;
  }
`;

const IconWarningBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 32px;
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ContentTitle = styled.div`
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  margin: 8px 0px;
`;

const ContentText = styled.div`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
  margin: 8px 0px;
`;

const WrapperDialog = styled(Dialog)`
  .KuxModalFooter-buttonWrapper {
    display: flex;
    justify-content: space-around;
    .KuxButton-root {
      width: 162px;
    }
  }
`;

/**
 * TradeInfomation
 * 交易信息模块弹框
 */
const DoubleValidateDialog = ({ validateDialog, setValidateDialog, handleSubmit }) => {
  const { visible, contentText = [] } = validateDialog;

  const theme = useTheme();
  return (
    <>
      <WrapperDialog
        header={null}
        open={visible}
        onOk={() => setValidateDialog((prevState) => ({ ...prevState, visible: false }))}
        onCancel={() => {
          setValidateDialog((prevState) => ({ ...prevState, visible: false, contentText: [] }));
          handleSubmit({ validateResult: true });
        }}
        okText={_t('s1Ciqfa6vCthuVZ8VJdyGr')}
        cancelText={_t('4wrT5trs7MdDaE6a5YrCwJ')}
        back={false}
        destroyOnClose
        showCloseX
      >
        <DialogContentWrapper>
          <IconWarningBox>
            <img
              alt={'Suspension'}
              width="148px"
              height="148px"
              src={theme.currentTheme === 'dark' ? SuspensionDark : SuspensionLight}
            />
            <ContentBox>
              <ContentTitle>{_t('awb3Ej3bVzemf9AFEu1a2V')}</ContentTitle>
              {contentText?.map((item) => {
                return <ContentText>{item}</ContentText>;
              })}
            </ContentBox>
          </IconWarningBox>
        </DialogContentWrapper>
      </WrapperDialog>
    </>
  );
};

export default memo(DoubleValidateDialog);
