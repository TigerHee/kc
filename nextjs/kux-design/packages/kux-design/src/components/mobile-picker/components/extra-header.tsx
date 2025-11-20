import React from 'react';
import { clx } from '@/common/style';
import { ExtraHeaderProps, ExtraHeaderItem } from '../types';

const ExtraHeader: React.FC<ExtraHeaderProps> = ({ renderExtraHeader, onChange }) => {
  const handleChange = (date: [any, any]) => {
    onChange?.(date);
  };

  if (!renderExtraHeader) {
    return null;
  }

  if (React.isValidElement(renderExtraHeader)) {
    return renderExtraHeader;
  }

  if (Array.isArray(renderExtraHeader)) {
    return (
      <div className="kux-mobile-picker__extra-header">
        {(renderExtraHeader as ExtraHeaderItem[]).map((item) => (
          <div
            key={item.code}
            className={clx('kux-mobile-picker__extra-item', {
              'kux-mobile-picker__extra-item--selected': item.selected,
            })}
            onClick={() => handleChange(item.range)}
          >
            {item.label}
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default ExtraHeader; 