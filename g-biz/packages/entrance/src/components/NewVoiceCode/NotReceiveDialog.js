/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { map } from 'lodash';
import { styled, Dialog, useTheme, Button } from '@kux/mui';
import { useTranslation, Trans } from '@tools/i18n';
import { tenantConfig } from '@packages/entrance/src/config/tenant';
import { kcsensorsClick, kcsensorsManualTrack } from '../../common/tools';

const ExtendDialog = styled(Dialog)`
  & .KuxModalHeader-root {
    min-height: 90px;
    height: auto !important;
    padding: 32px 32px 24px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    .KuxDialog-body {
      margin: auto 4px;
    }
  }
`;

const Content = styled.div``;

const Title = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text60};
  margin-bottom: 24px;
`;
const Tip = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text60};
  margin-top: 24px;
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
  font-size: 14px;
  line-height: 150%;
  color: ${(props) => props.theme.colors.text};
`;

const ContentListItem = styled.li`
  list-style: none;
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
  padding: 32px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .KuxButton-root {
    margin-right: 12px;
    height: 40px;
  }
  .KuxButton-root:last-of-type {
    margin-right: 0;
  }
`;

const EmailCheckListFunc = (email, t) => [
  t('newsignup.email.try1'),
  t('newsignup.email.try2', { email }),
  t('newsignup.email.try3', { minute: 10 }),
];

const BasicPhoneCheckFunc = (phone, countryCode, t) => [
  t('newsignup.phone.try1'),
  t('newsignup.phone.try2'),
  t('newsignup.phone.try3', { phone: `+${countryCode}-${phone}` }),
  t('newsignup.phone.try4', { minute: 10 }),
];

const PhoneCheckListFunc = (options = {}) => {
  const { phone, isSupportVoice, t, theme, countryCode } = options;
  const concatArr = isSupportVoice
    ? [
        <SendButton
          key="send-button"
          theme={theme}
          dangerouslySetInnerHTML={{ __html: t('newsignup.phone.try5') }}
        />,
      ]
    : [];
  return BasicPhoneCheckFunc(phone, countryCode, t).concat(concatArr);
};

/**
 * @param    {Boolean}   open    弹窗打开/关闭
 * @param    {Function}  onSend   发送语音验证
 * @param    {Boolean}   isSupportVoice   是否支持语音验证
 * @param    {Function}  onClose 关闭弹窗
 * @param    {String}    phone 手机号
 * @param    {String}    email 邮箱
 */
const DidNotReceiveCode = ({
  open = false,
  isSupportVoice = false,
  loading = false,
  // 是否是手机号注册绑定邮箱进来的
  isFromPhoneRegister = false,
  onSend = () => {},
  onClose = () => {},
  phone = '',
  email = '',
  countryCode,
  disabled,
  countTime,
}) => {
  const theme = useTheme();
  // 组装需要的数据 邮箱存在，则表示是收邮箱验证码，否则都是手机号验证码
  const type = email ? 'email' : 'phone';
  const { t } = useTranslation('entrance');

  const basicObject = {
    onCancel: () => {
      typeof onClose === 'function' && onClose();
    },
    title: type === 'email' ? t('newsignup.email.ask') : t('newsignup.phone.ask'),
    footer: (
      <FooterWrapper>
        {type === 'phone' && isSupportVoice ? (
          <Button
            variant="outlined"
            type="primary"
            key="send"
            disabled={disabled}
            loading={loading}
            size="large"
            onClick={() => {
              handleSend();
              kcsensorsClick(['noCodePopUp', '2']);
              kcsensorsManualTrack(
                {
                  spm: ['SMSSecurityVerify', 'voiceCode'],
                  data: {
                    before_click_element_value: '',
                    after_click_element_value: 'Voice Code',
                  },
                },
                'page_click',
              );
            }}
          >
            {`${t('6Vkjuzgbz2LvrjQDdRaevp')}${countTime ? ` ${countTime}s` : ''}`}
          </Button>
        ) : null}
        <Button
          ariant="contained"
          key="ok"
          size="large"
          onClick={() => {
            typeof onClose === 'function' && onClose();
            kcsensorsClick(['noCodePopUp', '3']);
          }}
        >
          {t('a4CTBzVQA53tTRgpeu8hHs')}
        </Button>
      </FooterWrapper>
    ),
  };

  const handleSend = () => {
    kcsensorsClick(['noCodePopUp', '4']);
    typeof onClose === 'function' && onClose();
    typeof onSend === 'function' && onSend();
  };

  const EmailCheckList = EmailCheckListFunc(email, t);
  const PhoneCheckList = PhoneCheckListFunc({
    phone,
    countryCode,
    isSupportVoice,
    onSend: handleSend,
    t,
    theme,
  });

  const goPage = (url) => {
    const newWindow = window.open(url);
    if (newWindow) newWindow.opener = null;
  };

  const list = type === 'email' ? EmailCheckList : PhoneCheckList;
  return (
    <>
      <ExtendDialog maskClosable open={open} {...basicObject} size="medium">
        <Content>
          <Title>{t(type === 'email' ? 'v29acJGaqvZpXiiXnzZTGs' : 'uPPpHaDfmYbwigQSHMfSy7')}</Title>
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
                  kcsensorsManualTrack(
                    {
                      spm: [
                        type === 'phone'
                          ? 'SMSSecurityVerify'
                          : isFromPhoneRegister
                          ? 'signupBindEmailverify'
                          : 'emailSecurityVerify',
                        'helpCenter',
                      ],
                      data: {
                        before_click_element_value: '',
                        after_click_element_value: 'Help Center',
                      },
                    },
                    'page_click',
                  );
                  goPage(tenantConfig.common.notReceiverHelpCenterUrl);
                }}
              >
                Help Center
              </span>
            </Trans>
          </Tip>
        </Content>
      </ExtendDialog>
    </>
  );
};

export default DidNotReceiveCode;
