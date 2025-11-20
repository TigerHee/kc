import React from 'react';
import { styled } from '@kux/mui';
import { ICHookOutlined } from '@kux/icons';
import _ from 'lodash';
import { useTranslation } from '@tools/i18n';
import { REGEXP_PWD_GROUP } from '../../common/tools';

const TipContainer = styled.section`
  // 有密码强度，不需要向上移动 16px, 否则如果表单有报错，也不需要向上移动 16px
  margin-top: ${(props) => (props.matchAllRules ? '0px' : props.isError ? '0px' : '-16px')};

  // 因为 H5 调整了的间距，formItem 多了一个 8px 的 margin-bottom，这边需要向上拉回来 8px
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: ${(props) => (props.matchAllRules ? '0px' : props.isError ? '-4px' : '0px')};
  }
`;
const CheckIcon = styled.span`
  width: 16px;
  height: 16px;
  margin-right: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.primary};
`;
const FailIcon = styled.span`
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  &::after {
    content: '';
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: ${(props) => props.theme.colors.cover16};
  }
  margin-right: 4px;
`;

const TipItem = styled.p`
  margin-bottom: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: 400;
  font-size: 12px;
  color: ${(props) => (props.fail ? props.theme.colors.text60 : props.theme.colors.text)};
  :last-of-type {
    margin-bottom: 24px; // 需要总间距32px，但是 mtSpace 已经有 8px 了
    ${(props) => props.theme.breakpoints.down('sm')} {
      margin-bottom: 24px;
    }
  }
`;

const PasswordCheck = ({ password, always = false, isError, matchAllRules }) => {
  const { t } = useTranslation('entrance');
  //  输入密码，密码checkList
  const PWD_STEPS = [
    {
      // 10-32位
      reg: REGEXP_PWD_GROUP.length,
      msg: () => t('newsignup.pwd.valid.length', { num1: 10, num2: 32 }),
    },
    {
      reg: REGEXP_PWD_GROUP.str,
      msg: () => t('newsignup.pwd.valid.str'),
    },
    {
      // 只有这里使用
      reg: REGEXP_PWD_GROUP.space,
      msg: () => t('newsignup.pwd.valid.space'),
    },
  ];
  if (!password && !always) return null;
  return (
    <TipContainer isError={isError} matchAllRules={matchAllRules}>
      {_.map(PWD_STEPS, ({ reg, msg }, index) => {
        const fail = !reg.test(password) || !password;
        return (
          <TipItem key={index} fail={fail}>
            {fail ? (
              <FailIcon />
            ) : (
              <CheckIcon>
                <ICHookOutlined size="16px" />
              </CheckIcon>
            )}
            <span>{msg()}</span>
          </TipItem>
        );
      })}
    </TipContainer>
  );
};

export default PasswordCheck;
