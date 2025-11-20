/**
 * Owner: willen@kupotech.com
 */
import React, { memo } from 'react';
import { Button } from '@kufox/mui';
import CustomLoading from 'components/SpotNFT/CustomLoading';
import { _t } from 'tools/i18n';
import style from 'routes/SpotNFTPage/Collection/NFTList/style.less';
const Item = (props) => {
  const { data, loadedImgUrl, onItemClick, currentOpening, index, loadedIndex } = props;
  return (
    <div className={style.item}>
      {(!data.open || loadedImgUrl) && (
        <div className={style.imgContainer}>
          {!data.open && <img src={data.pictureUrl} alt="" />}
          {loadedImgUrl && <img src={loadedImgUrl} alt="" />}
          <div className={style.tag}>#{data.nftId}</div>
        </div>
      )}
      {data.open && !loadedImgUrl && (
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
            onClick={() => onItemClick(data, index, loadedIndex)}
            disabled={data.open || currentOpening !== null}
            size={'small'}
            loading={currentOpening === data.nftId}
          >
            {data.open ? _t('spot.nft.mystery.opend') : _t('spot.nft.mystery.open')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(Item);
