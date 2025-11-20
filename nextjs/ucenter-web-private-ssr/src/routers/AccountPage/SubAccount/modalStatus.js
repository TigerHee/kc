/**
 * Owner: willen@kupotech.com
 */
import { Dialog } from '@kux/mui';
import { injectLocale } from 'components/LoadLocale';
import { _t } from 'tools/i18n';
import ModalBase from './modalBase';

@injectLocale
export default class ModalStatus extends ModalBase {
  render() {
    const { visible, curStatus, curItem = {}, ...rest } = this.props;
    const title = curStatus ? 'subaccount.opt.freezeAccount' : 'subaccount.opt.unfreeze';
    return (
      <Dialog
        open={visible}
        {...rest}
        title={_t(title)}
        okText={_t('confirm')}
        cancelText={_t('cancel')}
        style={{ margin: 24 }}
      >
        {curStatus
          ? _t('subaccount.warning.freezeAccount', { account: curItem.subName })
          : _t('confirm')}
      </Dialog>
    );
  }
}

// export default ModalStatus;
