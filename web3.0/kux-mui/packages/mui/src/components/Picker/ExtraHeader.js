import React from 'react';
import useTheme from 'hooks/useTheme';
import map from 'lodash-es/map';
import clsx from 'clsx';
import { ExtraWrapper, ExtraItem } from './kux';

export default function ExtraHeader({ renderExtraHeader, onChange }) {
  const theme = useTheme();

  const handleChange = (date) => {
    onChange(date);
  };

  return renderExtraHeader ? (
    React.isValidElement(renderExtraHeader) ? (
      renderExtraHeader
    ) : (
      <ExtraWrapper className="KuxExtraFooter">
        {map(renderExtraHeader, (item) => (
          <ExtraItem
            key={item.code}
            theme={theme}
            onClick={() => handleChange(item.range)}
            className={clsx('KuxExtraFooter-item', { selected: item.selected })}
          >
            {item.label}
          </ExtraItem>
        ))}
      </ExtraWrapper>
    )
  ) : null;
}
