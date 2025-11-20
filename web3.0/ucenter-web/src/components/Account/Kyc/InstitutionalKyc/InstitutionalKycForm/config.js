/**
 * Owner: tiger@kupotech.com
 */
import { _t } from 'tools/i18n';

export const getValidateLengthRule = (len) => {
  return [
    {
      validator(_, value) {
        if (value?.length > len) {
          return Promise.reject(new Error(_t('af0b5f357ec64000acd6', { len })));
        }
        return Promise.resolve();
      },
    },
  ];
};
