/**
 * Owner: will.wang@kupotech.com
 */

import useTransPrice from "@/hooks/useTransPrice";

const NumberWithChar = ({
  price,
  symbol,
  needHandlePrice,
  hideChar = false,
  needTransfer = true,
  isUnsaleATemporary = false,
}) => {
  const finalPrice = useTransPrice({
    price,
    symbol,
    isUnsaleATemporary,
    needTransfer,
    needHandlePrice,
    hideChar,
  });

  return <>{finalPrice}</>;
};

export default NumberWithChar;
