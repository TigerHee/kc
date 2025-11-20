/*
 * Owner: larvide.peng@kupotech.com
 */
import { memo } from 'react';
import { Link } from 'react-scroll';
import { isFunction } from 'lodash';
import { styled, useMediaQuery } from '@kux/mui';
import { useRestrictNotice } from 'src/hooks/useRestrictNotice';
import { _t } from 'tools/i18n';

const AnchorListWrapper = styled.div``;

const AnchorList = styled.ul`
  margin: 0 0;
  ${(props) => props.theme.breakpoints.down('sm')} {
    max-height: 260px;
    overflow-y: auto;
  }
`;

const AnchorItem = styled.li`
  box-sizing: border-box;
  margin: 0;
  min-width: 0;
  position: relative;
  padding-bottom: ${(props) => (props.notLast ? '32px' : '0')};
  cursor: pointer;
  a {
    color: ${(props) => (props.isActive ? props.theme.colors.text : props.theme.colors.text60)};
    font-weight: ${(props) => (props.isActive ? 700 : 400)};
    font-size: 16px;
    font-style: normal;
    line-height: 130%;
  }
`;

const AnchorLine = styled.div`
  position: absolute;
  z-index: -1;
  height: 100%;
  ::after {
    display: inline-block;
    width: 4px;
    height: calc(100% - 12px);
    margin-left: 4px;
    background: ${(props) => props.theme.colors.cover8};
    transform: translateY(17px);
    content: '';
  }
`;

const AnchorIconWrapper = styled.div`
  float: left;
  transform: translateY(5px);
  text-align: center;
`;

const AnchorRight = styled.div`
  margin-left: 28px;
  display: block;
  display: -webkit-box;
  max-height: 3.7em;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  [dir='rtl'] & {
    margin-right: 28px;
  }
`;

const CirclePoint = styled.div`
  width: 12px;
  height: 12px;
  padding: 3px;
  border: 3px solid;
  border-color: ${(props) =>
    props.isActive ? props.theme.colors.cover : props.theme.colors.cover12};
  background-color: ${(props) => props.theme.colors.background};
  border-radius: 50%;
`;

// 锚点导航列表
const AnchorContent = ({ anchorList, activeAnchorKey, onClickItem }) => {
  const { isShowRestrictNotice, restrictNoticeHeight } = useRestrictNotice();
  const isSm = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  // 锚点导航列表吸顶距离
  const stickyTop = (isShowRestrictNotice ? restrictNoticeHeight : 0) + (isSm ? 96 : 120);

  const handleSetActive = (nextActiveKey) => {
    if (activeAnchorKey !== nextActiveKey) {
      isFunction(onClickItem) && onClickItem(nextActiveKey);
    }
  };

  if (anchorList.length < 2) {
    return null;
  }
  return (
    <AnchorListWrapper style={{ position: 'sticky', top: stickyTop }}>
      <AnchorList>
        {anchorList?.map(({ id, title }, index) =>
          title ? (
            <AnchorItem
              key={id}
              isActive={activeAnchorKey === id}
              notLast={index < anchorList.length - 1}
            >
              <Link
                spy={true}
                spyThrottle={0}
                offset={-140}
                smooth={false}
                to={id}
                onClick={() => handleSetActive(id)}
                onSetActive={() => handleSetActive(id)}
              >
                {index < anchorList.length - 1 ? <AnchorLine /> : null}
                <AnchorIconWrapper>
                  <CirclePoint isActive={activeAnchorKey === id} />
                </AnchorIconWrapper>
                <AnchorRight>{_t(title)}</AnchorRight>
              </Link>
            </AnchorItem>
          ) : null,
        )}
      </AnchorList>
    </AnchorListWrapper>
  );
};

export default memo(AnchorContent);
