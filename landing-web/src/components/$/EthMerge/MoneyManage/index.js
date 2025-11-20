/**
 * Owner: jesse.shao@kupotech.com
 */
import { useSelector } from 'dva';
import React from 'react';
import { _t } from 'src/utils/lang';
import ProductCard from './ProductCard';
import { Index, List, SectionHeader } from './StyledComps';

const MoneyManage = () => {
  const poolStakingProducts = useSelector(state => state.ethMerge.poolStakingProducts || []);
  return (
    !!poolStakingProducts.length && (
      <Index>
        <SectionHeader>{_t('4tyXKhsLfgnjZaqXEpLFDX')}</SectionHeader>
        <List>
          {poolStakingProducts.map(product => {
            return <ProductCard key={product.name} product={product} />;
          })}
        </List>
      </Index>
    )
  );
};

MoneyManage.propTypes = {};

MoneyManage.defaultProps = {};

export default MoneyManage;
