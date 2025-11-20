/**
 * Owner: roger@kupotech.com
 */
import React, { FC } from 'react';
import round from 'lodash-es/round';
import { toPercent } from 'tools/math';
import { formatLangNumber } from '../../common/tools';
import styles from './styles.module.scss'


interface PriceRateProps {
    value: number | string;
    price: number | string;
    lang: string;
}
// value 为涨跌幅度，前端处理为百分比，price 为价格
const PriceRate: FC<PriceRateProps> = ({ value = 0, price, lang }) => {

    if (typeof value !== 'number') {
        value = +value;
    }
    let color = 'var(--kux-text40)';
    let prefix = '';
    if (value > 0) {
        color = '#01BC8D';
        prefix = '+';
    } else if (value < 0) {
        color = 'var(--kux-brandRed)';
    }

    // 价格有可能为-1，认为是--
    const priceNumber = price && Number(price) >= 0 ? formatLangNumber(price) : '--';
    return (
        <div className={styles.wrapper}>
            <span className={styles.priceWrapper}>{priceNumber}</span>
            <span className={styles.rateWrapper} style={{ color }}>
                {prefix}
                {toPercent(round(value, 4), lang)}
            </span>
        </div>
    );
};

export default PriceRate;
