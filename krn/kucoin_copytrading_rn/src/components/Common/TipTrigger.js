/**
 * Owner: Ray.Lee@kupotech.com
 */
import {useDebounceFn} from 'ahooks';
import React, {memo, useCallback, useRef, useState} from 'react';
import styled from '@emotion/native';
import {Confirm} from '@krn/ui';

import useLang from 'hooks/useLang';
import {BorderH, ExclamationIcon} from './SvgIcon';

const Label = styled.View`
  align-items: center;
  position: relative;
`;

const Wrapper = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const IconBox = styled.View`
  margin-left: 2px;
`;

const Content = styled.Text`
  font-size: 14px;
  line-height: 18px;
  color: ${({theme, color}) => theme.colorV2[color || 'text40']};
`;

const LongTextWrapper = styled.ScrollView`
  max-height: 400px;
  overflow: scroll;
`;
const TextWrapper = styled.Text`
  color: ${({theme}) => theme.colorV2.text60};
  font-size: 16px;
  line-height: 24px;
`;

/**
 * TipTrigger
 */
const TipTrigger = memo(props => {
  const {
    id = 'tip-confirm',
    text,
    textColor,
    title,
    isLongText = false, // 很长的文字内容
    message,
    textStyle,
    wrapperStyle,
    showIcon = true,
    showUnderLine = false,
    children = null,
    customIcon = null,
    ...restProps
  } = props;
  const [show, setShow] = useState(false);
  const {_t} = useLang();
  const isValidChildren = children !== null && React.isValidElement(children);
  const isPressLock = useRef();

  const handlePress = useCallback(async () => {
    if (isPressLock.current) return;
    setShow(false);

    setShow(true);
    isPressLock.current = true;
  }, []);

  const onClose = useCallback(() => {
    isPressLock.current = false;
    setShow(false);
  }, []);

  const {run} = useDebounceFn(handlePress, {
    wait: 300,
    leading: true,
  });
  const _message = isLongText ? (
    <LongTextWrapper showsVerticalScrollIndicator={false}>
      <TextWrapper>{message}</TextWrapper>
    </LongTextWrapper>
  ) : (
    message
  );

  return (
    <>
      <Wrapper
        activeOpacity={0.6}
        onPress={run}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        style={wrapperStyle}>
        {!!(!isValidChildren && text) && (
          <Label>
            <Content style={textStyle} color={textColor}>
              {text}
            </Content>
            {showUnderLine && <BorderH style={{marginTop: -1}} />}
          </Label>
        )}
        {children ? children : null}
        {showIcon && (
          <IconBox>{customIcon ? customIcon : <ExclamationIcon />}</IconBox>
        )}
      </Wrapper>
      {show && (
        <Confirm
          id={`${id}`}
          show={show}
          message={_message}
          title={title || text}
          onConfirm={onClose}
          confirmText={_t('bhfjS7Y6HXsKuQzsXGDpgQ')}
          {...restProps}
        />
      )}
    </>
  );
});

export default memo(TipTrigger);
