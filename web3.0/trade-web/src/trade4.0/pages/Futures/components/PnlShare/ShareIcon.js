/**
 * Owner: garuda@kupotech.com
 */
import React, { useCallback, useMemo, useState } from 'react';

import { styled } from '@kux/mui/emotion';

import clsx from 'clsx';

import { greaterThanOrEqualTo } from 'utils/operation';

import { ReactComponent as ShareSvg } from '@/assets/share/ic-share.svg';

import CompliantRule from '@/components/CompliantRule';
import { useIsRTL } from '@/hooks/common/useLang';

import { FUTURES_SHARE } from '@/meta/multSiteConfig/futures';

import { useModalProps } from './hook';

const ShowLine = styled.div`
  width: 1px;
  height: 12px;
  background-color: ${(props) => props.theme.colors.divider8};
  margin: 0 4px 0 8px;
`;

const ShareSVGCls = styled(ShareSvg)`
  margin-left: 4px;
  font-size: 12px;
  color: ${(props) =>
    (props.isShiny ? props.theme.colors.primary : props.theme.colors.icon60)} !important;
  cursor: pointer;
  transform: ${(props) => (props.isRTL ? 'scaleX(-1)' : 'unset')};
`;

const ShareIcon = ({ data, type = 'position', showLine = false }) => {
  const isRTL = useIsRTL();
  const [isAlreadyShiny, setAlreadyShiny] = useState(false);

  const { openPositionShareModal, openPnlShareModal } = useModalProps();

  const isPnl = useMemo(() => type === 'pnl', [type]);

  const handleShare = useCallback(() => {
    setAlreadyShiny(true);
    if (isPnl) {
      openPnlShareModal(data);
    } else {
      openPositionShareModal(data);
    }
  }, [data, isPnl, openPnlShareModal, openPositionShareModal]);

  const isShiny = useMemo(() => {
    if (isAlreadyShiny) {
      return false;
    }
    if (isPnl) {
      return false;
    }
    if (greaterThanOrEqualTo(data?.roe)(0.5)) {
      return true;
    }
    return false;
  }, [data, isAlreadyShiny, isPnl]);

  return (
    <>
      <CompliantRule ruleId={FUTURES_SHARE}>
        {showLine ? <ShowLine /> : null}
        <ShareSVGCls
          className={clsx({ 'share-shiny': isShiny })}
          isShiny={isShiny}
          onClick={handleShare}
          isRTL={isRTL}
        />
      </CompliantRule>
    </>
  );
};

export default React.memo(ShareIcon);
