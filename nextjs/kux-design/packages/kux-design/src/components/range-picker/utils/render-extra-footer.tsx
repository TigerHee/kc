import React from 'react';
import { Moment } from 'moment';
import { ExtraFooterItem } from '../types';
import { ExtraFooter, ExtraItem } from '../components/extra-footer';

interface ConfigExtraActionItem {
  code: string;
  label: string;
  index: number;
  range: Moment[];
}

interface RenderExtraFooterProps {
  renderExtraFooter: React.ReactNode | ExtraFooterItem[] | ConfigExtraActionItem[] | (() => React.ReactNode);
  showExtraFooter: boolean;
  onExtraChange: (range: [Moment, Moment]) => void;
}

export function renderExtraFooter({
  renderExtraFooter,
  showExtraFooter,
  onExtraChange,
}: RenderExtraFooterProps): React.ReactNode {
  if (!renderExtraFooter || !showExtraFooter) {
    return null;
  }

  if (React.isValidElement(renderExtraFooter)) {
    return renderExtraFooter;
  }

  if (Array.isArray(renderExtraFooter)) {
    return (
      <ExtraFooter className="kux-range-picker__extra-footer">
        {(renderExtraFooter as ExtraFooterItem[]).map((item) => (
          <ExtraItem
            key={item.code}
            onClick={() => onExtraChange(item.range)}
            selected={item.selected}
          >
            {item.label}
          </ExtraItem>
        ))}
      </ExtraFooter>
    );
  }

  return null;
} 