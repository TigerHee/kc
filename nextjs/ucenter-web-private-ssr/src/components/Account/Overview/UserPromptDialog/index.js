/**
 * Owner: Judith.Zhu@kupotech.com
 */

import { Dialog } from '@kux/mui';
import useHtmlToReact from 'hooks/useHtmlToReact';
import { _t } from 'tools/i18n';

export default ({ prompt, onOk = () => null }) => {
  const { title, content } = prompt || {};
  const { eles } = useHtmlToReact({ html: content || '' });

  return (
    <Dialog
      open={!!content}
      title={title}
      cancelText={null}
      okText={_t('i.know')}
      showCloseX={false}
      onOk={onOk}
    >
      <div style={{ whiteSpace: 'pre-wrap' }}>{eles}</div>
    </Dialog>
  );
};
