import React from 'react';
import {View} from 'react-native';
import {css} from '@emotion/native';
import {useTheme} from '@krn/ui';

import useLang from 'hooks/useLang';
import {makePrivilegeDescList} from '../../constants';
import {ContentList} from './ContentList';
import {DescCard, DescRightIcon, DescTitle, DescWrap} from './styles';

const PrivilegeDesc = ({style}) => {
  const {_t} = useLang();
  const {type} = useTheme();
  const isDark = type !== 'light';
  const privilegeDescList = makePrivilegeDescList({_t, isDark});
  return (
    <View style={style}>
      {privilegeDescList.map((i, idx) => {
        const {title, contentList, iconSource} = i;
        return (
          <DescCard key={idx}>
            <View
              style={css`
                flex: 1;
              `}>
              <DescTitle>{title}</DescTitle>
              <DescWrap>
                <ContentList contentList={contentList} />
              </DescWrap>
            </View>
            <DescRightIcon source={iconSource} autoRotateDisable />
          </DescCard>
        );
      })}
    </View>
  );
};

export default PrivilegeDesc;
