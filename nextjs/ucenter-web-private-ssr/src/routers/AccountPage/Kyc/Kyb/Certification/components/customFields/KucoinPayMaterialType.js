/**
 * Owner: tiger@kupotech.com
 */
import { Form, Radio, styled } from '@kux/mui';
import { TOTAL_FIELDS, VERIFY_CONTAINER_CLASS_NAME } from 'routes/AccountPage/Kyc/config';
import { _t } from 'src/tools/i18n';
import useKybStatus from '../../../../hooks/useKybStatus';
import useRules from '../../hooks/useRules';
import { Layout, LayoutLeft } from '../styled';

const { FormItem } = Form;

const RadioWrapper = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 500;
  line-height: 130%;
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
  const { formData } = props;

  const { kybStatus, kybStatusEnum } = useKybStatus();
  const rules = useRules({
    name: TOTAL_FIELDS.detailContactorPhotoType,
    required: true,
    formData,
  });

  return (
    <Layout>
      <ExLayoutLeft style={{ gap: 0 }}>
        <Row className={VERIFY_CONTAINER_CLASS_NAME}>
          <RadioWrapper>
            <FormItem
              name={TOTAL_FIELDS.businessLicenseOrThirdWebsite}
              rules={rules}
              initialValue="1"
            >
              <ExGroupRadio
                value={formData?.[TOTAL_FIELDS.businessLicenseOrThirdWebsite]}
                size="small"
              >
                <Radio value="0">{_t('4c7fb8ac77cd4000acbf')}</Radio>
                <Radio value="1">{_t('5917b2c99fb94000a83c')}</Radio>
              </ExGroupRadio>
            </FormItem>
          </RadioWrapper>
        </Row>
      </ExLayoutLeft>
    </Layout>
  );
};

export default ContactDocument;
