/**
 * Owner: june.lee@kupotech.com
 */

import JsBridge from '@knb/native-bridge';
import { ICQuestionOutlined, ICRewardsHubOutlined } from '@kux/icons';
import { _t } from 'src/tools/i18n';
import { FilterDialog, MoreOverlay } from '../../styledComponents';
import { skip2Faq, skip2Rules } from '../../util';

export const MoreActionDialog = ({ moreVisible, setMoreVisible }) => {
  const isInApp = JsBridge.isApp();
  return (
    <FilterDialog
      header={null}
      back={false}
      maskClosable={true}
      show={moreVisible}
      className="filterDialog"
      okText={null}
      cancelText={_t('cancel')}
      onCancel={() => setMoreVisible(false)}
      onClose={() => setMoreVisible(false)}
      cancelButtonProps={{ variant: 'contained', type: 'default', size: 'large' }}
      centeredFooterButton
      isInApp={isInApp}
    >
      <MoreOverlay>
        <div onClick={skip2Rules} role="button" className="item">
          <div className="icon">
            <ICRewardsHubOutlined />
          </div>
          <div className="text">{_t('inywqQqK8EBMCo5ZZrQGCh')}</div>
        </div>
        <div onClick={skip2Faq} role="button" className="item">
          <div className="icon">
            <ICQuestionOutlined />
          </div>
          <div className="text">{_t('hBhZfqGKdBW5XbvWQmxdBh')}</div>
        </div>
      </MoreOverlay>
    </FilterDialog>
  );
};
