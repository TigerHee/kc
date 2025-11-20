/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Box } from '@kux/mui';
import { TOTAL_FIELDS, VERIFY_CONTAINER_CLASS_NAME } from 'routes/AccountPage/Kyc/config';
import { _t } from 'src/tools/i18n';
import { Layout, LayoutLeft, LayoutRight, WarningBox } from '../styled';
import UploadField from '../UploadField';

import useResponsiveSSR from '@/hooks/useResponsiveSSR';

/** 合伙人证件 */
const PartnerID = (props) => {
  const rv = useResponsiveSSR();
  const isLG = !rv?.lg;

  const tips = <WarningBox>{_t('d6db3f24caf04000adc6')}</WarningBox>;

  return (
    <Layout>
      <LayoutLeft className={VERIFY_CONTAINER_CLASS_NAME}>
        <UploadField
          name={TOTAL_FIELDS.partnerID}
          required
          onlyImage
          tips={
            isLG ? (
              <>
                {tips}
                <Box size={20} />
              </>
            ) : null
          }
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

export default PartnerID;
