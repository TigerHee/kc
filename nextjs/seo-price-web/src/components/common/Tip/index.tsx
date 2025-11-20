/**
 * Owner: will.wang@kupotech.com
 */
import { Tooltip, useTheme } from '@kux/mui-next';
import styles from './style.module.scss';
import { saTrackForBiz } from '@/tools/ga';

export default ({
  text = '',
  spm = ['currencyInformation', '1'],
  sensorsData = {},
  children,
  textStyle = {},
}) => {
  const theme = useTheme();

  return (
    <div className={styles.wrapper}>
      <Tooltip
        onMouseEnter={() => {
          try {
            // TODO 检查参数
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            saTrackForBiz({}, spm, sensorsData);
          } catch (e) {
            console.log('e', e);
          }
        }}
        title={text}
        overlayClassName={styles.tooltip}
        placement="top"
        trigger={theme.breakpoints.st === 'small' ? 'click' : 'hover'}
      >
        <div className={styles.textWrapper} style={textStyle}>{children}</div>
      </Tooltip>
    </div>
  );
};