import buoyHighSrc from 'static/account/security/score/buoy-high.svg';
import buoyLowSrc from 'static/account/security/score/buoy-low.svg';
import buoyMediumSrc from 'static/account/security/score/buoy-medium.svg';
import { LEVEL_ENUMS } from '../constants';
import { Img } from './styled';

export default function Buoy({ level }) {
  return (
    <Img
      src={
        level === LEVEL_ENUMS.HIGH
          ? buoyHighSrc
          : level === LEVEL_ENUMS.MEDIUM
          ? buoyMediumSrc
          : buoyLowSrc
      }
    />
  );
}
