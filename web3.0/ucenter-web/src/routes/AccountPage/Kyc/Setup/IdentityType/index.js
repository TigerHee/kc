import { ICArrowRight2Outlined } from '@kux/icons';
import { Box, Button, Checkbox, Form, Radio, useSnackbar, useTheme } from '@kux/mui';
import { withRouter } from 'components/Router';
import { useEffect, useMemo, useState } from 'react';
import { getIdentityTypes } from 'services/kyc';
import useKycCache from 'src/hooks/useKycCache';
import { addLangToPath, _t, _tHTML } from 'src/tools/i18n';
import { kcsensorsManualExpose, trackClick } from 'utils/ga';
import KycRetain from '../../components/KycRetain';
import replaceWithBackUrl from '../../utils/replaceWithBackUrl';
import {
  Back,
  Body,
  Container,
  Desc,
  ExTag,
  FormBox,
  Header,
  Item,
  ItemContent,
  ItemIconWrapper,
  List,
  Nav,
  Wrapper,
} from './components/styled';

const { useForm, useWatch, FormItem } = Form;

const IdentityType = ({ query }) => {
  const [cache, pullCache, postCache] = useKycCache();
  const { message } = useSnackbar();
  const [form] = useForm();
  const identityType = useWatch('identityType', form); // 选择证件类型
  const theme = useTheme();
  const isDark = theme.currentTheme === 'dark';

  const [loading, setLoading] = useState(false);
  const [identityTypeConfig, setIdentityTypeConfig] = useState(null);
  const { recommendIdType } = identityTypeConfig ?? {};

  const identityTypeOptions = useMemo(() => {
    if (!identityTypeConfig) {
      return [];
    }
    const {
      localIdentityTypeList = [],
      commonIdentityTypeList = [],
      recommendIdType,
    } = identityTypeConfig;
    const options = [];
    localIdentityTypeList?.forEach((item) => {
      item.type === recommendIdType
        ? options.unshift({ ...item, isFast: true })
        : options.push({ ...item, isFast: true });
    });
    commonIdentityTypeList?.forEach((item) => {
      item.type === recommendIdType ? options.unshift(item) : options.push(item);
    });
    return options;
  }, [identityTypeConfig]);

  const handleBack = () => {
    const nextUrl = '/account/kyc/setup/country-of-issue';
    replaceWithBackUrl(nextUrl, query.backUrl);
  };

  const handleSubmit = async () => {
    trackClick(['documentType', 'continueButton']);
    try {
      let success = false;
      if (cache.identityType !== identityType) {
        success = await postCache({ ...cache, identityType });
      } else {
        success = true;
      }
      success && replaceWithBackUrl('/account/kyc/setup/method', query.backUrl);
    } catch (err) {
      console.error(err);
      message.error(err?.msg || err?.message);
    }
  };

  useEffect(async () => {
    setLoading(true);
    const { region, identityType } = await pullCache();
    try {
      if (region) {
        const res = await getIdentityTypes({ region });
        if (!res.success) {
          throw res;
        }
        setIdentityTypeConfig(res.data);
        form.setFieldsValue({ identityType: identityType ?? res.data?.recommendIdType });
      }
    } catch (err) {
      console.error(err);
      message.error(err?.msg ?? err?.message);
    } finally {
      setLoading(false);
    }
    kcsensorsManualExpose(['documentType', '1']);
  }, []);

  return (
    <Container>
      <Wrapper>
        <Nav>
          <Back onClick={handleBack}>
            <ICArrowRight2Outlined size={16} />
            <span>{_t('back')}</span>
          </Back>
        </Nav>
        <Body>
          <FormBox>
            <Header>{_t('kyc.verification.info.cert.select')}</Header>
            <Form form={form}>
              <FormItem
                name="identityType"
                rules={[{ required: true, message: _t('3bd2f2b960d14800a155') }]}
              >
                <Radio.Group name="identityType">
                  <List data-inspector="identity_type_list">
                    {identityTypeOptions.map(({ name, type, icon, iconDark, isFast }) => {
                      return (
                        <Item
                          key={type}
                          onClick={() => form.setFieldsValue({ identityType: type })}
                          data-inspector={`identity_type_${type}`}
                        >
                          <ItemIconWrapper>
                            <img src={isDark ? iconDark ?? icon : icon} alt="icon" />
                          </ItemIconWrapper>
                          <ItemContent>
                            {name}
                            {isFast ? <ExTag>{_t('b45e2b12c0dd4000a96a')}</ExTag> : null}
                            {type === recommendIdType ? (
                              <ExTag>{_t('da5ef3312e974000ac02')}</ExTag>
                            ) : null}
                          </ItemContent>
                          <Checkbox
                            checked={type === identityType}
                            size="basic"
                            checkOptions={{ type: 1, checkedType: 1 }}
                          />
                        </Item>
                      );
                    })}
                  </List>
                </Radio.Group>
              </FormItem>

              <Box size={16} />
              <Desc>
                {_tHTML('3199247625584000a73f', {
                  url1: addLangToPath(
                    '/announcement/en-kyc-user-identity-authentication-statement',
                  ),
                  url2: addLangToPath('/support/33355026776985'),
                  url3: 'https://www.jumio.com/privacy-center/privacy-notices/online-services-notice/',
                })}
              </Desc>
            </Form>
          </FormBox>
          <Button size="large" fullWidth loading={loading} onClick={handleSubmit}>
            {_t('83fd14a4e1604000a696')}
          </Button>
        </Body>
      </Wrapper>
      <KycRetain />
    </Container>
  );
};

export default withRouter()(IdentityType);
