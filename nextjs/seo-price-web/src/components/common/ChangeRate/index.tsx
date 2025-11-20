import { NumberFormat } from '@kux/mui-next';
import { useLang } from 'gbiz-next/hooks';
import { useMemo } from 'react';

const ChangeRate = ({ value: originalValue = 0, className = '', type = 'normal' }: {
  value: number | string;
  className?: string;
  type?: 'normal' | 'bordered';
}) => {
  const { currentLang } = useLang();
  
  const { color, value, styles } = useMemo(() => {
    let value = originalValue; 
    let color = '';
    let styles = {};
    
    if (typeof value !== 'number') {
      value = +value;
    }
    
    let bgColor = '#01aa78';
    let prefix = '';
    if (value > 0) {
      color = 'color-high';
      prefix = '+';
    } else if (value < 0) {
      color = 'color-low';
      bgColor = '#FF495F';
    }
    
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
          
    return { value, color, styles };
  }, [originalValue, type]);

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

export default ChangeRate;
