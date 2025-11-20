import {useCallback, useEffect, useRef, useState} from 'react';
import {exitRN} from '@krn/bridge';

import {useNavigation, useRoute} from 'hooks/hybridNavigation';

const useGoBack = () => {
  const navigation = useNavigation();

  const canGoBack = navigation.canGoBack();

  const {name} = useRoute();

  const beforeDoBackRouteName = useRef('');

  const [isExecGoBack, setIsExecGoBack] = useState(false);

  const goBack = useCallback(() => {
    if (!canGoBack) {
      exitRN();
      return;
    }
    // 处理 独立 rn页面 返回路由栈未出栈 无法退出问题
    beforeDoBackRouteName.current = name;
    navigation.goBack();

    setIsExecGoBack(true);
  }, [canGoBack, name, navigation]);

  useEffect(() => {
    if (!isExecGoBack) return;

    if (name === isExecGoBack) {
      exitRN();
    }
  }, [isExecGoBack, name]);

  return goBack;
};

export default useGoBack;
