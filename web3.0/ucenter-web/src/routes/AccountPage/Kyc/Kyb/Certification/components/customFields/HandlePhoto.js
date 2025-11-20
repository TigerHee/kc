/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Box, useResponsive } from '@kux/mui';
import { useSelector } from 'react-redux';
import { TOTAL_FIELDS } from 'src/routes/AccountPage/Kyc/config';
import HandheldAttachmentExample from '../examples/HandheldAttachmentExample';
import { Layout, LayoutLeft, LayoutRight } from '../styled';
import UploadField from '../UploadField';

/** 联系人证件 */
const HandlePhone = (props) => {
  const kycCode = useSelector((state) => state.kyc?.kycCode);
  const rv = useResponsive();
  const isLG = !rv?.lg;

  return (
    <Layout>
      <LayoutLeft>
        <UploadField
          name={TOTAL_FIELDS.handlePhoto}
          required
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

export default HandlePhone;
