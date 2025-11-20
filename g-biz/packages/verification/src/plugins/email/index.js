/**
 * Owner: vijay.zhou@kupotech.com
 */
import { useTheme } from '@kux/mui';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Parser } from 'html-to-react';
import InnerFormItem from '../../components/InnerFormItem';
import { FormItemTipWrapper, FormItemTipText, FormInput } from '../../components/commonUIs';
import NoReceiveEmail from './NoReceiveEmail';
import Countdown from '../../components/Countdown';
import useSendCode from '../../hooks/useSendCode';
import { METHODS, SEND_CHANNELS } from '../../constants';
import HelpCategory from '../../components/HelpCategory';
import useLang from '../../hooks/useLang';
import emailSrc from '../../../static/email.svg';
import emailDarkSrc from '../../../static/email.dark.svg';
import verificationCodeFormat from '../../utils/verificationCodeFormat';
import { tenantConfig } from '../../config/tenant';

const htmlToReactParser = new Parser();

/** 验证方式编码 */
export const field = METHODS.EMAIL;

/** 判断自动提交 */
export const autoSubmit = (form) => {
  const value = form.getFieldValue(field) ?? '';
  return value.length === 6;
};

/** 提交前处理 */
export const beforeSubmit = (form) => {
  // 返回新的key和value
  // 部分字段可能存在风控编码和最终提交验证的字段名不一致
  // 例如邮箱，在风控编码是 EMV，在安全验证场景只能发送到自己的邮箱
  // 所以提交验证对应字段名应为 MY_EMV
  return [`MY_${field}`, form.getFieldValue(field) ?? ''];
};

/** 切换验证方式-名称 */
export const Name = (props) => {
  const { _t } = useLang();
  return <span {...props}>{_t('3542b4a3ce524000acb7')}</span>;
};

/** 切换验证方式-图标 */
export const Icon = (props) => {
  const { currentTheme = 'light' } = useTheme();
  const map = {
    light: emailSrc,
    dark: emailDarkSrc,
  };
  return <img src={map[currentTheme] ?? map.light} alt="icon" {...props} />;
};

/** 验证表单的表单项目 */
export const VerifyItem = ({
  bizType,
  transactionId,
  value,
  onlyOne,
  onValueChange,
  onReFocus,
}) => {
  const { _t } = useLang();
  const { user } = useSelector((state) => state.user);
  const { loading, count, sendCode, isFirst } = useSendCode({
    operationId: `${transactionId}_${SEND_CHANNELS.EMAIL}`,
    bizType,
    transactionId,
    sendChannel: SEND_CHANNELS.EMAIL,
  });
  const inputRef = useRef();

  useEffect(() => {
    // 仅有一项时自动聚焦
    onlyOne && inputRef.current?.focus();
  }, [onlyOne]);

  useEffect(() => {
    // 仅有一项时自动发送验证码，只触发一次
    onlyOne && isFirst && sendCode();
  }, [onlyOne, sendCode, isFirst]);

  return (
    <InnerFormItem
      label={_t('bcd5cd3ba1f04000a750')}
      name={field}
      rules={[
        {
          validator: (rule, value, callback) => {
            if (!value || value.length !== 6) {
              callback(new Error(_t('form.format.error')));
            } else {
              callback();
            }
          },
        },
      ]}
      help={
        <FormItemTipWrapper>
          <FormItemTipText>
            {htmlToReactParser.parse(_t('tung7oRbHSRMT3fw878BMA', { email: user?.email }))}
          </FormItemTipText>
        </FormItemTipWrapper>
      }
    >
      <FormInput
        ref={inputRef}
        inputProps={{ className: 'security-verify-input' }}
        value={value}
        addonAfter={null}
        size="xlarge"
        onFocus={() => onReFocus(field)}
        allowClear
        prefix={<div />}
        suffix={
          <Countdown
            count={count}
            loading={loading}
            text={isFirst ? _t('48ad1d90c50c4000a6fd') : _t('2e4deb4958ab4000a79a')}
            onClick={sendCode}
          />
        }
        onChange={(e) => {
          const { value = '' } = e.target ?? {};
          onValueChange(verificationCodeFormat(value));
        }}
      />
    </InnerFormItem>
  );
};

/** 验证方式不可用的帮助选项 */
export const HelpItem = ({ onlyOne }) => {
  const { _t } = useLang();
  const [noReceiveOpen, setNoReceiveOpen] = useState(false);

  return (
    <>
      <HelpCategory
        title={_t('f10db0b246354000aad7')}
        items={[
          { label: _t('e671d07a65364000ac43'), onClick: () => setNoReceiveOpen(true) },
          {
            label: _t('323b3696b8044000aef2'),
            onClick: () => window.open(tenantConfig.emailUnavailableUrl),
          },
        ]}
        onlyOne={onlyOne}
      />
      <NoReceiveEmail open={noReceiveOpen} onCancel={() => setNoReceiveOpen(false)} />
    </>
  );
};

/** 插件是否启用 */
export const enable = () => true;
