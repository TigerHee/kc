/**
 * Owner: ella.wang@kupotech.com
 */
import { toPercent } from 'src/helper';
import { _t } from 'src/tools/i18n';
import {
  DownWrapper,
  LeftBtn,
  Parallelism,
  PercentText,
  PercentTextRight,
  RightBtn,
  RightParallelism,
  UpWrapper,
  Wrapper,
} from './Percent.style';

export default ({ risePercent, fallPercent }) => {
  return (
    <Wrapper>
      <LeftBtn rate={risePercent / fallPercent}>
        <UpWrapper>
          <PercentText>
            <span>{_t('qznZ1eCVwAM3DnUg854szz')}</span>
            {toPercent(+risePercent)}
          </PercentText>
        </UpWrapper>
        <Parallelism />
      </LeftBtn>
      <RightBtn>
        <RightParallelism />
        <DownWrapper>
          <PercentTextRight>
            <span>{_t('bMukGAeEpmmc11EuPQiguW')}</span>
            {toPercent(+fallPercent)}
          </PercentTextRight>
        </DownWrapper>
      </RightBtn>
    </Wrapper>
  );
};
