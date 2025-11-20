/**
 * Owner: odan.ou@kupotech.com
 */

import { ICHookOutlined } from '@kux/icons';
import { styled } from '@kux/mui';
import map from 'lodash/map';
import { _t } from '../utils';

// 常用正则
export const REGEXP = {
  // pwd: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\S]{10,32}$/, // 至少包含大小写字母跟数字，不支持空格
  email:
    /(?:[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/, // eslint-disable-line
  phone: /^\d+$/,
};

export const REGEXP_PWD_GROUP = {
  length: /^.{6,16}$/,
  // eslint-disable-next-line kupo-lint/no-zero-width-assertions
  str: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/,
  space: /\s/,
};

const TipContainer = styled.section`
  margin-top: ${(props) => (props.isError ? '4px' : '-16px')};
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
  display: inline-block;
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  &::after {
    width: 4px;
    height: 4px;
    background: ${(props) => props.theme.colors.cover16};
    border-radius: 50%;
    content: '';
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
    margin-bottom: 24px;
  }
`;

//  输入密码，密码checkList
const PWD_STEPS = [
  {
    // 10-32位
    reg: REGEXP_PWD_GROUP.length,
    msg: () => _t('uMFA4JtxXpjsP7TTp2ddw7', '6-16個字符', { min: 6, max: 16 }),
  },
  {
    reg: REGEXP_PWD_GROUP.str,
    msg: () => _t('hU6KktXsUF8tC4KzUP1bLX', '最少一個大寫字母，一個小寫字母和數字'),
  },
  {
    reg: /^\S*$/,
    msg: () => _t('g8oLRWFwRiZEJ9zeW2cXd6', '不允許空格'),
  },
];

const passWordCheck = ({ password, always = false }) => {
  if (!password && !always) return [false];
  let isErr = false;
  const checkInfo = map(PWD_STEPS, ({ reg, msg }, index) => {
    const fail = !reg.test(password) || !password;
    if (!isErr) {
      isErr = fail;
    }
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
  });
  const checkedRes = <TipContainer isError={isErr}>{checkInfo}</TipContainer>;
  return [isErr, checkedRes];
};

export default passWordCheck;

const PassWordRule = {
  validator(rule, value) {
    const [isErr, checkedRes] = passWordCheck({ password: value });
    if (!isErr) return Promise.resolve();
    return Promise.reject(checkedRes);
  },
};

export { PassWordRule };
