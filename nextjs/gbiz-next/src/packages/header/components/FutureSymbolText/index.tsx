/**
 * Owner: roger@kupotech.com
 */
import React, { FC, ReactNode } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { getSymbolText } from '../../../trade/futures';
import CoinIcon from '../CoinIcon';
import styles from './styles.module.scss';

export interface SymbolTextProps {
  contract?: {
    quoteCurrency?: string;
    symbol?: string;
    baseCurrency?: string;
    type?: string;
    settleDate?: number | null;
  };
  symbol: string;
  icon?: string;
  isTag: boolean;
  symbolNameClassName?: string;
  symbolTagClassName?: string;
}

dayjs.extend(utc);
dayjs.extend(customParseFormat);

const symbolToText = ({
  contract,
  symbol,
  icon,
  isTag,
  symbolNameClassName,
  symbolTagClassName,
}: SymbolTextProps): ReactNode => {
  if (!contract) {
    return symbol;
  }
  const { symbolName, base, tagName } = getSymbolText(contract, isTag);

  return (
    <>
      {icon && <CoinIcon icon={icon} coin={base} />}
      <div className={styles.content}>
        <div className={`${styles.symbolName} ${symbolNameClassName}`}>{symbolName}</div>
        {tagName && (
          <div className={`${styles.symbolTag} ${symbolTagClassName}`}>
            <span>{tagName}</span>
          </div>
        )}
      </div>
    </>
  );
};

const SymbolText: FC<SymbolTextProps> = ({
  contract,
  symbol,
  icon,
  isTag,
  symbolNameClassName,
  symbolTagClassName,
}) => {
  return (
    <div className={styles.wrapper}>
      {symbolToText({ contract, symbol, icon, isTag, symbolNameClassName, symbolTagClassName })}
    </div>
  );
};

export default SymbolText;
