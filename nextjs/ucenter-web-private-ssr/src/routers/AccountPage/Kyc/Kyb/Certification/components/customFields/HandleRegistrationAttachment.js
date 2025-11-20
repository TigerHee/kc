/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Box } from '@kux/mui';
import { useSelector } from 'react-redux';
import { TOTAL_FIELDS, VERIFY_CONTAINER_CLASS_NAME } from 'routes/AccountPage/Kyc/config';
import HandheldAttachmentExample from '../examples/HandheldAttachmentExample';
import { Layout, LayoutLeft, LayoutRight } from '../styled';
import UploadField from '../UploadField';

import useResponsiveSSR from '@/hooks/useResponsiveSSR';

/** 公司註冊證書照或营业执照 */
const HandleRegistrationAttachment = (props) => {
  const rv = useResponsiveSSR();
  const isLG = !rv?.lg;
  const kycCode = useSelector((state) => state.kyc?.kycCode);

  return (
    <Layout>
      <LayoutLeft className={VERIFY_CONTAINER_CLASS_NAME}>
        <UploadField
          name={TOTAL_FIELDS.handleRegistrationAttachment}
          required
          onlyImage
          bottomSlot={
            isLG ? (
              <>
                <Box size={20} />
                <HandheldAttachmentExample kycCode={kycCode} />
              </>
            ) : null
          }
          {...props}
        />
      </LayoutLeft>
      <LayoutRight>{!isLG ? <HandheldAttachmentExample kycCode={kycCode} /> : null}</LayoutRight>
    </Layout>
  );
};

export default HandleRegistrationAttachment;
