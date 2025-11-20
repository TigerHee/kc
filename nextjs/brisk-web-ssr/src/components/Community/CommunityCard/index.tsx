import React, { useState } from 'react';
import { CommunityCardProps } from '../types';
import styles from './index.module.scss';
import clsx from 'clsx';
import { Button } from '@kux/design';

const CommunityCard: React.FC<CommunityCardProps> = ({
  title,
  description,
  buttonText,
  buttonUrl,
  onClick,
  className,
  afterNode,
  extraNode,
}) => {
  const [isHover, setIsHover] = useState(false);

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else if (buttonUrl) {
      window.open(buttonUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (buttonUrl) {
      window.open(buttonUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const afterContent = typeof afterNode === 'function' ? afterNode({ isHover }) : afterNode;

  return (
    <div
      className={clsx([styles.communityCard, className])}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {/* 卡片内容 */}
      <div className={styles.cardContent}>
        {/* 标题区域 */}
        <div className={styles.titleSection}>
          <h3 className={styles.title}>{title}</h3>
        </div>

        {/* 描述 */}
        <div className={styles.description}>{description}</div>

        {/* 按钮 */}
        {buttonText && (
          <div className={styles.btnArea}>
            <Button type="primary" size="huge" className={styles.button} onClick={handleButtonClick}>
              {buttonText}
            </Button>
            {extraNode}
          </div>
        )}
      </div>

      {/* 可追加内容 */}
      {afterContent}
    </div>
  );
};

export default CommunityCard;
