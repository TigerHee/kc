/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { Form, Input } from '@kufox/mui';

import { useLang } from '../../hookTool';

export default ({ action }) => {
  const { t } = useLang();

  return (
    <Form.FormItem
      name={action}
      label={t('form_google_code')}
      rules={[
        { required: true, message: t('verify_2fa_required') },
        { type: 'string', pattern: /^\d{6}$/, message: t('verify_2fa_format') },
      ]}
      required={false}
    >
      <Input size="large" />
    </Form.FormItem>
  );
};
