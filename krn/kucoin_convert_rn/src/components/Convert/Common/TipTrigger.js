/**
 * Owner: Ray.Lee@kupotech.com
 */
import React, {memo, useCallback, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import styled from '@emotion/native';
import {debounce} from 'lodash';
import infoImg from 'assets/convert/question.png';
import {Confirm} from '@krn/ui';
import useLang from 'hooks/useLang';
import useTracker from 'hooks/useTracker';

const Label = styled.View`
  flex-direction: row;
  align-items: center;
`;

const IconBox = styled.View`
  margin-left: 2px;
`;

const TextBox = styled.Text`
  font-size: 14px;
  line-height: 18px;
  color: ${({theme}) => theme.colorV2.text40};
`;

const InfoIcon = styled.Image`
  width: 14px;
  height: 14px;
`;

/**
 * TipTrigger
 */
const TipTrigger = memo(props => {
  const {id = 'tip-confirm', text, message, ...restProps} = props;
  const [show, setShow] = useState(false);
  const {_t} = useLang();
  const {onClickTrack} = useTracker();

  const handlePress = useCallback(
    debounce(() => {
      try {
        onClickTrack({
          blockId: 'convertInputNew',
          locationId: 5,
        });
      } catch (e) {}
      setShow(true);
    }, 200),
    [],
  );
  return (
    <>
      <TouchableOpacity activeOpacity={0.6} onPress={handlePress}>
        <Label>
          <TextBox>{text}</TextBox>
          <IconBox>
            <InfoIcon source={infoImg} />
          </IconBox>
        </Label>
      </TouchableOpacity>
      <Confirm
        id={id}
        show={show}
        message={message}
        title={text}
        onConfirm={() => setShow(false)}
        confirmText={_t('uC9N1XAbqFxHTc5Zd5mcPw')}
        {...restProps}
      />
    </>
  );
});

export default TipTrigger;
