/*
 * @Owner: Clyne@kupotech.com
 */
import { styled, fx } from '@/style/emotion';
import { FlexColumm } from '@/style/base';

export const widthCfg = ['50%', '25%', '25%'];
export const Wrapper = styled(FlexColumm)`
  ${fx.overflow('hidden')}
  ${fx.flex(1)}
`;
