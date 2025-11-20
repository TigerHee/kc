/**
 * Owner: borden@kupotech.com
 */
import { styled, fx } from '@/style/emotion';

export const FlexColumm = styled.div`
  ${fx.display('flex')}
  ${fx.flexFlow('column')}
`;

export const textOveflow = `
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

export const TextOverFlow = styled.div`
  ${textOveflow}
`;
