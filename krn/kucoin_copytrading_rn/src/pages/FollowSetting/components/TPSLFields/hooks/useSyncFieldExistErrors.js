import {useCallback, useEffect} from 'react';

import {isValidNumber} from 'utils/helper';

export const useSyncFieldExistErrors = ({errors, onChange, value}) => {
  const syncFieldExistError = useCallback(() => {
    const {stopLossRatio, takeProfitRatio} = errors || {};

    const existError = Boolean(stopLossRatio || takeProfitRatio);
    const existValue =
      isValidNumber(value.stopLossRatio) ||
      isValidNumber(value.takeProfitRatio);

    const newValue = {
      ...value, // 保留现有值
      existError: existError && existValue,
    };
    onChange(newValue);
  }, [errors]);

  useEffect(() => {
    syncFieldExistError();
  }, [syncFieldExistError]);
};
