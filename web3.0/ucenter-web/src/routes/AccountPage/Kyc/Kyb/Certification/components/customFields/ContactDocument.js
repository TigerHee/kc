/**
 * Owner: vijay.zhou@kupotech.com
 */
import { Box, Checkbox, DatePicker, Form, Radio, styled, useResponsive } from '@kux/mui';
import {
  TOTAL_FIELDS,
  TOTAL_FIELD_INFOS,
  VERIFY_CONTAINER_CLASS_NAME,
} from 'src/routes/AccountPage/Kyc/config';
import { _t } from 'src/tools/i18n';
import useKybStatus from '../../../../hooks/useKybStatus';
import useRules from '../../hooks/useRules';
import AttachmentExample from '../examples/AttachmentExample';
import { Layout, LayoutLeft, LayoutRight } from '../styled';
import UploadField from '../UploadField';

const { FormItem } = Form;

const IDType = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 500;
  line-height: 130%;
`;
const PermanentlyOptions = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  height: 56px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    height: 48px;
  }
  .KuxForm-itemHelp {
    display: none;
  }
`;
const ExGroupRadio = styled(Radio.Group)`
  display: flex;
  flex-wrap: wrap;
  gap: 0 40px;
  .KuxRadio-wrapper {
    margin: 0;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    gap: 16px 32px;
  }
`;

const ExLayoutLeft = styled(LayoutLeft)`
  flex-direction: column;
  gap: 0;
`;
const Row = styled.div`
  display: flex;
  gap: 24px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    flex-direction: column;
    gap: 8px;
  }
`;

/** 联系人证件 */
const ContactDocument = (props) => {
  const { form, formData, rejectedReasons } = props;

  const { kybStatus, kybStatusEnum } = useKybStatus();
  const rv = useResponsive();
  const isLG = !rv?.lg;
  const isH5 = !rv?.sm;
  const size = isH5 ? 'large' : 'xlarge';
  const rules = useRules({
    name: TOTAL_FIELDS.detailContactorPhotoType,
    required: true,
    formData,
  });
  const rules2 = useRules({
    name: TOTAL_FIELDS.idExpireDate,
    required: true,
    formData,
  });

  const idExpireDateLabel = TOTAL_FIELD_INFOS[TOTAL_FIELDS.idExpireDate]?.title?.();

  return (
    <Layout>
      <ExLayoutLeft style={{ gap: 0 }}>
        <Row className={VERIFY_CONTAINER_CLASS_NAME}>
          <IDType>
            <span>{_t('7eee6adeff3f4800ac0b')}</span>
            <Box size={16} />
            <FormItem name={TOTAL_FIELDS.detailContactorPhotoType} rules={rules}>
              <ExGroupRadio value={formData?.detailContactorPhotoType} size="small">
                <Radio value="idCard">{_t('kyc.account.sec.certificate.idcard')}</Radio>
                <Radio value="passport">{_t('kyc.form.cardType.Passport')}</Radio>
                <Radio value="driverLicense">{_t('kyc.form.cardType.driver')}</Radio>
                <Radio value="residencePermit">{_t('25f5270e4c0a4000a83c')}</Radio>
              </ExGroupRadio>
            </FormItem>
            <Box size={8} />
          </IDType>
        </Row>
        {kybStatus !== kybStatusEnum.REJECTED || rejectedReasons[TOTAL_FIELDS.idExpireDate] ? (
          <Row className={VERIFY_CONTAINER_CLASS_NAME} style={{ flexDirection: 'row', gap: 24 }}>
            <FormItem label={idExpireDateLabel} name={TOTAL_FIELDS.idExpireDate} rules={rules2}>
              <DatePicker
                size={size}
                disabled={formData.idExpireDateIsPermanent}
                defaultValue={formData?.idExpireDate}
              />
            </FormItem>
            <PermanentlyOptions>
              <FormItem name="idExpireDateIsPermanent">
                <Checkbox
                  checked={formData.idExpireDateIsPermanent}
                  onChange={(e) => {
                    const { checked } = e.target;
                    form.setFieldsValue({
                      idExpireDateIsPermanent: checked,
                    });
                    if (checked) {
                      form.validateFields([TOTAL_FIELDS.idExpireDate]);
                    }
                  }}
                >
                  {_t('kyc.contact.information.certificate.permanent')}
                </Checkbox>
              </FormItem>
            </PermanentlyOptions>
          </Row>
        ) : null}
        <Row className={VERIFY_CONTAINER_CLASS_NAME}>
          <UploadField
            name={TOTAL_FIELDS.frontPhoto}
            required
            bottomSlot={
              isLG ? (
                <>
                  <Box size={20} />
                  <AttachmentExample />
                </>
              ) : null
            }
            {...props}
          />
          {formData?.detailContactorPhotoType !== 'passport' ? (
            <UploadField name={TOTAL_FIELDS.backPhoto} required {...props} />
          ) : null}
        </Row>
      </ExLayoutLeft>
      <LayoutRight style={{ justifyContent: 'flex-end' }}>
        {!isLG ? <AttachmentExample /> : null}
      </LayoutRight>
    </Layout>
  );
};

export default ContactDocument;
