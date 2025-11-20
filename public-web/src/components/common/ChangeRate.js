/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { NumberFormat } from '@kux/mui';

const ChangeRate = ({ value, className, type }) => {
  const { currentLang } = useLocale();
  if (typeof value !== 'number') {
    value = +value;
  }
  let color = '';
  let bgColor = '#01aa78';
  let prefix = '';
  if (value > 0) {
    color = 'color-high';
    prefix = '+';
  } else if (value < 0) {
    color = 'color-low';
    bgColor = '#FF495F';
  }
  let styles = {};
  switch (type) {
    case 'normal':
    default:
      break;
    case 'bordered':
      styles = {
        borderRadius: 2,
        backgroundColor: bgColor,
        padding: '2px 6px',
        color: '#fff',
      };
      break;
  }

  return (
    <span className={`${className} ${color}`} style={styles}>
      <NumberFormat
        options={{ style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }}
        lang={currentLang}
        isPositive={+value !== 0}
      >
        {value}
      </NumberFormat>
    </span>
  );
};

ChangeRate.defaultProps = {
  value: 0,
  className: '',
  type: 'normal',
};

export default ChangeRate;
