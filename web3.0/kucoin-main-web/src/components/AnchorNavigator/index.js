/* *
 * Owner: melon@kupotech.com
 */
import React, { useCallback, Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { useMediaQuery } from '@kufox/mui';
import { Button } from '@kufox/mui';
import { Link } from 'react-scroll';
import { isFunction } from 'lodash';
import { styled } from '@kufox/mui';
import { _t } from 'tools/i18n';

import AnchorHashIcon from 'static/anchor-navigator/hash.svg';
import AnchorHashActiveIcon from 'static/anchor-navigator/hash-active.svg';
import AnchorTipIcon from 'static/anchor-navigator/title-nav.svg';

import { CloseOutlined } from '@kufox/icons';

// 锚点
export const AnchorListWrapper = styled.div``;

export const AnchorList = styled.ul`
  margin-bottom: 0;
  ${(props) => props.theme.breakpoints.down('md')} {
    max-height: 260px;
    overflow-y: auto;
  }
`;

export const AnchorItem = styled.li`
  box-sizing: border-box;
  margin: 0;
  min-width: 0;
  position: relative;
  padding-bottom: ${(props) => (props.notLast ? '32px' : '0')};
  cursor: pointer;
  a {
    color: ${(props) => (props.isActive ? '#000D1D' : 'rgba(0, 13, 29, 0.68)')};
    font-weight: ${(props) => (props.isActive ? 700 : 400)};
    font-size: 16px;
    font-style: normal;
  }
`;

export const AnchorLine = styled.div`
  position: absolute;
  height: 100%;
  padding-top: 18px;
  ::after {
    display: inline-block;
    width: 4px;
    height: calc(100% + 18px);
    margin-left: 4px;
    background: rgba(0, 13, 29, 0.08);
    content: '';
  }
`;

export const AnchorIconWrapper = styled.div`
  width: 12px;
  float: left;
  text-align: center;
  [dir='rtl'] & {
    position: absolute;
    right: -4px;
  }
`;

export const AnchorIcon = styled.img`
  width: 12px;
  height: 12px;
`;

export const AnchorRight = styled.div`
  margin-left: 28px;
  line-height: 130%;
  [dir='rtl'] & {
    margin-right: 28px;
  }
`;

// 抽屉
export const Draw = styled.section`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  -webkit-transition: opacity 0.2s ease-in;
  transition: opacity 0.2s ease-in;
  opacity: 1;
  visibility: ${(props) => (props.drawOpen ? 'visible' : 'hidden')};
`;

export const DrawBody = styled.div`
  width: 100%;
  margin-top: 16px;
  position: absolute;
  background: #fff;
  bottom: 0;
  padding: 16px;
  border-radius: 16px 16px 0px 0px;
`;

export const DrawHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
`;

export const DrawTitle = styled.div`
  font-weight: 500;
  font-size: 18px;
  line-height: 130%;
  text-align: center;
  color: #000d1d;
  padding-bottom: 16px;
`;

export const CloseOutlinedIcon = styled(CloseOutlined)`
  position: absolute;
  top: 18px;
  left: 0px;
  font-size: 20px;
  transform: translateY(-50%);
`;

export const DrawContent = styled.div`
  padding-top: 18px;
`;

export const CancelButton = styled(Button)`
  height: 40px;
  width: 100%;
  margin-top: 36px;
`;

export const AnchorTip = styled.img`
  width: 48px;
  height: 48px;
  position: fixed;
  right: 16px;
  bottom: 80px;
  cursor: pointer;
`;

export const AnchorListTitle = styled.div`
  font-weight: 500;
  font-size: 20px;
  line-height: 130%;
  color: #000d1d;
  margin-bottom: 24px;
`;

// 锚点导航列表
const AnchorContent = ({
  anchorList,
  onCancel,
  activeAnchorKey,
  showListTitle,
  onClickItem,
  title,
}) => {
  const handleSetActive = useCallback(
    (nextActiveKey) => {
      if (activeAnchorKey !== nextActiveKey) {
        isFunction(onClickItem) && onClickItem(nextActiveKey);
        if (isFunction(onCancel)) {
          onCancel();
        }
      }
    },
    [onCancel, activeAnchorKey, onClickItem],
  );
  return (
    <AnchorListWrapper>
      {showListTitle ? <AnchorListTitle>{title}</AnchorListTitle> : null}
      <AnchorList>
        {anchorList.map((item, index) => (
          <AnchorItem
            key={item.key}
            isActive={activeAnchorKey === item.key}
            notLast={index < anchorList.length - 1}
          >
            <Link
              spy={true}
              offset={-80}
              duration={300}
              smooth={false}
              to={item.key}
              onClick={() => handleSetActive(item.key)}
              onSetActive={() => handleSetActive(item.key)}
            >
              {index < anchorList.length - 1 ? <AnchorLine /> : null}
              <AnchorIconWrapper>
                <AnchorIcon
                  src={activeAnchorKey === item.key ? AnchorHashActiveIcon : AnchorHashIcon}
                />
              </AnchorIconWrapper>
              <AnchorRight>{item.title}</AnchorRight>
            </Link>
          </AnchorItem>
        ))}
      </AnchorList>
    </AnchorListWrapper>
  );
};

// 锚点导航 - 需要搭配 react-scroll 的Element使用； Element 的name需要和anchorList的key 一一对应
const Index = ({
  anchorList,
  onClickItem,
  activeAnchorKey,
  title,
  showListTitle,
  showDrawerTitle,
}) => {
  const isSm = useMediaQuery((theme) => theme.breakpoints.down('md')); // 小屏幕
  const [drawOpen, setDrawOpen] = useState(false);
  const onCancel = useCallback(() => {
    setDrawOpen(false);
  }, []);
  React.useEffect(() => {
    if (isSm) {
      if (drawOpen) {
        document.body.style = 'overflow:hidden;height:100%';
      } else {
        document.body.style = 'overflow:unset;height:unset';
      }
    }
  }, [isSm, drawOpen]);

  if (isSm) {
    return (
      <Fragment>
        <AnchorTip src={AnchorTipIcon} onClick={() => setDrawOpen(true)} data-testId="btn" />
        <Draw drawOpen={drawOpen}>
          <DrawBody className="new_draw_body">
            {/* 抽屉头部 */}
            <DrawHeader className="new_draw_header">
              {/* 抽屉关闭按钮 */}
              <CloseOutlinedIcon onClick={onCancel} className="new_draw_close" />
              {/* 抽屉标题 */}
              {showDrawerTitle ? <DrawTitle className="new_draw_title">{title}</DrawTitle> : null}
            </DrawHeader>
            {/* 抽屉内容 */}
            <DrawContent className="new_draw_content">
              <AnchorContent
                onCancel={onCancel}
                anchorList={anchorList}
                onClickItem={onClickItem}
                activeAnchorKey={activeAnchorKey}
                title={title}
                showListTitle={showListTitle}
              />
            </DrawContent>
            {/* 取消按钮 */}
            <CancelButton className="new_draw_cancel_btn" type="default" onClick={onCancel}>
              {_t('tKUz9CbyYRhEbms51cfcVM')}
            </CancelButton>
          </DrawBody>
        </Draw>
      </Fragment>
    );
  }
  return (
    <AnchorContent
      showListTitle={showListTitle}
      anchorList={anchorList}
      onClickItem={onClickItem}
      activeAnchorKey={activeAnchorKey}
      title={title}
    />
  );
};

Index.propTypes = {
  anchorList: PropTypes.array.isRequired, // 锚点数组
  onClickItem: PropTypes.func, // 点击锚点item时候的回调
  activeAnchorKey: PropTypes.string, // 选中的导航key
  title: PropTypes.string, // 锚点列表标题
  showListTitle: PropTypes.bool, // 是否展示列表标题
  showDrawerTitle: PropTypes.bool, // 是否展示抽屉标题
};
Index.defaultProps = {
  anchorList: [],
  onClickItem: () => {},
  activeAnchorKey: undefined,
  title: _t('jkghLcmDyWutR24gbVhbwk'),
  showListTitle: false,
  showDrawerTitle: true,
};

export default React.memo(Index);
