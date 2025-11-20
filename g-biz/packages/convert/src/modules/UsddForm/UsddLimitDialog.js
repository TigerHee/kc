/*
 * owner: june.lee@kupotech.com
 */
import React from 'react';
import { useTranslation } from '@tools/i18n';
import { styled, Button, useEventCallback } from '@kux/mui';
import Dialog from '../../components/common/Dialog';
import ButtonWrapper from './ButtonWrapper';
import { formatNumber } from '../../utils/format';

const TipText = styled.div`
  color: ${(props) => props.theme.colors.text40};
  font-size: 16px;
  line-height: 140%;
`;

const LimitInfoListWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-size: 16px;
`;

const LimitInfoListItem = styled.div``;

const LimitInfoListItemTitle = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-size: 16px;
  font-weight: 500;
  line-height: 140%;
`;

const LimitInfoListItemInnerList = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LimitInfoListItemInnerListItem = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: ${(props) => props.theme.colors.text60};
`;

const LimitInfoListItemInnerListItemDot = styled.div`
  color: ${(props) => props.theme.colors.text60};
  font-weight: 900;
`;
const LimitInfoListItemInnerListItemLabel = styled.div`
  margin-left: 8px;
  color: ${(props) => props.theme.colors.text60};
`;

const LimitInfoListItemInnerListItemValue = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
`;

const ButtonWrapperPro = styled(ButtonWrapper)`
  display: flex;
  margin: 32px 0;
  button {
    flex: 1;
    &:not(:first-of-type) {
      margin-left: 24px;
    }
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 0;
  }
`;

const UsddLimitDialog = ({ onOk, open, onCancel, convertSymbolsMap, ...otherProps }) => {
  const { t: _t } = useTranslation('convert');

  const handleCancel = useEventCallback(() => {
    if (onCancel) onCancel(true);
  });

  const usdtConf = convertSymbolsMap?.USDT || {};
  const usddConf = convertSymbolsMap?.USDD || {};
  const usdtUserLimt = usdtConf.userLimit || 0;
  const usddUserLimt = usddConf.userLimit || 0;
  const usdtPlatformLimt = usdtConf.platformLimit || 0;
  const usddPlatformLimt = usddConf.platformLimit || 0;

  const limitData = [
    {
      title: _t('49bb52b9be614800a9e9'),
      list: [
        { currency: 'USDD', value: usddUserLimt },
        { currency: 'USDT', value: usdtUserLimt },
      ],
    },
    {
      title: _t('7f2e9e6a34ee4000a7cd'),
      list: [
        { currency: 'USDD', value: usddPlatformLimt },
        { currency: 'USDT', value: usdtPlatformLimt },
      ],
    },
  ];

  return (
    <Dialog
      open={open}
      size="medium"
      footer={null}
      height="auto"
      destroyOnClose
      onCancel={handleCancel}
      title={_t('605d8bdb76ef4000a89f')}
      {...otherProps}
    >
      <TipText>{_t('f1d1b76d35474000a7f4')}</TipText>
      <LimitInfoListWrapper>
        {limitData.map(({ title, list }) => {
          return (
            <LimitInfoListItem key={title}>
              <LimitInfoListItemTitle>{title}</LimitInfoListItemTitle>
              <LimitInfoListItemInnerList>
                {list.map(({ currency, value }) => (
                  <LimitInfoListItemInnerListItem key={currency}>
                    <LimitInfoListItemInnerListItemDot>·</LimitInfoListItemInnerListItemDot>
                    <LimitInfoListItemInnerListItemLabel>
                      {_t('76ab6ac6fc544000a47c')}
                    </LimitInfoListItemInnerListItemLabel>
                    <LimitInfoListItemInnerListItemValue>
                      &nbsp;
                      {formatNumber(value, {
                        dp: null,
                      })}
                      &nbsp;
                      {currency}
                    </LimitInfoListItemInnerListItemValue>
                  </LimitInfoListItemInnerListItem>
                ))}
              </LimitInfoListItemInnerList>
            </LimitInfoListItem>
          );
        })}
      </LimitInfoListWrapper>
      <ButtonWrapperPro onClick={handleCancel}>
        <Button fullWidth size="large" onClick={onOk}>
          {_t('701ac21e1d934000a173')}
        </Button>
      </ButtonWrapperPro>
    </Dialog>
  );
};

export default React.memo(UsddLimitDialog);
