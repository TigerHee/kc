/**
 * Owner: jessie@kupotech.com
 */
import { styled, useResponsive } from '@kux/mui';
import { useMemo } from 'react';
import { shallowEqual } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { locateToUrl } from 'TradeActivity/utils';

const BannerWrapper = styled.div`
  margin-top: 30px;
  margin-bottom: 120px;
  display: inline-block;

  img {
    width: 790px;
    max-width: 100%;
    height: 114px;
    border-radius: 8px;
    cursor: pointer;
  }

  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
    height: unset;
    margin-bottom: 90px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 20px;
    margin-bottom: 80px;
  }
`;

const BannerMini = () => {
  const { sm } = useResponsive();
  const { entryIconUrlMd, entryIconUrlSm, entryIconTarget } = useSelector(
    (state) => state.spotlight.detailInfo,
    shallowEqual,
  );

  const bannerSrc = useMemo(() => {
    if (!sm && entryIconUrlSm) {
      return `${entryIconUrlSm}?d=640x217`;
    }
    if (sm && entryIconUrlMd) {
      return entryIconUrlMd;
    }

    return null;
  }, [(sm, entryIconUrlSm, entryIconUrlMd)]);

  if (!bannerSrc || !entryIconTarget) {
    return null;
  }

  return (
    <BannerWrapper onClick={() => locateToUrl(entryIconTarget)}>
      <img src={bannerSrc} alt="img" />
    </BannerWrapper>
  );
};

export default BannerMini;
