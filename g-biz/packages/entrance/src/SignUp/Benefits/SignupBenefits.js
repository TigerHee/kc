/**
 * Owner: willen@kupotech.com
 */
import { useMemo, useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { styled, useTheme } from '@kux/mui';
import { numberFormat } from '@kux/mui/utils';
import { get } from '@tools/request';
import storage from '@utils/storage';
import useMultiSiteConfig from '@hooks/useMultiSiteConfig';
import { useCompliantShow } from '@packages/compliantCenter';
import { Trans } from '@tools/i18n';
import { tenantConfig } from '../../config/tenant';
import {
  SIGNUP_INDIA_REGISTRATION_SPM,
  SIGNUP_LEADING_CRYTO_CURRENCY_EXCHAGED_SPM,
  SIGNUP_PREFERRED_PROFESSIONALS_SPM,
  SIGNUP_REGISTRATION_REWARD_SPM,
} from '../../common/constants';
import { useLang, useHtmlToReact } from '../../hookTool';
import { dateTimeFormat, divide } from '../../common/tools';
import banner1 from '../../../static/reg_left_banner_1.png';
import banner1Dark from '../../../static/reg_left_banner_1_dark.png';
import banner2 from '../../../static/reg_left_banner_2.png';
import banner2Dark from '../../../static/reg_left_banner_2_dark.png';
import btcIcon from '../../../static/reg_left_btc.png';
import btcIconDark from '../../../static/reg_left_btc_dark.png';
import ethIcon from '../../../static/reg_left_eth.png';
import ethIconDark from '../../../static/reg_left_eth_dark.png';
import usdtIcon from '../../../static/reg_left_usdt.png';
import usdtIconDark from '../../../static/reg_left_usdt_dark.png';
import indiaTempDarkImg from '../../../static/india-temp-dark.png';
import indiaTempLightImg from '../../../static/india-temp-light.png';

const Container = styled.div`
  margin-top: 12px;
`;

const ImageWrapper = styled.div`
  width: 100%;
  overflow: hidden;
`;

const BaseRowItem = styled.div`
  display: flex;
  align-items: center;
`;

const TwoColsRowItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TopRowItem = styled(TwoColsRowItem)`
  margin-bottom: 16px;
`;

const RowItem1 = styled(TwoColsRowItem)`
  margin-bottom: 20px;
`;

const RowItem2 = styled(BaseRowItem)`
  margin: 0px 0 36px;
`;

const RowReserveAsset = styled(BaseRowItem)`
  margin: 28px 0 32px;
`;
const RowItem4 = styled(TwoColsRowItem)`
  margin: 32px 0 0;
`;

const RowItemDivider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.divider4};
  margin: ${({ margin }) => margin || 0};
`;

const RowItemLeft = styled.div``;
const BaseTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  font-size: 24px;
  font-weight: 600;
  line-height: 140%;
`;

const BaseDesc = styled.p`
  color: ${({ theme }) => theme.colors.text60};
  font-size: 16px;
  font-weight: 400;
  line-height: 140%;
  > span > span {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
  }
`;

const RowItem1Desc = styled(BaseDesc)`
  > span {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
  }
`;

const NumberItemBox = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 36px;
`;

const NumberItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100px;
`;
const NumberItemDivider = styled.div`
  width: 1px;
  height: 45px;
  background-color: ${({ theme }) => theme.colors.cover8};
`;
const NumberItemText = styled.h5`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 24px;
  font-weight: 600;
  line-height: 130%;
  margin-bottom: 2px;
`;
const NumberItemDesc = styled.p`
  color: ${({ theme }) => theme.colors.text40};
  font-size: 14px;
  font-weight: 400;
  line-height: 130%;
  text-align: center;
`;

const RowItemTitle1 = styled(BaseTitle)`
  margin-bottom: 16px;
`;

const RowItemTitle4 = styled(BaseTitle)`
  margin-bottom: 16px;
`;

const RowItemTitle2 = styled(BaseTitle)`
  margin-bottom: 22px;
`;

const RowReserveAssetTitle = styled(BaseTitle)`
  margin-bottom: 4px;
`;

const RowReserveAssetDesc = styled.p`
  font-size: 13px;
  line-height: 130%;
  margin-bottom: 24px;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text40};
`;

const CoinItemBox = styled.div`
  gap: 16px;
  display: flex;
  flex-wrap: wrap;
`;
const CoinItem = styled.div`
  min-width: 130px;
  min-height: 118px;
  border-radius: 8px;
  border: 1px solid
    ${({ theme, placeholder }) => (placeholder ? 'transparent' : theme.colors.cover12)};
  text-align: center;
  padding: 16px 28px;
  font-size: 0;
`;
const CoinItemIcon = styled.img`
  width: 36px;
  height: 36px;
  margin-bottom: 8px;
`;
const CoinItemText = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
`;
const CoinItemDesc = styled.div`
  color: ${({ theme }) => theme.colors.text40};
  font-size: 12px;
  font-weight: 400;
  line-height: 130%;
  width: 100px;
`;

const RowItemRight = styled.div``;

const IndiaTempImg = styled.img`
  width: 110px;
  height: 110px;
`;

// const TopItemImg = styled.img`
//   width: 540px;
//   margin-bottom: 32px;
// `;

// const MobileOperationImg = styled.img`
//   width: 100%;
//   margin-top: 9px;
// `;

const RowItemImg1 = styled.img`
  width: 124px;
  height: 124px;
`;
const RowItemImg2 = styled.img`
  width: 140px;
  height: 140px;
`;

export const SignupBenefits = (props) => {
  const { showMktContent, categories } = props;
  const [assetReserve, setAssetReserve] = useState({
    latestAuditDate: null,
    reserveAsset: [
      /**
       * {
       *   currency: string;
       *   reserveRate: number;
       * }
       */
    ],
  });
  const [guideTextJson, setGuideTextJson] = useState(null);
  const theme = useTheme();
  const dispatch = useDispatch();
  const dispatchRef = useRef(dispatch);
  dispatchRef.current = dispatch;

  const { t: _t } = useLang();

  const currentLang = storage.getItem('kucoinv2_lang');
  const { multiSiteConfig } = useMultiSiteConfig();

  // ip 是印度，则展示 “全球加密货币，印度的选择” 模块
  const showIndiaRegistration = useCompliantShow(SIGNUP_INDIA_REGISTRATION_SPM);
  // ip 是英国，则不展示 “Today’s registration reward” 模块
  const showRegistrationReward = useCompliantShow(SIGNUP_REGISTRATION_REWARD_SPM);
  // ip 是英国，则不展示 “专业投资者选择” 模块
  const showPreferredProfessionals = useCompliantShow(SIGNUP_PREFERRED_PROFESSIONALS_SPM);
  // ip 是英国，则不展示“全球顶级数字货币交易所”
  const showLeadingCyptocurrencyExchange = useCompliantShow(
    SIGNUP_LEADING_CRYTO_CURRENCY_EXCHAGED_SPM,
  );

  // 是否展示注册左侧交易所涉及全球站点营销文案，本地站中一般不展示
  const { showGlobalSiteContent } = tenantConfig.signup;

  // 将配置下发的注册引导内容转成 react 代码
  const guideTextDesc = useHtmlToReact({
    html: guideTextJson?.backupValues?.firstWindowDscA?.replace('\n', '<br>'),
  });

  // 配置下发的左侧注册引导内容
  const rowItemLeft = useMemo(() => {
    return (
      <>
        <RowItemTitle1>
          {guideTextJson ? guideTextJson?.backupValues?.firstWindowTitleA : null}
        </RowItemTitle1>
        {guideTextJson ? (
          <RowItem1Desc style={{ marginBottom: 4 }}>
            {guideTextDesc.eles ? guideTextDesc.eles : null}
          </RowItem1Desc>
        ) : null}
      </>
    );
  }, [guideTextJson, guideTextDesc]);

  // 多租户支持展示左侧注册引导 & 配置下发了左侧注册引导内容
  const showRowItem1 = useMemo(() => {
    return (
      guideTextJson?.backupValues?.firstWindowTitleA &&
      guideTextJson?.backupValues?.firstWindowDscA &&
      multiSiteConfig?.registerConfig?.supportRegisterGuide // 多租户配置系统
    );
  }, [
    guideTextJson?.backupValues?.firstWindowDscA,
    guideTextJson?.backupValues?.firstWindowTitleA,
    multiSiteConfig?.registerConfig?.supportRegisterGuide,
  ]);

  // 隐藏营销内容 “Today’s registration reward” 模块
  const isHiddenMktContent = useMemo(() => {
    // showRegistrationReward (ip 是英国)则为 false, 所以如果没有获取到国家码，或者不是英国，展示
    // 或者admin接口未返回内容（澳大利亚），或者展业中台根据 ip 国家返回屏蔽营销内容
    const res = !showRegistrationReward || !showRowItem1 || !showMktContent;
    return res;
  }, [showRegistrationReward, showRowItem1, showMktContent]);

  // 1:1 储备金模块 中涉及币种的图片
  const CoinIcons = useMemo(() => {
    return theme?.currentTheme === 'dark'
      ? {
          BTC: btcIconDark,
          ETH: ethIconDark,
          USDT: usdtIconDark,
        }
      : {
          BTC: btcIcon,
          ETH: ethIcon,
          USDT: usdtIcon,
        };
  }, [theme]);

  useEffect(() => {
    const getAssetReserve = async () => {
      const cache = storage.getItem('kucoinv2_cache_assetReserve');
      // 持久化1天
      if (cache && +cache.expireTime > Date.now()) {
        setAssetReserve(cache.data);
      } else {
        const { data } = await get('/asset-front/proof-of-reserves/asset-reserve');
        if (data) {
          // 因为要持久化到本地，做一下数据简化
          const minifyData = {
            latestAuditDate: data.latestAuditDate,
            reserveAsset: data.reserveAsset?.map((i) => {
              return { currency: i.currency, reserveRate: i.reserveRate };
            }),
          };
          storage.setItem('kucoinv2_cache_assetReserve', {
            expireTime: Date.now() + 24 * 60 * 60 * 1000,
            data: minifyData,
          });
          setAssetReserve(minifyData);
        }
      }
    };
    getAssetReserve();
  }, []);

  useEffect(() => {
    // 请求注册引导配置信息
    async function fetchGuideText() {
      try {
        const { data } = await get('/growth-config/get/client/config/codes', {
          businessLine: 'ucenter',
          codes: 'web202312homepagePop',
        });
        if (data?.properties?.[0]?.backupValues) {
          setGuideTextJson(data.properties[0]);
        }
      } catch (error) {
        console.error('getRegGuideTextApi failed:', error);
      }
    }
    if (!guideTextJson) {
      fetchGuideText();
    }
  }, [guideTextJson]);

  // 没有接口多租户配置，则不展示
  if (!multiSiteConfig) {
    return null;
  }

  return (
    <Container>
      {/* “全球加密货币，印度的选择” 模块 */}
      {showIndiaRegistration && (
        <>
          <TopRowItem data-inspector="signup_left_india_module">
            <RowItemLeft>
              <RowItemTitle1>{_t('4e3f3d75635a4000adbb')}</RowItemTitle1>
              <RowItem1Desc>{_t('a51f9862bbbd4000ac6d')}</RowItem1Desc>
            </RowItemLeft>
            {/* <RowItemRight>
              <IndiaTempImg
                src={theme?.currentTheme === 'dark' ? indiaTempDarkImg : indiaTempLightImg}
              />
            </RowItemRight> */}
          </TopRowItem>
          <RowItemDivider margin="0 0 32px" />
        </>
      )}
      {/* “Today’s registration reward” 今日注册奖励模块 */}
      {isHiddenMktContent ? null : (
        <>
          <RowItem1 data-inspector="signup_left_mtk_content">
            <RowItemLeft>{rowItemLeft}</RowItemLeft>
            <RowItemRight>
              <RowItemImg1
                data-inspector="signup_left_top_img"
                src={theme?.currentTheme === 'dark' ? banner1Dark : banner1}
              />
            </RowItemRight>
          </RowItem1>
          <RowItemDivider margin="0 0 32px" />
        </>
      )}
      {/* “专业投资者选择” 模块 */}
      {!showPreferredProfessionals || !showGlobalSiteContent ? null : (
        <>
          <RowItem2 data-inspector="signup_left_text1">
            <RowItemLeft>
              <RowItemTitle2>{_t('hVsbkgkbhwdppgSy7pTxfj')}</RowItemTitle2>
              <NumberItemBox>
                <NumberItem>
                  <NumberItemText>
                    &gt; {numberFormat({ number: 200, lang: currentLang })}
                  </NumberItemText>
                  <NumberItemDesc>{_t('nX2fKNob7ET9YF9sajDb7u')}</NumberItemDesc>
                </NumberItem>
                <NumberItemDivider />
                <NumberItem>
                  <NumberItemText>
                    &gt; {numberFormat({ number: 1300, lang: currentLang })}
                  </NumberItemText>
                  <NumberItemDesc>{_t('9cxpApngg3RP4p3hMGVnEx')}</NumberItemDesc>
                </NumberItem>
                <NumberItemDivider />
                <NumberItem>
                  <NumberItemText>
                    &gt; {numberFormat({ number: 200, lang: currentLang })}
                  </NumberItemText>
                  <NumberItemDesc>{_t('8ZsPNXRXwYTbMgkHyeMsFi')}</NumberItemDesc>
                </NumberItem>
              </NumberItemBox>
            </RowItemLeft>
          </RowItem2>
          <RowItemDivider />
        </>
      )}
      {/* 1:1 储备金模块 */}
      {showGlobalSiteContent && (
        <RowReserveAsset data-inspector="signup_left_reserve">
          <RowItemLeft>
            <RowReserveAssetTitle>{_t('xpLffZDFSrbRjM7atbF9Rd')}</RowReserveAssetTitle>
            <RowReserveAssetDesc>
              {_t('mfGj3qAfyLXZZFUkxonUUu', {
                dateTime: dateTimeFormat({
                  currentLang,
                  children: assetReserve?.latestAuditDate,
                  options: { timeZone: 'Asia/Shanghai' },
                }),
              })}
            </RowReserveAssetDesc>
            <CoinItemBox>
              {['BTC', 'ETH', window._BASE_CURRENCY_].map((i) => {
                const one = assetReserve?.reserveAsset?.find((k) => k.currency === i);
                // 并且也要有该币种图片才展示
                if (one && one.currency && CoinIcons[one.currency]) {
                  const rateVal = one.reserveRate
                    ? numberFormat({
                        options: { style: 'percent', maximumFractionDigits: 2 },
                        number: divide(one.reserveRate, 100),
                        lang: currentLang,
                        isPositive: true,
                      })
                    : '--';
                  return (
                    <CoinItem key={i}>
                      <CoinItemIcon src={CoinIcons[one.currency]} />
                      <CoinItemText>{rateVal}</CoinItemText>
                      <CoinItemDesc>
                        {_t('kSkeCA74e5bA2ariLPsYb6', {
                          currency: categories?.[one.currency]?.currencyName || one.currency,
                        })}
                      </CoinItemDesc>
                    </CoinItem>
                  );
                }
                return <CoinItem key={i} placeholder="true" />;
              })}
            </CoinItemBox>
          </RowItemLeft>
        </RowReserveAsset>
      )}
      {/* “全球顶级数字货币交易所” 模块 */}
      {!showLeadingCyptocurrencyExchange || !showGlobalSiteContent ? null : (
        <>
          <RowItemDivider />
          <RowItem4 data-inspector="signup_left_text2">
            <RowItemLeft>
              <RowItemTitle4>{_t('c3SRHUWaJViVLvkdD4mvk3')}</RowItemTitle4>
              <BaseDesc style={{ marginBottom: 4 }}>
                <Trans
                  i18nKey="8oU6QF41UPsPzAWSZGzcUb"
                  ns="entrance"
                  components={{
                    span: <span className="highlight" />,
                  }}
                />
              </BaseDesc>
              <BaseDesc>
                <Trans
                  i18nKey="8gXdRQpQ1EYdPruAyzsuGb"
                  ns="entrance"
                  components={{
                    span: <span className="highlight" />,
                  }}
                />
              </BaseDesc>
            </RowItemLeft>
            <RowItemRight>
              {/* <RowItemImg2 src={theme?.currentTheme === 'dark' ? banner2Dark : banner2} /> */}
            </RowItemRight>
          </RowItem4>
        </>
      )}
      {/* 多租户下发注册引导图片 */}
      {multiSiteConfig?.registerConfig?.registerPageContextUrl &&
      tenantConfig.signup.isShowRegisterImg ? (
        <ImageWrapper>
          <img
            src={multiSiteConfig?.registerConfig?.registerPageContextUrl}
            alt="site-register-img"
          />
        </ImageWrapper>
      ) : null}
    </Container>
  );
};
