/**
 * Owner: sean.shi@kupotech.com
 */
import { useEffect } from 'react';
import { Form, Button, styled } from '@kux/mui';
import { useSelector, useDispatch } from 'react-redux';
import { kcsensorsManualTrack } from '@utils/sensors';
import useMultiSiteConfig from '@hooks/useMultiSiteConfig';
import { NAMESPACE, THIRD_PARTY_LOGIN_DECISION, THIRD_PARTY_LOGIN_PLATFORM } from '../constants';
import { useLang } from '../../hookTool';
import { checkAccountType, compose, getMobileCode, kcsensorsClick } from '../../common/tools';
import FusionInputFormItem from '../../components/FusionInputFormItem';

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
`;

export const BindExistAccount = ({
  handleExistAccountLogin,
  handleNewAccount,
  handleAccountHasBound,
}) => {
  const { t } = useLang();
  const dispatch = useDispatch();
  const [form] = useForm();
  const {
    countryCodes,
    thirdPartyInfo,
    thirdPartyPlatform,
    thirdPartyDecodeInfo,
    thirdPartyBindAccountInfo,
  } = useSelector((s) => s[NAMESPACE]);
  const platformLabel = THIRD_PARTY_LOGIN_PLATFORM(t)[thirdPartyPlatform]?.labelLocale || '';
  const { multiSiteConfig } = useMultiSiteConfig();
  const accountValue = Form.useWatch('account', form);
  const handleCheckAccount = async () => {
    try {
      const values = await form.validateFields();
      kcsensorsClick(['bindExistingKCAccountInputAccount', 'nextButton']);
      const accountType = checkAccountType(values?.account);
      const countryCode = getMobileCode(values?.countryCode);
      // 0--表示用户没注册，走注册流程
      // 1--用户已注册，且可以绑定，走登录绑定流程
      // 2--用户已注册，但不能绑定，可能已绑定其他账号，或处于冻结状态等
      const status = await dispatch({
        type: `${NAMESPACE}/checkAccount`,
        payload: {
          extInfo: thirdPartyInfo,
          extPlatform: thirdPartyPlatform,
          ...(accountType === 'phone'
            ? { countryCode, phone: values.account }
            : { email: values.account }),
        },
      });
      // 没有注册，走注册绑定流程
      if (status === 0) {
        handleNewAccount();
      } else if (status === 1) {
        // 登陆绑定
        dispatch({
          type: `${NAMESPACE}/update`,
          payload: {
            loginDecision: THIRD_PARTY_LOGIN_DECISION.login,
          },
        });
        handleExistAccountLogin();
        // 已经注册，可以绑定，登陆绑定流程
      } else if (status === 2) {
        handleAccountHasBound();
        // 用户已注册，但不能绑定，继续登陆/换绑流程
      }
    } catch (error) {
      console.error('Error checking account:', error);
    }
  };

  useEffect(() => {
    kcsensorsManualTrack({
      spm: ['bindExistingKCAccountInputAccount', '1'],
      data: {
        pre_spm_id: compose(['accountDiversionPage', 'bindExistingKCAccount']),
      },
    });
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
      <ExtendForm form={form} onFinish={handleCheckAccount}>
        <FusionInputFormItem
          key={thirdPartyInfo?.userInfo}
          form={form}
          countryCodes={countryCodes}
          scene="login"
          initValues={{
            countryCode: thirdPartyBindAccountInfo?.countryCode || '',
            account: thirdPartyBindAccountInfo?.phone || thirdPartyBindAccountInfo?.email || '',
          }}
          onInputFocus={() => {
            kcsensorsManualTrack({ spm: ['accountInsert', '1'] }, 'page_click');
          }}
          multiSiteConfig={multiSiteConfig}
        />
        <Button
          className="subButton"
          fullWidth
          htmlType="submit"
          size="large"
          data-inspector="signin_submit_button"
          disabled={!accountValue}
        >
          <span>{t('next')}</span>
        </Button>
      </ExtendForm>
    </>
  );
};
