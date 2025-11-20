/**
 * Owner: sean.shi@kupotech.com
 */
// TODO: 待改造注册的时候修改
// import { useStore } from '../store/store';

export default function useTrackingConfigDataOfInviter() {
  // const inviter = useStore((state) => state.entrance_signUp.inviter);
  const inviter = { data: { rcodeType: '', uid: '' } };
  const { data } = inviter;
  const { rcodeType } = data;

  return {
    register_type: rcodeType === 'TOB' ? 'partner' : 'uc_general',
    partner_id: data?.uid ?? '',
  };
}
