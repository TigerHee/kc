import React, { useMemo } from 'react';
import { Button, styled } from '@kux/mui';
import { ICHookOutlined } from '@kux/icons';

import { map } from 'lodash';
import { useLang } from '../../hookTool';

const Box = styled.section`
  width: 100%;
  margin-top: 24px;
  display: flex;
  flex-direction: column;
`;

const BtnWrapper = styled.section`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const ClickButton = styled(Button)`
  margin-right: ${(props) => (props.pre ? '16px' : 0)};
  width: ${(props) => (props.next ? '240px' : 'auto')};
  border-color: ${(props) => {
    return props.theme.colors.text30;
  }};
`;

const StepLineRow = styled.section`
  position: absolute;
  top: -100px;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  ${(props) => props.theme.breakpoints.down('sm')} {
    top: -40px;
  }
`;

const StepLinePrecent = styled.div`
  width: 100%;
  height: 6px;
  background: ${(props) => props.theme.colors.cover8};
`;

const StepLineItem = styled.div`
  flex: 1;
  margin-bottom: 0;
`;

const StepLineItemLabel = styled.span`
  display: inline-flex;
  align-items: center;
  margin-top: 12px;
  margin-left: 26px;
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  color: ${({ theme, current }) => {
    if (current) return theme.colors.text;
    return theme.colors.text40;
  }};
  ${(props) => props.theme.breakpoints.down('md')} {
    margin-left: 12px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    display: none;
  }
`;

const StepPrecent = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 6px;
  background: ${(props) => props.theme.colors.text};
  width: ${({ precent }) => {
    return `${(precent - 1 / 6) * 100}%`;
  }};
`;

const CheckedIcon = styled(ICHookOutlined)`
  margin-right: 8px;
  color: ${(props) => props.theme.colors.text60};
`;

export const StepLine = ({ precent }) => {
  const { t } = useLang();
  const stepsItems = useMemo(
    () => [
      {
        title: () => t('jiqt1Ywj7M6UFaRVFMnbVv'),
        isPass: (p) => p > 1 / 3,
        isCurrent: (p) => p === 1 / 3,
      },
      {
        title: () => t('5THafc1U6UZ15Ltaf7KJRg'),
        isPass: (p) => p > 2 / 3,
        isCurrent: (p) => p === 2 / 3,
      },
      {
        title: () => t('jjtBvLWA7FLuFe4HpacBDi'),
        isPass: (p) => p >= 1,
        isCurrent: (p) => p === 1,
      },
    ],
    [],
  );

  return (
    <StepLineRow>
      <StepPrecent precent={precent} />
      {map(stepsItems, ({ title, isPass, isCurrent }, index) => {
        const _isPass = isPass(precent);
        const _isCurrent = isCurrent(precent);
        return (
          <StepLineItem key={index}>
            <StepLinePrecent />
            <StepLineItemLabel current={_isCurrent}>
              {_isPass && !_isCurrent ? <CheckedIcon size={16} /> : null}
              {title()}
            </StepLineItemLabel>
          </StepLineItem>
        );
      })}
    </StepLineRow>
  );
};

const StepButton = ({ preTxt, nextText, onNext, onPre, sendCodeLoading }) => {
  return (
    <Box>
      <BtnWrapper>
        {onPre && (
          <ClickButton variant="outlined" pre onClick={onPre} size="large">
            {preTxt}
          </ClickButton>
        )}
        {onNext && (
          <ClickButton next onClick={onNext} size="large" loading={sendCodeLoading}>
            {nextText}
          </ClickButton>
        )}
      </BtnWrapper>
    </Box>
  );
};

export default StepButton;
