/**
 * Owner: iron@kupotech.com
 */
import React from 'react';
import { Checkbox } from '@kufox/mui';
import { useTranslation } from '@tools/i18n';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';

const CustomCheckbox = React.forwardRef(
  ({ infoLink, infoContent, classes, onChange, value }, ref) => {
    const { t: _t } = useTranslation('kyc');
    const onCheck = (e) => {
      const { checked } = e.target;
      // eslint-disable-next-line no-unused-expressions
      onChange && typeof onChange === 'function' && onChange(checked);
    };

    const readNotice = () => {
      // eslint-disable-next-line no-unused-expressions
      onChange && typeof onChange === 'function' && onChange(true);
    };

    return (
      <Checkbox onChange={onCheck} checked={value || false} ref={ref}>
        <span css={classes.CheckboxLabel}>
          <span>{`${_t('kyc.account.sec.statement.read')} `}</span>
          <a
            href={queryPersistence.formatUrlWithStore(infoLink)}
            css={classes.userInfoLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={readNotice}
          >
            {infoContent}
          </a>
        </span>
      </Checkbox>
    );
  },
);

export default CustomCheckbox;
