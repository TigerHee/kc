/**
 * Owner: ella@kupotech.com
 */
import React from 'react';
import { _t } from 'tools/i18n';
import { styled } from '@kux/mui';

const TagWrapper = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  padding-top: 12px;
  z-index: 1;
  display: flex;
  [dir='rtl'] & {
    right: unset;
    left: 0;
  }
  .tag {
    height: 24px;
    color: #fff;
    font-weight: 400;
    font-size: 12px;
    font-style: normal;
    line-height: 130%;
    text-align: center;
  }
  .customized-tutorial {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 4px 10px;
    background: #01bc8d;
    ::before {
      position: absolute;
      left: -8px;
      width: 0;
      height: 0;
      border-top: 12px solid #01bc8d;
      border-bottom: 12px solid #01bc8d;
      border-left: 9px solid transparent;
      content: '';
      [dir='rtl'] & {
        right: -8px;
        left: unset;
        border-right: 9px solid transparent;
        border-left: none;
      }
    }
  }
`;

const TutorialTag = ({ isTutorial }) => {
  return (
    !!isTutorial && (
      <TagWrapper className="tutorial-tag">
        <span aria-label="tutorial_tag" className="tag customized-tutorial">
          {_t('12BtE7RuMndQ8F9ixPLAXH')}
        </span>
      </TagWrapper>
    )
  );
};

export default TutorialTag;
