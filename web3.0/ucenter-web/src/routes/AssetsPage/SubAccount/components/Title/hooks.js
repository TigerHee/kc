/**
 * Owner: solar@kupotech.com
 */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function useGetSubUserId(subUserName) {
  const dispatch = useDispatch();
  const loaded = useSelector((state) => state.MF_assets_web_subAssets?.loaded);
  useEffect(() => {
    if (loaded && subUserName) {
      dispatch({
        type: 'MF_assets_web_subAssets/getSubUserIdBySubUserName',
        payload: {
          subUserName,
        },
      });
    }
  }, [loaded, subUserName]);
}

export function useAssetsDetail(subUserName) {
  useGetSubUserId(subUserName);
  const balanceCurrency = useSelector((state) => state.user.balanceCurrency);
  const assetDetail = useSelector((state) => state.MF_assets_web_subAssets?.assetDetail);
  const loaded = useSelector((state) => state.MF_assets_web_subAssets?.loaded);
  const subUserId = useSelector((state) => state.MF_assets_web_subAssets?.subUserId);
  const dispatch = useDispatch();

  useEffect(() => {
    if (loaded && subUserId) {
      dispatch({
        type: 'MF_assets_web_subAssets/getAssetDetailBySubUserId',
        payload: {
          subUserId,
          balanceCurrency,
        },
      });
    }
  }, [loaded, subUserId]);
  return assetDetail || [];
}
