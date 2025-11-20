/**
 * Owner: jessie@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { ICHookOutlined } from '@kux/icons';
import { DateTimeFormat, styled } from '@kux/mui';
import map from 'lodash/map';
import { useCallback } from 'react';
import { useProcessBar, useProcesss } from './hooks';

const Wrapper = styled.div`
  width: 100%;
`;

const Items = styled.div`
  margin-bottom: 48px;
  display: flex;
  align-items: flex-start;

  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-bottom: 48px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    display: block;
    margin-bottom: 20px;
  }
`;

const Item = styled.div`
  width: 20%;
  position: relative;

  ${(props) => props.theme.breakpoints.down('sm')} {
    display: flex;
    align-items: center;
    width: 100%;
    padding-bottom: 34px;
  }
`;

const ItemStatus = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 24px;
  background: #181e29;
  border: 1px solid rgba(188, 200, 224, 0.12);
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  color: rgba(225, 232, 245, 0.68);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  position: relative;
  z-index: 1;

  &.active {
    color: #181e29;
    background: #01bc8d;
    border: 1px solid transparent;
  }
  &.done {
    color: #01bc8d;
    background: #1b3136;
    border: 1px solid transparent;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-right: 12px;
    margin-bottom: 0;
  }
`;

const ItemTitle = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  color: #e1e8f5;
  margin-bottom: 4px;
  padding-right: 20px;
  ${(props) =>
    props.isPastDue &&
    `
    color: rgba(225, 232, 245, 0.3);
  `}

  ${(props) => props.theme.breakpoints.down('sm')} {
    flex: 1;
    margin-bottom: 0;
  }
`;

const ItemContent = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: rgba(225, 232, 245, 0.4);
  padding-right: 20px;
  /* word-break: break-all; */
`;

const ItemLine = styled.div`
  position: absolute;
  width: 100%;
  height: 1px;
  left: 0;
  top: 12px;
  background: rgba(188, 200, 224, 0.12);
  &.done {
    background: #01bc8d;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    top: 24px;
    left: 12px;
    width: 1px;
    height: 100%;
  }
`;

const Process = () => {
  const { currentLang } = useLocale();
  const [processArr] = useProcessBar();
  const { isSameOrBefore, isAfter, isSame } = useProcesss();
  const getClassName = useCallback(
    (status) => {
      let className = '';
      if (isAfter(status)) {
        className = 'done';
      } else if (isSame(status)) {
        className = 'active';
      }
      return className;
    },
    [isAfter, isSame],
  );

  return (
    <Wrapper>
      <Items>
        {map(processArr, ({ title, content, status }, index) => {
          const statusComp = (
            <ItemStatus className={getClassName(status)}>
              {isSameOrBefore(status) ? index + 1 : <ICHookOutlined />}
            </ItemStatus>
          );
          return (
            <Item key={`proccessItem_${index}`}>
              {index < processArr.length - 1 ? <ItemLine className={getClassName(status)} /> : null}
              {statusComp}
              <ItemTitle isPastDue={isAfter(status)}>{title}</ItemTitle>
              <ItemContent>
                {content ? <DateTimeFormat lang={currentLang}>{content}</DateTimeFormat> : ''}
              </ItemContent>
            </Item>
          );
        })}
      </Items>
    </Wrapper>
  );
};

export default Process;
