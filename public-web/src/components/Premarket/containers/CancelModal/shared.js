/**
 * Owner: june.lee@kupotech.com
 */

import { Divider, styled } from '@kux/mui';
import clsx from 'clsx';
import NumberFormat from 'src/components/common/NumberFormat';
import {
  themeColorPrimary,
  themeColorSecondary,
  themeColorText,
  themeColorText40,
  themeFontX2L,
} from 'src/utils/themeSelector';
import { Tooltip } from '../../components';
import { StyledInfoCard, StyledInfoCardItem } from './styledComponents';

const StyledCurrencyWithUnit = styled.div`
  display: flex;
  gap: 4px;
  font-weight: 500;
  align-items: baseline;
  .value {
    color: ${themeColorText};
    &.negative {
      color: ${themeColorSecondary};
    }
    &.positive {
      color: ${themeColorPrimary};
    }
    &.return-value {
      color: ${themeColorText};
      font-weight: 700;
      ${themeFontX2L};
    }
  }
  .unit {
    color: ${themeColorText40};
  }
`;

export const CurrencyWithUnit = ({
  value,
  unit,
  negative,
  positive,
  numberFormatProps,
  classNames = {},
}) => {
  return (
    <StyledCurrencyWithUnit>
      <span className={clsx('value', { negative, positive }, classNames.value)}>
        {value ? (
          <>
            {negative ? '- ' : ''}
            {positive ? '+ ' : ''}
            <NumberFormat {...numberFormatProps}>{value}</NumberFormat>{' '}
          </>
        ) : (
          '--'
        )}
      </span>
      {unit && <span className={clsx('unit', classNames.unit)}>{unit}</span>}
    </StyledCurrencyWithUnit>
  );
};

export const InfoCard = ({ infoList }) => {
  return (
    <StyledInfoCard>
      <div className="container">
        {infoList.map((item, index) => {
          const { indented } = item;
          const indentStart = item.indented && (index === 0 || !infoList[index - 1].indented);
          const indentEnd =
            item.indented && (index === infoList.length - 1 || !infoList[index + 1].indented);
          if (item.type === 'item') {
            return (
              <StyledInfoCardItem
                key={item.key}
                className={clsx({ indented, indentStart, indentEnd })}
              >
                {item.explainText ? (
                  <Tooltip title={item.explainText}>
                    <div className={clsx('title', { indented, indentStart, indentEnd })}>
                      {item.title}
                    </div>
                  </Tooltip>
                ) : (
                  <div className={clsx('title noUnderline', { indented, indentStart, indentEnd })}>
                    {item.title}
                  </div>
                )}
                <div className="info">{item.renderValue()}</div>
              </StyledInfoCardItem>
            );
          } else if (item.type === 'divider') {
            return <Divider key={item.key} />;
          }
        })}
      </div>
    </StyledInfoCard>
  );
};
