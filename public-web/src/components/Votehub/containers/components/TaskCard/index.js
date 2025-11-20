/**
 * Owner: jessie@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { memo } from 'react';
import { useDispatch } from 'react-redux';
import { StyledTask } from './styledComponents';

const emptyObj = {};

/**
 * 任务卡片
 * @param {title} 任务标题 required
 * @param {desc} 任务介绍 required
 * @param {operator} 操作 required
 * @param {isInModal} 是否在弹框中
 * @param {isSpecialBtn} 多按钮情况下h5特殊样式
 * @returns
 */
function TaskCard({ title, tag, desc, label, operator, isInModal = false, isSpecialBtn = false }) {
  const { currentLang } = useLocale();
  const dispatch = useDispatch();

  return (
    <StyledTask className={`${isSpecialBtn ? 'specialTask' : ''} ${isInModal ? 'isInModal' : ''}`}>
      <div className="info">
        <div className="titleWrapper">
          {title}
          {tag ? <span className="tag">{tag}</span> : null}
        </div>

        {desc ? <div className="desc">{desc}</div> : null}
        {label ? <div className="label">{label}</div> : null}
      </div>

      {operator}
    </StyledTask>
  );
}

export default memo(TaskCard);
