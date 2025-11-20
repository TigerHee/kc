import React, {memo} from 'react';
import {View} from 'react-native';
import {css} from '@emotion/native';

import TipTrigger from '../TipTrigger';
import {styles, TitleText} from './styles';

const Title = props => {
  const {
    title = null,
    tip,
    rightNode = null,
    style,
    titleWrapStyle,
    textStyle,
  } = props;
  const isTitleElement = React.isValidElement(title);
  const EnhanceTipWrap = tip ? TipTrigger : View;
  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          css`
            flex: 1;
          `,
          styles.titleWrap,
          titleWrapStyle,
        ]}>
        <EnhanceTipWrap
          showUnderLine={false}
          showIcon={true}
          text={title}
          message={tip}>
          {!isTitleElement ? (
            <TitleText style={textStyle}>{title || ''}</TitleText>
          ) : (
            title
          )}
        </EnhanceTipWrap>
      </View>
      <View
        style={css`
          margin-left: 6px;
        `}>
        {rightNode}
      </View>
    </View>
  );
};

export default memo(Title);
