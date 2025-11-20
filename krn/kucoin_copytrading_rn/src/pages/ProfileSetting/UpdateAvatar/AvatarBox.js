import React, {memo, useCallback} from 'react';

import {
  AvatarBox,
  AvatarIcon,
  AvatarTextBox,
  AvatarTextBoxInnerText,
} from '../styles';

export const SingleAvatar = memo(
  ({onChange, value, showAvatarText, avatarItem}) => {
    const {fileId, avatarIndex, avatarSource, isTextAvatarType} =
      avatarItem || {};

    const innerOnchange = useCallback(() => {
      onChange(fileId || '');
    }, [fileId, onChange]);

    return (
      <AvatarBox
        isActive={value === fileId}
        key={avatarIndex}
        onPress={innerOnchange}>
        {!isTextAvatarType ? (
          <AvatarIcon source={avatarSource} isActive={value === fileId} />
        ) : (
          <AvatarTextBox>
            <AvatarTextBoxInnerText>{showAvatarText}</AvatarTextBoxInnerText>
          </AvatarTextBox>
        )}
      </AvatarBox>
    );
  },
);
