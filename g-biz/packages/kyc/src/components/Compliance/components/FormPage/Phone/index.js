/**
 * Owner: tiger@kupotech.com
 */
import { Input, Form, styled, Divider } from '@kux/mui';
import PhoneArea from './PhoneArea';
import useLang from '../../../../../hookTool/useLang';

const { FormItem } = Form;

const Phone = styled.div``;
const PrefixBefore = styled.div`
  display: flex;
  align-items: center;
  /* .KuxForm-itemHelp {
    display: none;
  } */
`;
const DividerIcon = styled(Divider)`
  color: ${({ theme }) => theme.colors.cover12};
  height: 21px;
  margin: 0px 8px;
`;

export default ({ extraInitialValue, complianceMetaCode, ...props }) => {
  const { _t } = useLang();

  return (
    <Phone>
      <Input
        {...props}
        prefix={
          <PrefixBefore>
            <FormItem
              noStyle
              name="phoneArea"
              initialValue={extraInitialValue}
              rules={[{ required: true, message: _t('mR67a17ZzFE7hFLdM9tJvJ') }]}
            >
              <PhoneArea complianceMetaCode={complianceMetaCode} />
            </FormItem>
            <DividerIcon type="vertical" />
          </PrefixBefore>
        }
      />
    </Phone>
  );
};
