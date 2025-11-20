/**
 * Owner: vijay.zhou@kupotech.com
 */
import { useResponsive } from '@kux/mui';
import { TOTAL_FIELDS, VERIFY_CONTAINER_CLASS_NAME } from 'src/routes/AccountPage/Kyc/config';
import { _t } from 'src/tools/i18n';
import { COMPANY_TYPE } from '../../../../config';
import { Layout, LayoutLeft, LayoutRight, WarningBox } from '../styled';
import UploadField from '../UploadField';

/** 董事会决议 */
const BoardResolution = (props) => {
  const { formData } = props;
  const rv = useResponsive();
  const isLG = !rv?.lg;

  /** 是否合伙制企业 */
  const isPartnerShip = formData.companyType === COMPANY_TYPE.PARTNERSHIP;

  // 合伙制企业不展示 tips
  const tips = isPartnerShip ? null : <WarningBox>{_t('f17b188922394000a0ee')}</WarningBox>;

  return (
    <Layout>
      <LayoutLeft className={VERIFY_CONTAINER_CLASS_NAME}>
        <UploadField
          name={TOTAL_FIELDS.boardResolution}
          required
          tips={isLG ? tips : null}
          {...props}
        />
      </LayoutLeft>
      <LayoutRight>{!isLG ? tips : null}</LayoutRight>
    </Layout>
  );
};

export default BoardResolution;
