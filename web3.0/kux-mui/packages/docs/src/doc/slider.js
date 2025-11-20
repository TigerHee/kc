/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { Slider } from '@kux/mui';
import Wrapper from './wrapper';

const { Range } = Slider;

const SliderDoc = () => {
  return (
    <div>
      <p>Base Slider</p>
      <Slider min={1} max={100} defaultValue={1} marks={{ 1: '1x', 25: '25x', 50: '50x', 75: '75x', 100: '100x' }} tipFormatter={tip => `\$${tip}`} />
      <p>Step First End</p>
      <Slider min={30} max={80} defaultValue={30} marks={{ 30: 30, 40: 40, 50: 50, 60: 60, 70: 70, 80: '80x' }} />
      {/* <Slider reverse defaultValue={20} marks={{ 30: 30, 50: 50, 80: 80 }} /> */}
      <p>Range Slider</p>
      <Range defaultValue={[16, 30]} />
      <p>Disabled Slider</p>
      <Slider defaultValue={20} disabled />
      <p>Disabled Range</p>
      <Range defaultValue={[16, 30]} disabled />

      <p>small size</p>
      <p>Base Slider</p>
      <Slider min={1} max={100} defaultValue={1} marks={{ 1: '1', 25: '25%', 50: '50x', 75: '75x', 100: '100x' }} size="small" />
      {/* <Slider reverse defaultValue={20} marks={{ 30: 30, 50: 50, 80: 80 }} /> */}
      <p>Range Slider</p>
      <Range defaultValue={[16, 30]} size="small" />
      <p>Disabled Slider</p>
      <Slider defaultValue={20} disabled size="small" />
      <p>Disabled Range</p>
      <Range defaultValue={[16, 30]} disabled size="small" />
    </div>
  );
};

export default () => {
  return (
    <Wrapper>
      <SliderDoc />
    </Wrapper>
  );
};
