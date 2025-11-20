/**
 * Owner: tiger@kupotech.com
 * 合规2.0
 */
import JsBridge from '@knb/native-bridge';
import { TaxInfoCollect } from '@kucoin-gbiz-next/kyc';
import { styled, useTheme } from '@kux/mui';
import UserRoot from 'components/UserRoot';
import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.overlay};
`;

export default () => {
  const theme = useTheme();
  const timerRef = useRef();
  const isInApp = JsBridge.isApp();

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
    <UserRoot>
      <Helmet>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
      </Helmet>
      <Wrapper data-inspector="account_kyc_tax_page">
        <TaxInfoCollect theme={theme.currentTheme} />
      </Wrapper>
    </UserRoot>
  );
};
