/**
 * Owner: gavin.liu1@kupotech.com
 */
import { styled } from '@kufox/mui/emotion';

export const TriangleIcon = ({ fill = '#FFF997' }) => {
  return (
    <svg width="7" height="5" viewBox="0 0 7 5" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.90962 0.585167C3.71057 0.300808 3.28943 0.300807 3.09038 0.585166L0.550712 4.21327C0.31874 4.54466 0.555816 5 0.960328 5H6.03967C6.44418 5 6.68126 4.54466 6.44929 4.21327L3.90962 0.585167Z"
        fill={fill}
      />
    </svg>
  );
};

// 对勾的就是比一般的图标大，设计稿这样子
const ExpandSvg = styled.svg`
  transform: scale(1.3);
`

export const OkIcon = ({ fill = '#01BC8D' }) => {
  return (
    <ExpandSvg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.06663 0.525668L8.16323 0.623515L8.06663 0.525668L4.00378 4.5369L1.93695 2.46158C1.70799 2.23168 1.336 2.23092 1.1061 2.45988C0.876197 2.68884 0.875434 3.06083 1.1044 3.29073L3.37322 5.56887C3.71804 5.91511 4.27787 5.91747 4.6256 5.57416L8.89215 1.36181C9.12304 1.13385 9.12542 0.761875 8.89746 0.53098C8.6695 0.300085 8.29752 0.297707 8.06663 0.525668Z"
        fill={fill}
        stroke={fill}
        strokeWidth="0.275"
      />
    </ExpandSvg>
  );
};
