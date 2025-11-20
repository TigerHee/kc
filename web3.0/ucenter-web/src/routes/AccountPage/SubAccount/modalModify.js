/**
 * Owner: willen@kupotech.com
 */
import { Dialog, Form, Input, styled } from '@kux/mui';
import { injectLocale } from 'components/LoadLocale';
import { _t } from 'tools/i18n';
import ModalBase from './modalBase';

const StyledDialog = styled(Dialog)`
  .KuxModalFooter-root {
    padding: 8px 32px 32px 32px;
  }
`;

const { FormItem, withForm } = Form;
@withForm()
@injectLocale
class ModalModify extends ModalBase {
  render() {
    const { visible, form, ...rest } = this.props;
    const isDisabled = this.checkIfCanSubmit();

    return (
      <StyledDialog
        open={visible}
        title={_t('subaccount.opt.modifyRemark')}
        onOk={this.handleOk}
        cancelText={null}
        okText={_t('save')}
        okButtonProps={{
          loading: rest.loading,
          disabled: isDisabled,
        }}
        style={{ margin: 24 }}
        {...rest}
      >
        <div style={{ paddingTop: '8px' }}>
          <FormItem
            label={_t('remark')}
            name="remarks"
            required={false}
            rules={[
              {
                required: true,
                message: _t('form.required'),
              },
            ]}
          >
            <Input
              size="xlarge"
              inputProps={{ maxLength: 24 }}
              placeholder={_t('subaccount.rule.remark')}
              fullWidth
              allowClear={true}
            />
          </FormItem>
        </div>
      </StyledDialog>
    );
  }
}

export default ModalModify;
