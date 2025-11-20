/**
 * Owner: tiger@kupotech.com
 */
import { Box } from '@kux/mui';
import { VERIFY_CONTAINER_CLASS_NAME } from 'routes/AccountPage/Kyc/config';
import { _t } from 'src/tools/i18n';
import { Layout, LayoutLeft, LayoutRight, WarningBox } from '../styled';
import TextField from '../TextField';

import useResponsiveSSR from '@/hooks/useResponsiveSSR';

const PerformanceAttachment = (props) => {
  const rv = useResponsiveSSR();
  const isLG = !rv?.lg;

  const tips = (
    <WarningBox>
      <ol>
        <li>{_t('14a50791bbf74000a5a7')}</li>
        <li>{_t('4b4efdf4eaf04800a054')}</li>
        <li>{_t('82c1aa3622174800a3a3')}</li>
      </ol>
    </WarningBox>
  );

  return (
    <Layout>
      <LayoutLeft className={VERIFY_CONTAINER_CLASS_NAME} style={{ flexDirection: 'column' }}>
        <TextField required {...props} />
        {isLG ? tips : null}
      </LayoutLeft>
      <LayoutRight>
        {!isLG ? (
          <>
            <Box size={24} />
            {tips}
          </>
        ) : null}
      </LayoutRight>
    </Layout>
  );
};

export default PerformanceAttachment;
