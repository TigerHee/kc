/**
 * Owner: vijay.zhou@kupotech.com
 * 从 packages/entrance/src/components/NewVoiceCode/NotReceiveDialog.js 迁移过来
 */
import React from 'react';
import { map } from 'lodash';
import { styled, useTheme, Button } from '@kux/mui';
import { Trans } from '@tools/i18n';
import useLang from '../../hooks/useLang';
import CommonModal from '../../components/CommonModal';
import { tenantConfig } from '../../config/tenant';

const Content = styled.div``;

const Title = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  color: ${(props) => props.theme.colors.text60};
  margin-bottom: 20px;
`;
const Tip = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text60};
  margin-top: 20px;
  span {
    color: ${(props) => props.theme.colors.text};
    text-decoration: underline;
    cursor: pointer;
    font-weight: 500;
  }
`;

const ContentList = styled.ul`
  margin: 0;
  padding: 0;
  font-weight: 400;
  font-size: 15px;
  line-height: 150%;
  color: ${(props) => props.theme.colors.text};
`;

const ContentListItem = styled.li`
  list-style: none;
  & + & {
    margin-top: 6px;
  }
`;

const SendButton = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  color: ${(props) => props.theme.colors.text};
  a {
    color: ${(props) => props.theme.colors.text};
    cursor: auto;
  }
`;

const FooterWrapper = styled.div`
  width: 100%;
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0 10px;
  .KuxButton-root {
    flex: 1;
  }
`;

const BasicPhoneCheckFunc = (phone, countryCode, _t) => [
  _t('newsignup.phone.try1'),
  _t('newsignup.phone.try2'),
  _t('newsignup.phone.try3', { phone: `+${countryCode}-${phone}` }),
  _t('newsignup.phone.try4', { minute: 10 }),
];

const PhoneCheckListFunc = (options = {}) => {
  const { phone, isSupportVoice, _t, theme, countryCode } = options;
  const concatArr = isSupportVoice
    ? [
        <SendButton
          theme={theme}
          dangerouslySetInnerHTML={{ __html: _t('newsignup.phone.try5') }}
        />,
      ]
    : [];
  return BasicPhoneCheckFunc(phone, countryCode, _t).concat(concatArr);
};

/**
 * @param    {Boolean}   open    弹窗打开/关闭
 * @param    {Function}  onSend   发送语音验证
 * @param    {Boolean}   isSupportVoice   是否支持语音验证
 * @param    {Function}  onClose 关闭弹窗
 * @param    {String}    phone 手机号
 */
const DidNotReceiveCode = ({
  open = false,
  isSupportVoice = false,
  onSend = () => {},
  onClose = () => {},
  phone = '',
  countryCode,
  disabled,
  countTimer,
}) => {
  const theme = useTheme();
  const { _t } = useLang();

  const handleSend = () => {
    typeof onClose === 'function' && onClose();
    typeof onSend === 'function' && onSend();
  };
  const PhoneCheckList = PhoneCheckListFunc({
    phone,
    countryCode,
    isSupportVoice,
    onSend: handleSend,
    _t,
    theme,
  });

  const goPage = (url) => {
    const newWindow = window.open(url);
    if (newWindow) newWindow.opener = null;
  };

  const list = PhoneCheckList;
  return (
    <CommonModal
      maskClosable
      open={open}
      size="medium"
      title={_t('newsignup.phone.ask')}
      onCancel={() => {
        typeof onClose === 'function' && onClose();
      }}
    >
      <Content>
        <Title>{_t('uPPpHaDfmYbwigQSHMfSy7')}</Title>
        <ContentList>
          {map(list, (item, index) => (
            <ContentListItem key={index}>{item}</ContentListItem>
          ))}
        </ContentList>
        <Tip>
          <Trans i18nKey="swZGGUnSezsGkrEvt8Cen6" ns="entrance" dir="rtl">
            If the above methods do not solve your problem, visit our
            <span
              onClick={() => {
                goPage(tenantConfig.notReceiverHelpCenterUrl);
              }}
            >
              Help Center
            </span>
          </Trans>
        </Tip>
      </Content>
      <FooterWrapper>
        {isSupportVoice ? (
          <Button
            variant="outlined"
            type="primary"
            key="send"
            disabled={disabled}
            size="large"
            onClick={handleSend}
          >
            {`${_t('6Vkjuzgbz2LvrjQDdRaevp')}${countTimer ? ` ${countTimer}s` : ''}`}
          </Button>
        ) : null}
        <Button
          ariant="contained"
          key="ok"
          size="large"
          onClick={() => {
            typeof onClose === 'function' && onClose();
          }}
        >
          {_t('a4CTBzVQA53tTRgpeu8hHs')}
        </Button>
      </FooterWrapper>
    </CommonModal>
  );
};

export default DidNotReceiveCode;
