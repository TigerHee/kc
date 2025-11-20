/**
 * Owner: roger.chen@kupotech.com
 */
import styled from '@emotion/native';
import React from 'react';
import {Image} from 'react-native';
import {COLOR_LIST} from './config';

const WrapperView = styled.View`
  position: relative;
  justify-content: center;
`;
const BackGroundView = styled.View`
  flex-direction: row;
  align-items: center;
  position: absolute;
  z-index: 1;
`;
const ColorView = styled.View`
  flex-direction: row;
  align-items: center;
  position: absolute;
  z-index: 2;
  overflow: hidden;
`;

const HeatPlate = ({width, height, hotNum}) => {
  const number = Number(hotNum || 0);
  const totalWidth = width * 10;
  const num = (totalWidth * number) / 10 || 0;
  return (
    <WrapperView style={{width: totalWidth, height: height + 2}}>
      <BackGroundView>
        {new Array(10).fill(1).map((i, index) => {
          return (
            <Image
              key={index}
              source={require('assets/gembox/gray.png')}
              style={{width, height, resizeMode: 'contain'}}
            />
          );
        })}
      </BackGroundView>
      <ColorView
        style={{
          width: num,
        }}>
        {COLOR_LIST.map((i, index) => {
          if (i.type === 2) {
            return (
              <Image
                key={index}
                source={require('assets/gembox/green.png')}
                style={{width, height, resizeMode: 'contain'}}
              />
            );
          } else if (i.type === 3) {
            return (
              <Image
                key={index}
                source={require('assets/gembox/orange.png')}
                style={{width, height, resizeMode: 'contain'}}
              />
            );
          } else {
            return (
              <Image
                key={index}
                source={require('assets/gembox/red.png')}
                style={{width, height, resizeMode: 'contain'}}
              />
            );
          }
        })}
      </ColorView>
    </WrapperView>
  );
};
export default HeatPlate;
