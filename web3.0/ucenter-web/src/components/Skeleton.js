/**
 * Owner: eli@kupotech.com
 */

import { keyframes, styled, useTheme } from '@kux/mui';

const skeletonLoading = keyframes`
0% {
  background-position: 100% 50%;
}

100% {
  background-position: 0 50%;
}
`;
const SkeletonBase = styled.div`
  width: ${(props) => props.width || '100%'};
  height: ${(props) => props.height || '28px'};
  border-radius: ${(props) => props.borderRadius || '4px'};
  background: ${({ theme }) =>
    `linear-gradient(90deg, ${theme.colors.cover8} 0%, ${theme.colors.cover12} 100%)`};
  background-size: 400% 100%;
  margin: ${(props) => props.margin || '0'};
  animation: ${skeletonLoading} 1.4s ease infinite;
`;

export default function Skeleton({ width, height, borderRadius, margin }) {
  const theme = useTheme();

  return <SkeletonBase width={width} height={height} borderRadius={borderRadius} margin={margin} />;
}
