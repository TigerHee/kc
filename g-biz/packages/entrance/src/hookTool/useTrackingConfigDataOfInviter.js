import { useSelector } from 'react-redux';

export default function useTrackingConfigDataOfInviter() {
  const { data = {} } = useSelector((state) => state.$entrance_signUp?.inviter ?? {});
  const { rcodeType } = data || {};
  return {
    register_type: rcodeType === 'TOB' ? 'partner' : 'uc_general',
    partner_id: data?.uid ?? '',
  };
}
