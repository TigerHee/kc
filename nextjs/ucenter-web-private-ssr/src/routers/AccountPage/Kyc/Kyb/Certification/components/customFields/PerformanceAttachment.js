/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Box } from '@kux/mui';
import { TOTAL_FIELDS, VERIFY_CONTAINER_CLASS_NAME } from 'routes/AccountPage/Kyc/config';
import { _t } from 'src/tools/i18n';
import { Layout, LayoutLeft, LayoutRight, WarningBox } from '../styled';
import UploadField from '../UploadField';

import useResponsiveSSR from '@/hooks/useResponsiveSSR';

/** 履约承诺协议 */
const PerformanceAttachment = (props) => {
  const rv = useResponsiveSSR();
  const isLG = !rv?.lg;

  const tips = <WarningBox>{_t('ec25576a0bc64000a572')}</WarningBox>;

  return (
    <Layout>
      <LayoutLeft className={VERIFY_CONTAINER_CLASS_NAME}>
        <UploadField
          name={TOTAL_FIELDS.performanceAttachment}
          required
          tips={isLG ? tips : null}
          {...props}
        />
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
