import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getRewardStatus } from 'src/services/kyc';

const useRewardAmount = () => {
  const { uid } = useSelector((state) => state.user?.user ?? {});
  const [amount, setAmount] = useState(0);

  useEffect(async () => {
    try {
      const { data } = await getRewardStatus({ 'x-user-id': uid });
      setAmount(data?.displayTotalAmount || 0);
    } catch (err) {
      console.error(err);
    }
  }, [uid]);

  return amount;
};

export default useRewardAmount;
