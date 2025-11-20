import useLocale from 'hooks/useLocale';
import { ICArrowRight2Outlined, ICIphoneOutlined, ICMacOutlined } from '@kux/icons';
import { Spin } from '@kux/mui';
import { withRouter } from 'components/Router';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { tenantConfig } from 'src/config/tenant';
import useKycCache from 'src/hooks/useKycCache';
import Back from 'routes/AccountPage/Kyc/components/Back';
import { _t } from 'src/tools/i18n';
import qrCodeDownloadLogo from 'static/download/download_logo.png';
import { addLangToPath } from 'tools/i18n';
import { kcsensorsManualExpose, trackClick } from 'utils/ga';
import KycRetain from '../../components/KycRetain';
import replaceWithBackUrl from '../../utils/replaceWithBackUrl';
import {
  ArrowDownIcon,
  Container,
  Content,
  ContentDesc,
  ExTag,
  Item as OriginItem,
  ItemContent,
  ItemHeader,
  ItemHeaderCenter,
  ItemHeaderDesc,
  ItemHeaderLeft,
  ItemHeaderRight,
  ItemHeaderTitle,
  List,
  Title,
  Wrapper,
} from './styled';
import { getSiteConfig } from 'kc-next/boot';
import { useRouter } from 'kc-next/router';
import AccountLayout from '@/components/AccountLayout';
import ErrorBoundary, { SCENE_MAP } from '@/components/common/ErrorBoundary';

import useResponsiveSSR from '@/hooks/useResponsiveSSR';

const METHODS = {
  APP: 'APP',
  DOWNLOAD_APP: 'DOWNLOAD_APP',
  CURRENT_DEVICE: 'CURRENT_DEVICE',
};
const { isShowAppScanQRCode } = tenantConfig.kyc;

const Item = ({
  title,
  desc,
  icon,
  rightIcon,
  content,
  active = false,
  recommend = false,
  onActive,
  ...props
}) => {
  const rv = useResponsiveSSR();
  const isH5 = !rv?.sm;
  return (
    <OriginItem onClick={() => onActive(!active)} {...props}>
      <ItemHeader>
        <ItemHeaderLeft>{icon}</ItemHeaderLeft>
        <ItemHeaderCenter>
          <ItemHeaderTitle>
            <span>{title}</span>
            {recommend ? <ExTag>{_t('83c7113c9bb44000a2a1')}</ExTag> : null}
          </ItemHeaderTitle>
          <ItemHeaderDesc>{desc}</ItemHeaderDesc>
        </ItemHeaderCenter>
        <ItemHeaderRight>
          {rightIcon ? rightIcon : <ArrowDownIcon size={isH5 ? 18 : 24} active={active} />}
        </ItemHeaderRight>
      </ItemHeader>
      {active ? <ItemContent onClick={(e) => e.stopPropagation()}>{content}</ItemContent> : null}
    </OriginItem>
  );
};

const Method = ({ query }) => {
  const { isRTL } = useLocale();
  const isGlobal = tenantConfig.kyc.siteRegion === 'global';
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(
    isShowAppScanQRCode ? METHODS.APP : METHODS.DOWNLOAD_APP,
  );
  const dispatch = useDispatch();
  const [cache, pullCache] = useKycCache();
  const { region, identityType, userState } = cache;
  const rv = useResponsiveSSR();
  const isH5 = !rv?.sm;
  const { KUCOIN_HOST } = getSiteConfig();
  const router = useRouter();

  const handleActive = (active, val) => {
    setSelectedMethod(active ? val : undefined);
  };

  const qrcodeProps = {
    imageSettings: {
      src: qrCodeDownloadLogo,
      x: null,
      y: null,
      height: 22,
      width: 22,
      excavate: true,
    },
    size: 96,
    level: 'H',
  };

  const handleBack = () => {
    replaceWithBackUrl(
      isGlobal && cache.region
        ? '/account/kyc/setup/identity-type'
        : '/account/kyc/setup/country-of-issue',
      query.backUrl,
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isGlobal) {
        try {
          setLoading(true);
          await pullCache();
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
        kcsensorsManualExpose(['verifyMethod', '1']);
      }
    };
    fetchData();
  }, [isGlobal]);

  return (
    <Spin spinning={loading} size="small">
      <Container>
        <Wrapper>
          <Back onBack={handleBack} />
          <Title>{_t('f8a60904c4df4800a193')}</Title>
          <List>
            {isShowAppScanQRCode ? (
              <Item
                title={_t('c9bbba940bbd4000aa78')}
                desc={_t('b8a4caccbebb4800ab04')}
                icon={<ICIphoneOutlined size={isH5 ? 20 : 24} />}
                content={
                  <Content>
                    <QRCodeSVG
                      value={`${KUCOIN_HOST}${addLangToPath('/account/kyc/home')}`}
                      {...qrcodeProps}
                    />
                    <ContentDesc>{_t('830c2eefb6364000a5da')}</ContentDesc>
                  </Content>
                }
                recommend={isShowAppScanQRCode}
                active={selectedMethod === METHODS.APP}
                onActive={(active) => handleActive(active, METHODS.APP)}
              />
            ) : null}
            <Item
              title={_t('86d0f02fc09d4800a17d')}
              desc={_t('024a775482f34800ab6f')}
              icon={<ICIphoneOutlined size={isH5 ? 20 : 24} />}
              content={
                <Content>
                  <QRCodeSVG
                    // onelink 10月份才上线，先注释
                    // value={tenantConfig.kyc.appOneLink}
                    value={`${KUCOIN_HOST}${addLangToPath('/account/kyc/home')}`}
                    {...qrcodeProps}
                  />
                  <ContentDesc>
                    <div>{_t('1ab6b50fb0964800ab18')}</div>
                    {/** app 4.100 10月份才上线，先注释这个文案，等app上线后放开 */}
                    {/* <div>{_t('ed7e43bbc28b4800a3d0')}</div> */}
                  </ContentDesc>
                </Content>
              }
              recommend={!isShowAppScanQRCode}
              active={selectedMethod === METHODS.DOWNLOAD_APP}
              onActive={(active) => handleActive(active, METHODS.DOWNLOAD_APP)}
            />
            <Item
              data-inspector="kyc_method_current_device"
              title={_t('71e82b1181604800a262')}
              desc={_t('335ef9f29a1d4000aba2')}
              icon={<ICMacOutlined size={24} />}
              rightIcon={
                <ICArrowRight2Outlined
                  size={isH5 ? 20 : 24}
                  style={{ transform: isRTL ? 'scale(-1)' : 'none' }}
                />
              }
              onActive={async () => {
                if (loading) {
                  return;
                }
                try {
                  setLoading(true);
                  if (isGlobal) {
                    trackClick(['verifyMethod', 'currentEquipment']);
                    await dispatch({
                      type: 'kyc/postCountryAndIdentity',
                      payload: { regionCode: region, identityType, userState },
                    });
                    replaceWithBackUrl('/account/kyc/setup/ocr', query.backUrl);
                  } else {
                    replaceWithBackUrl('/account/kyc/home', query.backUrl);
                  }
                } catch (err) {
                  console.error(err);
                } finally {
                  setLoading(false);
                }
              }}
            />
          </List>
        </Wrapper>
      </Container>
      {isGlobal ? <KycRetain /> : null}
    </Spin>
  );
};

const MethodWithLayout = (props) => {
  return (
    <ErrorBoundary scene={SCENE_MAP.kyc.kyc_setup_method}>
      <AccountLayout>
        <Method {...props} />
      </AccountLayout>
    </ErrorBoundary>
  );
};

export default withRouter()(MethodWithLayout);
