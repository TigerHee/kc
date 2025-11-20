/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, {useState, useEffect} from 'react';
import {compareVersion, getNativeInfo} from 'utils/helper';
import {Platform} from 'react-native';

const HIDDEN_TEXTINPUT_VERSIONS = ['3.106.0', '3.106.5'];

const isAndroid = Platform.OS === 'android';

/**
 * android 等于 3.106.0 || 3.106.5 的版本时，ReactNative 的 TextInput 会导致应用崩溃
 * 需要引导用户去 googleplay 升级 App
 */
const useDisableTextInput = () => {
  const [shoudleDisabled, setShoudleDisabled] = useState(isAndroid);

  useEffect(() => {
    (async () => {
      const {version} = await getNativeInfo();

      const v =
        HIDDEN_TEXTINPUT_VERSIONS.some(
          item => compareVersion(version, item) === 0,
        ) && isAndroid;

      setShoudleDisabled(!!v);
    })();
  }, []);

  return shoudleDisabled;
};

export default useDisableTextInput;
