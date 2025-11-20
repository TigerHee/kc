/**
 * Owner: odan.ou@kupotech.com
 */
import React, { memo } from 'react';
import { styled, Dialog } from '@kux/mui';
import { _t, _tHTML } from 'tools/i18n';

const RuleContent = styled.div`
  color: rgba(0, 13, 29, 0.68);
  padding-bottom: 32px;
  > span {
    > div {
      > div:not(:last-of-type) {
        margin-bottom: 18px;
      }
    }
  }
`;

const UseRules = (props) => {
  const { onClose } = props;
  return (
    <Dialog
      open
      onCancel={onClose}
      onOk={onClose}
      footer={null}
      title={_t('assets.margin.bonus.rules.des')}
    >
      <RuleContent>{_tHTML('assets.margin.bonus.detail.rules.des')}</RuleContent>
    </Dialog>
  );
};

export default memo(UseRules);
