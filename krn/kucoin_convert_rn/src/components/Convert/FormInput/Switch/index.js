/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import styled from '@emotion/native';
import {TouchableOpacity} from 'react-native';
import light from 'assets/convert/switch_light.png';
import dark from 'assets/convert/switch_dark.png';
import ThemeImage from 'components/Common/ThemeImage';
import {Loading, useTheme} from '@krn/ui';

const Switch = styled.View`
  height: 4px;
  width: 100%;
  position: relative;
  z-index: 1;
`;

const BtnCont = styled.View`
  width: 32px;
  height: 32px;
  position: absolute;
  left: 50%;
  top: -14px;

  margin-left: -16px;
`;

const BtnIcon = styled(ThemeImage)`
  width: 32px;
  height: 32px;
  background: ${({theme}) => theme.colorV2.overlay};
  border-radius: 32px;
  overflow: hidden;
`;

export default ({onPress, compact, loading}) => {
  const theme = useTheme();

  const handlePress = () => {
    if (loading) {
      return;
    }

    onPress && onPress();
  };

  return (
    <Switch compact={compact}>
      <TouchableOpacity activeOpacity={0.6} onPress={handlePress}>
        <BtnCont>
          <Loading
            spin={loading}
            size="small"
            styles={{
              loadingMask: {
                backgroundColor: theme.colorV2.background,
                borderRadius: 100,
              },
            }}>
            <BtnIcon lightSrc={light} darkSrc={dark} />
          </Loading>
        </BtnCont>
      </TouchableOpacity>
    </Switch>
  );
};
