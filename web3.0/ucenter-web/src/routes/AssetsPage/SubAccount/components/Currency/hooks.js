/**
 * Owner: solar@kupotech.com
 */
import map from 'lodash/map';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export function useAssetsList() {
  const assetsList = useSelector((state) => state.MF_assets_web_subAssets?.assetsList);
  const loaded = useSelector((state) => state.MF_assets_web_subAssets?.loaded);
  const subUserId = useSelector((state) => state.MF_assets_web_subAssets?.subUserId);
  const categories = useSelector((state) => state.categories);
  const dispatch = useDispatch();

  useEffect(() => {
    if (loaded && subUserId) {
      dispatch({
        type: 'MF_assets_web_subAssets/getAssetsListBySubUserId',
        payload: {
          subUserId,
        },
      });
    }
  }, [loaded, subUserId]);
  return {
    data: useMemo(() => {
      if (!assetsList) return [];
      return map(assetsList, (item) => ({
        ...categories[item.code],
        ...item,
      }));
    }, [assetsList, categories]),
    loading: useSelector((state) => state.loading.effects['subAssets/getAssetsListBySubUserId']),
  };
}
