/**
 * Owner: willen@kupotech.com
 */
import React, { memo } from 'react';
import { Button } from '@kufox/mui';
import CustomLoading from 'components/SpotNFT/CustomLoading';
import { _t } from 'tools/i18n';
import { includes } from 'lodash';
import { PurchaseTypeEnum } from '../../util';
import style from './style.less';

// status 0可提现 1 提现中 2 已提现
const Item = (props) => {
  const { data, loadedImgUrl, onItemClick } = props;
  return (
    <div className={style.item}>
      {(data.purchaseType !== PurchaseTypeEnum.mystery || loadedImgUrl) && (
        <div className={style.imgContainer}>
          {data.purchaseType !== PurchaseTypeEnum.mystery && <img src={data.nftLogoUrl} alt="" />}
          {loadedImgUrl && <img src={loadedImgUrl} alt="" />}
          <div className={style.tag}>#{data.nftId}</div>
        </div>
      )}
      {data.purchaseType === PurchaseTypeEnum.mystery && !loadedImgUrl && (
        <div className={style.loadingContainer}>
          <CustomLoading className={style.loading} />
        </div>
      )}
      <div className={style.infoContainer}>
        <div className={style.info}>
          <div className={style.price}>
            {data.price}
            {data.currency}
          </div>
          <div className={style.usd}>≈${data.baseCurrencyPrice}</div>
        </div>
        <div className={style.action}>
          <Button
            onClick={() => onItemClick(data)}
            disabled={!includes([0], data.status)}
            size={'small'}
          >
            {_t('igo.nft.collection.withdraw')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(Item);
