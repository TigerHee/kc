/**
 * Owner: mike@kupotech.com
 */
import {useSelector} from 'react-redux';
import useTracker from 'hooks/useTracker';
import {jumpVerify} from '../config';
import {showToast} from '@krn/bridge';
import useLang from 'hooks/useLang';

export default ({kyc3Status, kyc3StatusEnum, trackStatus}) => {
  const {_t} = useLang();
  const kycInfo = useSelector(s => s.kyc.kycInfo);
  const kybInfo = useSelector(state => state.kyc.kybInfo);
  const kycClearInfo = useSelector(s => s.kyc.kycClearInfo);

  const {onClickTrack} = useTracker();
  const onClickVerify = () => {
    onClickTrack({
      blockId: 'GoVerify',
      locationId: '1',
      properties: {
        kyc_homepage_status: trackStatus,
      },
    });

    if (
      [
        kyc3StatusEnum.UNVERIFIED,
        kyc3StatusEnum.SUSPEND,
        kyc3StatusEnum.REJECTED,
        kyc3StatusEnum.CLEARANCE,
        kyc3StatusEnum.RESET,
      ].includes(kyc3Status)
    ) {
      if (kycInfo?.type === 1 && ![2, 4].includes(kybInfo?.verifyStatus)) {
        showToast(_t('gfxRgyjZkKpSckL58nw2nW'));
      } else {
        jumpVerify(kycClearInfo);
      }
    }
  };

  return {
    onClickVerify,
  };
};
