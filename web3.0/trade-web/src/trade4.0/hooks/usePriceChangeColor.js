/*
 * owner: borden@kupotech.com
 * desc: 涨跌色统一取处
 */
import { useMemo } from 'react';
import { useTheme } from '@emotion/react';

export default function usePriceChangeColor() {
  const { colors } = useTheme();

  return useMemo(() => {
    return {
      up: colors.primary,
      down: colors.secondary,
    };
  }, [colors]);
}

// Hoc
// export function withPriceChangeColor(WrappedComponent) {
//   return function WithPriceChangeColorComponent(props) {
//     const {
//       up: upColor,
//       down: downColor,
//     } = usePriceChangeColor();
//     return (
//       <WrappedComponent upColor={upColor} downColor={downColor} {...props} />
//     );
//   };
// }
