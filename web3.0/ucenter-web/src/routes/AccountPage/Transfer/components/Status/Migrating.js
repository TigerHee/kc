/**
 * Owner: jacky@kupotech.com
 */
import { useSelector } from 'react-redux';
import { _t } from 'src/tools/i18n';
import getSiteName from 'src/utils/getSiteName';
import { getTargetSiteType } from '../../utils/site';
import AwaitContainer from '../AwaitContainer';

/**
 * 迁移中
 */
export default function Migrating() {
  const targetSiteType = useSelector((state) =>
    getTargetSiteType(state.userTransfer?.userTransferInfo, state.userTransfer?.userTransferStatus),
  );
  const targetSiteName = getSiteName(targetSiteType);

  return (
    <AwaitContainer
      title={_t('95327d44509d4800a9b8', { targetSiteName })}
      subTitle={_t('340a7f6c15ba4800ac42', { num: '5-10' })}
    />
  );
}
