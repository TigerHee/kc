/**
 * Owner: vijay.zhou@kupotech.com
 */
import { styled } from '@kux/mui';

const Icon = styled.img`
  pointer-events: none;
  user-select: none;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 120px !important;
    height: 120px !important;
  }
`;

export default function KycIcon({ size = 130, src }) {
  return <Icon src={src} style={{ width: size, height: size }} />;
}
