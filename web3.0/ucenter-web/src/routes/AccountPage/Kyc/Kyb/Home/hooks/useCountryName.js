/**
 * Owner: vijay.zhou@kupotech.com
 */
import { useSelector } from 'src/hooks/useSelector';

const useCountryName = (code, type = 'KYC') => {
  const countriesKYC = useSelector((state) => state.kyc?.countries ?? []);
  const countriesKYB = useSelector((state) => state.kyc?.countriesKYB ?? []);
  const countries = type === 'KYC' ? countriesKYC : countriesKYB;
  const target = countries.find((item) => item.code === code);
  return target?.name ?? code;
};

export default useCountryName;
