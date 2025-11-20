/**
 * Owner: sean.shi@kupotech.com
 */
import { Form, Button, Box, styled } from '@kux/mui';
import { useDispatch, useSelector } from 'react-redux';
import { ICArrowRightOutlined } from '@kufox/icons';
import useMultiSiteConfig from '@hooks/useMultiSiteConfig';
import { useEffect } from 'react';
import {
  NAMESPACE,
  THIRD_PARTY_LOGIN_PLATFORM,
  THIRD_PARTY_LOGIN_DECISION,
  THIRD_PARTY_ACCOUNT_DIVERSION_STEP,
} from '../constants';
import { useLang } from '../../hookTool';
import FusionInputFormItem from '../../components/FusionInputFormItem';
import { compose, getMobileCode, kcsensorsClick, kcsensorsManualTrack } from '../../common/tools';

const { useForm } = Form;

const Title = styled.h2`
  font-weight: 700;
  font-size: 40px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  word-break: break-word;
  margin-bottom: 40px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 24px;
    margin-bottom: 32px;
    font-weight: 600;
  }
`;

const Desc = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 150%;
  color: ${({ theme }) => theme.colors.text40};
  margin-top: -24px;
  margin-bottom: 40px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    color: ${({ theme }) => theme.colors.text60};
    line-height: 140%;
  }
`;

const ExtendForm = styled(Form)`
  .subButton {
    margin-top: 40px;
  }
  .mtSpace {
    margin-top: 8px;
    ${(props) => props.theme.breakpoints.down('sm')} {
      margin-top: 0;
    }
  }
  .KuxForm-itemHelp {
    .KuxForm-itemError {
      padding-left: 0;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 140%; /* 19.6px */
    }
  }
`;

const ContinueLoginBox = styled(Box)`
  margin-top: 28px;
`;
const ContinueLogin = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-family: 'KuFox Sans';
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 140%; /* 22.4px */
  margin-top: 14px;
  cursor: pointer;

  span {
    display: inline;
  }

  svg {
    display: inline-block;
    vertical-align: middle;
    margin-top: -2px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 14px;
  }
`;

/**
 * 输入账户已绑定，无论换绑还是登陆，都是登陆流程
 */
export const AccountHasBound = ({ handleExistAccountLogin }) => {
  const { t } = useLang();
  const [form] = useForm();
  const {
    countryCodes,
    thirdPartyInfo,
    thirdPartyPlatform,
    thirdPartyDecodeInfo,
    thirdPartyBindAccountInfo,
    thirdPartyDiversionPrevStepList,
  } = useSelector((s) => s[NAMESPACE]);
  const platformLabel = THIRD_PARTY_LOGIN_PLATFORM(t)[thirdPartyPlatform]?.labelLocale || '';
  const { multiSiteConfig } = useMultiSiteConfig();
  const dispatch = useDispatch();
  // 直接登陆
  const continueLogin = () => {
    kcsensorsClick(['alreadyBoundKCAccount', 'continueLogin']);
    handleExistAccountLogin();
    kcsensorsManualTrack({
      spm: ['loginExistingKCAccount', '1'],
      data: {
        pre_spm_id: compose(['alreadyBoundKCAccount', 'continueLogin']),
      },
    });
  };

  // 换绑登陆
  const relinkAccountLogin = () => {
    kcsensorsClick(['alreadyBoundKCAccount', 'switchThirdPartyAccount']);
    dispatch({
      type: `${NAMESPACE}/update`,
      payload: {
        loginDecision: THIRD_PARTY_LOGIN_DECISION.relink,
      },
    });
    handleExistAccountLogin();
    kcsensorsManualTrack({
      spm: ['loginExistingKCAccount', '1'],
      data: {
        pre_spm_id: compose(['alreadyBoundKCAccount', 'switchThirdPartyAccount']),
      },
    });
  };

  const currentAccount = thirdPartyBindAccountInfo?.countryCode
    ? `${getMobileCode(thirdPartyBindAccountInfo?.countryCode)}-${thirdPartyBindAccountInfo?.phone}`
    : thirdPartyBindAccountInfo?.email;

  useEffect(() => {
    // 是否从新建账号过来
    const isFromCreateNewAccount = thirdPartyDiversionPrevStepList.length
      ? thirdPartyDiversionPrevStepList[thirdPartyDiversionPrevStepList.length - 1] ===
        THIRD_PARTY_ACCOUNT_DIVERSION_STEP.CREATE_NEW_ACCOUNT
      : false;
    kcsensorsManualTrack({
      spm: ['alreadyBoundKCAccount', '1'],
      data: {
        pre_spm_id: isFromCreateNewAccount
          ? compose(['createNewKCAccount', '1'])
          : compose(['bindExistingKCAccountInputAccount', '1']),
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Title>{t('9fabaa38d6f74800a6bb')}</Title>
      <Desc>
        {t('3db4576973104000ae4f', {
          platform: platformLabel,
          account: thirdPartyDecodeInfo?.userInfo,
        })}
      </Desc>
      <ExtendForm form={form}>
        <FusionInputFormItem
          key={thirdPartyInfo?.userInfo}
          form={form}
          countryCodes={countryCodes}
          errorTips={t('48ac1bdadda64000aa70', {
            platform: platformLabel,
          })}
          initValues={{
            countryCode: thirdPartyBindAccountInfo?.countryCode || '',
            account: thirdPartyBindAccountInfo?.phone || thirdPartyBindAccountInfo?.email || '',
          }}
          scene="login"
          multiSiteConfig={multiSiteConfig}
          disabled
        />
        <ContinueLoginBox>
          <ContinueLogin onClick={continueLogin}>
            <span>
              {t('0e4b36dfb3524800aa8c', {
                account: currentAccount,
              })}
            </span>
            <ICArrowRightOutlined size={16} />
          </ContinueLogin>
          <ContinueLogin onClick={relinkAccountLogin}>
            <span>
              {t('9c99ebced2df4800ae64', {
                platform: platformLabel,
                account: currentAccount,
              })}
            </span>
            <ICArrowRightOutlined size={16} />
          </ContinueLogin>
        </ContinueLoginBox>
        <Button
          className="subButton"
          fullWidth
          htmlType="submit"
          size="large"
          data-inspector="signin_submit_button"
          disabled
        >
          <span>{t('next')}</span>
        </Button>
      </ExtendForm>
    </>
  );
};
