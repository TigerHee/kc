/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from 'hooks/useLocale';
import { InfoOutlined } from '@kux/icons';
import { ClassNames, useColor, useFont } from '@kux/mui';
import moment from 'moment';
import { _t, _tHTML } from 'src/tools/i18n';
import DemoCard from 'static/account/kyc/kyb/demo_card_detail.svg';
import { useStyle } from './style.js';

const HoldInfo = ({ code, type = 'personal' }) => {
  const color = useColor();
  const font = useFont();
  const classes = useStyle({ color, font });
  const date = moment().format('YYYY-MM-DD');
  useLocale();

  const tipKey =
    type === 'personal'
      ? 'kyc.mechanism.verify.company.verify.holding.upload'
      : 'kyc.mechanism.verify.company.verify.holding.mechanism_upload';

  return (
    <div css={classes.info}>
      <div css={classes.iconWrapper}>
        <InfoOutlined size={14} color={color.primary} css={classes.icon} />
      </div>
      <div css={classes.data}>
        <ClassNames>
          {({ css }) => (
            <div>
              {_tHTML(tipKey, { code, date, className: css(classes.bold) })}
              <span css={classes.demo}>
                {_t('kyc.mechanism.verify.company.verify.holding.damon')}
                <img src={DemoCard} alt="demo card" css={classes.demoCard} />
              </span>
            </div>
          )}
        </ClassNames>
      </div>
    </div>
  );
};

export default HoldInfo;
