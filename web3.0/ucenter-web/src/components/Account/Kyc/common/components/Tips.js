/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { InfoOutlined } from '@kux/icons';
import { useColor, useFont } from '@kux/mui';
import _ from 'lodash';
import { useStyle } from './style.js';

const Tips = ({ topContent, bottomContent }) => {
  const color = useColor();
  const font = useFont();
  const classes = useStyle({ color, font });
  useLocale();

  return (
    <div css={classes.tipsWrapper}>
      <div css={classes.topWrapper}>
        <div css={classes.iconWrapper}>
          <InfoOutlined size={14} color={color.primary} css={classes.icon} />
        </div>
        <div css={classes.data}>
          <div>{topContent}</div>
        </div>
      </div>
      <div css={classes.bottomWrapper}>
        {_.map(bottomContent, (item) => {
          return <div style={{ color: color.text }}>{item}</div>;
        })}
      </div>
    </div>
  );
};

export default Tips;
