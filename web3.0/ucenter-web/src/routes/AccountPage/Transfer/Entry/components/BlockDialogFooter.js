/**
 * Owner: john.zhang@kupotech.com
 */

import { memo, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { _t } from 'src/tools/i18n';
import { handleATagClick } from '../../utils/element';
import { LINK_TYPE } from '../constants';
import { getLinkURL } from '../utils';
import { ActionLink, Footer } from './StyleComponents';

const BlockDialogFooter = () => {
  const itRef = useRef(null);
  const nextFetchBlockTime = useSelector((state) => state.userTransfer.nextFetchBlockTime);
  const userTransferInfo = useSelector((state) => state.userTransfer?.userTransferInfo);
  const targetSiteType = userTransferInfo?.targetSiteType;

  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (nextFetchBlockTime > 0) {
      itRef.current = setInterval(() => {
        const value = Math.ceil((nextFetchBlockTime - Date.now()) / 1000);
        setDuration(value > 0 ? value : 10);
      }, 1000);
    }
    return () => clearInterval(itRef.current);
  }, [nextFetchBlockTime]);

  // const text = duration > 0 ? _t('13547ae3c8464800aea0', { duration }) : '';
  const text = _t('13547ae3c8464800aea0', { duration });

  return (
    <Footer>
      <ActionLink
        href={getLinkURL(LINK_TYPE.GUIDE, targetSiteType)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleATagClick}
      >
        {_t('5838fd65cc5d4000a230')}
      </ActionLink>
      <div style={{ marginTop: 8, color: '#bbb', fontSize: 13, height: 24 }}>{text}</div>
    </Footer>
  );
};

export default memo(BlockDialogFooter);
