/**
 * Owner: odan.ou@kupotech.com
 */
import React, { memo } from 'react';
import { Dialog } from '@kufox/mui';
import { Button } from '@kufox/mui';
import { showDateTimeByZoneEight } from 'src/helper';
import { _t, _tHTML } from 'tools/i18n';

/**
 * 数据说明
 * @param {{
 *  visible: boolean,
 *  onClose(): void,
 *  title: string,
 *  auditTime: string,
 *  scope: string,
 * }} props
 */
const DetailDialog = (props) => {
  const {
    visible,
    onClose,
    title = _t('assets.por.verify.intro'),
    auditTime = '',
    scope = '--',
  } = props;
  return (
    <Dialog
      title={title}
      showCloseX={false}
      open={visible}
      footer={
        <div>
          <Button onClick={() => onClose()} size="small" fullWidth>
            {_t('i.know')}
          </Button>
        </div>
      }
    >
      <div>
        <div>
          {_t('assets.por.desc.auditDate', { auditDate: showDateTimeByZoneEight(auditTime) })}
        </div>
        <div>{_t('assets.por.desc.scope', { scope })}</div>
        <div style={{ lineHeight: 1.3, fontSize: 12, marginTop: 10 }}>
          <code>{_tHTML('assets.por.desc.content')}</code>
        </div>
      </div>
    </Dialog>
  );
};

export default memo(DetailDialog);
