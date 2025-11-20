/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Box, useResponsive } from '@kux/mui';
import { TOTAL_FIELDS, VERIFY_CONTAINER_CLASS_NAME } from 'src/routes/AccountPage/Kyc/config';
import { _t } from 'src/tools/i18n';
import { Layout, LayoutLeft, LayoutRight, WarningBox } from '../styled';
import UploadField from '../UploadField';

/** 董事证件 */
const DirectorCertificate = ({ required = true, ...props }) => {
  const rv = useResponsive();
  const isLG = !rv?.lg;

  const tips = <WarningBox>{_t('d6db3f24caf04000adc6')}</WarningBox>;

  return (
    <Layout>
      <LayoutLeft className={VERIFY_CONTAINER_CLASS_NAME}>
        <UploadField
          name={TOTAL_FIELDS.directorCertificate}
          required={required}
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

export default DirectorCertificate;
