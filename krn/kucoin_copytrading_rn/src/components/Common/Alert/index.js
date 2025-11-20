import React, {memo} from 'react';
import {View} from 'react-native';

import {TinyWarning} from '../SvgIcon';
import {AlertMsgText, AlertWrap} from './styles';

// icon	自定义图标，showIcon 为 true 时有效	ReactNode	-
// message	警告提示内容	ReactNode	-
// showIcon	是否显示辅助图标	boolean	false， 默认值为 true
// colorType	指定警告提示的样式，有四种选择 success、info、warning、error

// export const AlertColorType = {};

const Alert = props => {
  const {style, message} = props;

  if (!message) {
    return null;
  }

  return (
    <AlertWrap style={style}>
      <View style={{marginTop: 2}}>
        <TinyWarning />
      </View>
      <AlertMsgText>{message}</AlertMsgText>
    </AlertWrap>
  );
};

export default memo(Alert);
