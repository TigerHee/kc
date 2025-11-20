/**
 * Owner: roger@kupotech.com
 */

import React, { useMemo } from 'react';
import clsx from 'clsx';
import { PREFIX } from '../../common/constants';
import { MARGIN_TABS_MAP } from './config';
import styles from './styles.module.scss';
import { useHeaderStore } from 'packages/header/Header/model';

interface SymbolFlagProps extends React.HTMLAttributes<HTMLSpanElement> {
    symbol: string;
    className?: string;
    type?: string;
}

export const namespace = `${PREFIX}_header`;

export default React.memo(
    // type 是杠杆类型
    ({ symbol, className, type = MARGIN_TABS_MAP.ALL.value, ...restProps }: SymbolFlagProps) => {
        const configs = useHeaderStore(state => state.configs) || {};
        const marginSymbolsMap = useHeaderStore(state => state.marginSymbolsMap) || {};

        const { isMarginEnabled, isolatedMaxLeverage } = marginSymbolsMap[symbol] || {};
        const marginMaxLeverage = isMarginEnabled ? (configs as any).maxLeverage : 0;

        const { getMaxLeverage = () => 0 } = MARGIN_TABS_MAP[type] || {};

        const maxLeverage = useMemo(() => {
            // 比较拿最大的显示
            return getMaxLeverage({ marginMaxLeverage, isolatedMaxLeverage });
        }, [getMaxLeverage, marginMaxLeverage, isolatedMaxLeverage]);

        const flag = useMemo(() => {
            return maxLeverage ? `${maxLeverage}X` : '';
        }, [maxLeverage]);

        return flag ? <span className={clsx(className, styles.wrapper)} {...restProps}>{flag}</span> : null;
    },
);
