import React, {memo, useMemo} from 'react';
import {Text} from 'react-native';

import useLang from 'hooks/useLang';

const DateTimeFormat = ({children, style, ...params}) => {
  const {dateTimeFormat} = useLang();

  const value = useMemo(
    () => dateTimeFormat(children, params),
    [children, dateTimeFormat, params],
  );

  return <Text style={style}>{value}</Text>;
};

export default memo(DateTimeFormat);
