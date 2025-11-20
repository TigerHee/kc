/**
 * Owner: ella.wang@kupotech.com
 */
import { _t } from 'src/tools/i18n';
import fingerDown from 'static/bitcoin-halving/fingerDown.svg';
import fingerUp from 'static/bitcoin-halving/fingerUp.svg';
import maskDown from 'static/bitcoin-halving/maskDown.svg';
import maskUp from 'static/bitcoin-halving/maskUp.svg';
import pk from 'static/bitcoin-halving/pk.svg';
import {
  Canvas,
  DownWrapper,
  LeftBtn,
  MaskPK,
  Parallelism,
  RightBtn,
  RightParallelism,
  Text,
  TextRight,
  UpWrapper,
  Wrapper,
} from './Content.style';

export default ({ upOnClick, downOnClick }) => {
  return (
    <Wrapper>
      <LeftBtn onClick={upOnClick}>
        <UpWrapper>
          <img src={maskUp} alt="icon" />
        </UpWrapper>
        <Parallelism>
          <Text>
            <img src={fingerUp} alt="up" />
            {_t('qznZ1eCVwAM3DnUg854szz')}
          </Text>
        </Parallelism>
      </LeftBtn>
      <Canvas id="thumsCanvas" width="200" height="400" style={{ width: 80, height: 160 }} />
      <MaskPK src={pk} alt="pk" />
      <RightBtn onClick={downOnClick}>
        <RightParallelism>
          <TextRight>
            <img src={fingerDown} alt="down" />
            {_t('bMukGAeEpmmc11EuPQiguW')}
          </TextRight>
        </RightParallelism>
        <DownWrapper>
          <img src={maskDown} alt="icon" />
        </DownWrapper>
      </RightBtn>
    </Wrapper>
  );
};
