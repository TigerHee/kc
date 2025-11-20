/**
 * Owner: willen@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { styled, useTheme } from '@kux/mui';
import NoSSG from 'components/NoSSG';
import { getIsInApp, searchToJson } from 'helper';
import { useEffect, useMemo, useRef } from 'react';
import Skeleton from 'src/components/Skeleton';
import { reportRestrictMismatch } from 'src/tools/sentry';
import errorDrakImg from 'static/account/dialog-warn-info-dark.png';
import errorImg from 'static/account/dialog-warn-info.png';
import { addLangToPath, _t, _tHTML } from 'tools/i18n';

const PageWrapper = styled.div``;
const PageHeader = styled.div`
  height: 80px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider8};
  ${({ theme }) => theme.breakpoints.down('lg')} {
    height: 64px;
  }
`;

const LogoWrapper = styled.a`
  display: flex;
`;

const Logo = styled.img`
  width: 118px;
  margin-left: 32px;
  cursor: pointer;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    width: 101px;
    margin-left: 24px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-left: 16px;
  }
`;

const MainContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px 0;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 48px 20px 0;
  }
`;

const ErrorImg = styled.img`
  width: 136px;
  height: 136px;
  margin-bottom: 8px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 120px;
    height: 120px;
  }
`;
const Title = styled.h3`
  font-weight: 700;
  font-size: 28px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 24px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 16px;
    font-size: 22px;
  }
`;
const Desc = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 166%;
  color: ${({ theme }) => theme.colors.text60};
  margin-bottom: 14px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 10px;
    font-size: 15px;
    line-height: 160%;
  }
  strong {
    font-weight: 700;
  }
`;

const IPBox = styled.div`
  background-color: ${({ theme }) => theme.colors.cover4};
  color: ${({ theme }) => theme.colors.text60};
  width: 100%;
  word-break: break-all;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 400;
  line-height: 26.56px;
  margin-bottom: 24px;
  span {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
  }
`;

const SkeletonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const RestrictPage = () => {
  const isInApp = getIsInApp();
  const timerRef = useRef();

  const query = searchToJson();
  const theme = useTheme();

  const restrictDescInfo = useMemo(() => {
    return {
      CN: {
        title: <Title className="restrict-title">重要提示</Title>,
        description: (
          <>
            {query.ip ? (
              <IPBox className="restrict-ip" data-inspector="inspector_cdn_restrict_IP">
                当前IP:&nbsp;
                <span>{query.ip}</span>
              </IPBox>
            ) : null}
            <Desc className="restrict-desc" data-inspector="inspector_cdn_restrict_cn">
              檢測到您當前IP所在地來自<strong>中国大陆地区</strong>，根據當地
              <strong>法律法規及政策</strong>，我們<strong>無法為您提供服務</strong>
              ，很抱歉為您帶來不便。
            </Desc>
            <Desc className="restrict-desc">
              如您非該地區使用者，請在非服務受限區域使用我們的平臺，並通過KYC認證確認您的國籍身份。
            </Desc>
          </>
        ),
      },
      'US-NY': {
        title: <Title className="restrict-title">{_t('w6H4ziWz2Bkd4pfxz1HuHP')}</Title>,
        description: (
          <>
            {query.ip ? (
              <IPBox className="restrict-ip" data-inspector="inspector_cdn_restrict_IP">
                {_t('api.ip.current')}&nbsp;
                <span>{query.ip}</span>
              </IPBox>
            ) : null}
            <Desc className="restrict-desc" data-inspector="inspector_cdn_restrict_us-ny">
              {_tHTML('9JxM4gSiDTfoVk6F5aWhFo')}
            </Desc>
            <Desc className="restrict-desc">{_tHTML('jTFATagnR2TJCyU7ZRg3U8')}</Desc>
          </>
        ),
      },
      PAGE_COMPLIANCE: {
        title: <Title className="restrict-title">{_t('51e9299bf1b04000a1c3')}</Title>,
        description: (
          <>
            {query.ip ? (
              <IPBox className="restrict-ip" data-inspector="inspector_cdn_restrict_IP">
                {_t('api.ip.current')}&nbsp;
                <span>{query.ip}</span>
              </IPBox>
            ) : null}
            <Desc className="restrict-desc" data-inspector="inspector_cdn_restrict_PAGE_COMPLIANCE">
              {_tHTML('ef98f0b590b24000a420')}
            </Desc>
            <Desc className="restrict-desc">{_tHTML('c280920c99cc4000afb8')}</Desc>
          </>
        ),
      },
      CDN_FORBIDDEN: {
        title: <Title className="restrict-title">{_t('w6H4ziWz2Bkd4pfxz1HuHP')}</Title>,
        description: (
          <>
            {query.ip ? (
              <IPBox className="restrict-ip" data-inspector="inspector_cdn_restrict_IP">
                {_t('api.ip.current')}&nbsp;
                <span>{query.ip}</span>
              </IPBox>
            ) : null}
            <Desc className="restrict-desc" data-inspector="inspector_cdn_restrict_CDN_FORBIDDEN">
              {_tHTML('cdn.forbidden.content')}
            </Desc>
          </>
        ),
      },
    };
  }, [query.ip]);

  useEffect(() => {
    if (!restrictDescInfo[query.code]) {
      reportRestrictMismatch(query.code);
    }
  }, []);

  useEffect(() => {
    if (!isInApp) return;
    // 显示header, 防止其他页面导航过来后，header可能没有
    // 比如A页面设置不显示header，因为一些原因需要重定向到本页面，本页面是需要显示header的
    JsBridge.open({
      type: 'event',
      params: {
        name: 'updateHeader',
        visible: true,
      },
    });
  }, [isInApp]);

  useEffect(() => {
    if (isInApp) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        JsBridge.open({
          type: 'event',
          params: {
            name: 'onPageMount',
            dclTime: window.DCLTIME,
            pageType: window._useSSG ? 'SSG' : 'CSR', //'SSR|SSG|ISR|CSR'
          },
        });
      }, 200);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }
  }, [isInApp]);

  return (
    <PageWrapper data-inspector="restrict_page">
      <PageHeader>
        {isInApp ? (
          <Logo src={window._BRAND_LOGO_} />
        ) : (
          <LogoWrapper href={addLangToPath('/')} rel="noopener noreferrer">
            <Logo src={window._BRAND_LOGO_} />
          </LogoWrapper>
        )}
      </PageHeader>
      <MainContent>
        <ErrorImg src={theme.currentTheme === 'dark' ? errorDrakImg : errorImg} />
        {!restrictDescInfo[query.code]?.title && (
          <SkeletonWrapper>
            <Skeleton margin="0 0 24px 0" height="36px" width="40%" />
          </SkeletonWrapper>
        )}
        {!restrictDescInfo[query.code]?.description && <Skeleton margin="0 0 24px 0" />}
        {!restrictDescInfo[query.code]?.description && <Skeleton height="78px" />}
        <NoSSG>
          {restrictDescInfo[query.code]?.title}
          {restrictDescInfo[query.code]?.description}
        </NoSSG>
      </MainContent>
    </PageWrapper>
  );
};

export default RestrictPage;
