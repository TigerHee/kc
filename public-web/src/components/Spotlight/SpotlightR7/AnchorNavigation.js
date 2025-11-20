import React, { memo } from 'react';
import {useResponsive } from  '@kux/mui';
import { ReactComponent as RightArrow } from 'static/spotlight7/right_arrow.svg';
import {
  BottomAnchorWrapper,
  AnchorListWrapper,
  AnchorCard,
  AnchorIcon,
  AnchorName,
} from './styled';

/**
 * 锚点导航组件
 * 
 * @param {Object} props - 组件属性
 * @param {Array} props.anchorList - 必传，锚点列表数据
 * @param {string} props.anchorList[].icon - 图标路径
 * @param {string} props.anchorList[].name - 显示名称
 * @param {string} [props.anchorList[].link] - 可选，跳转链接
 * @param {Function} [props.anchorList[].callBack] - 可选，点击回调函数
 */
const AnchorNavigation = memo(({ anchorList }) => {
  const { sm } = useResponsive();
  const handleAnchorClick = (anchor, e) => {
    if (anchor.callBack) {
      e.preventDefault();
      anchor.callBack();
    }
  };

  if (!anchorList || !Array.isArray(anchorList)) {
    console.error('AnchorNavigation: anchorList is required and must be an array');
    return null;
  }

  return (
    <BottomAnchorWrapper>
      <AnchorListWrapper sm={sm}>
        {anchorList.map((anchor, index) => (
          <AnchorCard
            key={`anchor-${index}`}
            to={anchor.link || '#'}
            onClick={(e) => handleAnchorClick(anchor, e)}
            index={index}
            aria-label={anchor.name}
          >
              {sm ? (<div className="flex-center">
              <AnchorIcon src={anchor.icon} alt="anchor_icon" />
              <AnchorName>{`${index+1}.`}{anchor.name}</AnchorName>
            </div>
            ) : (
              <div  className="event-item">
                {index !== 2 && <div className="lineDashed" />}
                <div className="flex">
                  <div>
                    <div className="index"> {index + 1}</div>
                  </div>
                  <AnchorName>{anchor.name}{'>>'}</AnchorName>
                </div>
              </div>
            )}
            {sm && index!==2 && <RightArrow alt="" className="arrow"/>}
          </AnchorCard>
        ))}
      </AnchorListWrapper>
    </BottomAnchorWrapper>
  );
});

export default AnchorNavigation;