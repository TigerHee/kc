import {useMemoizedFn} from 'ahooks';
import {StopTakeTypeEnum} from 'pages/FollowSetting/constant';
import {useRewriteFormDetail} from 'pages/FollowSetting/hooks/useRewriteFormDetail';
import {useCallback, useEffect, useState} from 'react';

export const useSwitchCheckManage = ({isProjectField = false, onChange}) => {
  const [isCheckSwitch, setIsCheckSwitch] = useState(false);

  const {data: configInfo} = useRewriteFormDetail();
  const onChangeSwitch = useMemoizedFn(() => {
    if (isCheckSwitch) {
      onChange({stopLossRatio: null, takeProfitRatio: null});
    }
    setIsCheckSwitch(!isCheckSwitch);
  });

  const handleRewriteConfigSwitch = useCallback(() => {
    const {stopTakeDetailVOList} = configInfo || {};
    const {takeProfitRatio, stopLossRatio} =
      stopTakeDetailVOList?.find(
        i =>
          i.type ===
          (isProjectField
            ? StopTakeTypeEnum.ACCOUNT
            : StopTakeTypeEnum.OVERALL),
      ) || {};

    setIsCheckSwitch(!!(takeProfitRatio || stopLossRatio));
  }, [configInfo, isProjectField]);

  useEffect(() => handleRewriteConfigSwitch(), [handleRewriteConfigSwitch]);

  return {
    isCheckSwitch,
    onChangeSwitch,
  };
};
