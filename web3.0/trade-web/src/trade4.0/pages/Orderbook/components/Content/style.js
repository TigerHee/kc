/*
 * owner: Clyne@kupotech.com
 */
import { styled, withMedia, fx } from '@/style/emotion';
import { FlexColumm } from '@/style/base';
import { name } from '@/pages/Orderbook/config';

const HOC = (FC) => withMedia(name, FC);

const ContentMd = () => `
  ${fx.flexFlow('nowrap')}
`;

export const ContentWrapper = HOC(styled(FlexColumm)`
  flex: 1;
  ${({ $media }) => $media('md', ContentMd())}
`);
