/**
 * Owner: kevyn.yu@kupotech.com
 */
import useTransPrice from './hooks/useTransPrice';

const NumberWithChar = ({
  price,
  symbol,
  hideChar,
  needHandlePrice,
  needTransfer = true,
  isUnsaleATemporary,
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
