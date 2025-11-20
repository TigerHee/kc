/**
 * Owner: mike@kupotech.com
 */
import React from 'react';
import styled from '@emotion/styled';
import SideTag, { MarketType } from 'Bot/components/Common/SideTag';
import { Text, Flex } from 'Bot/components/Widgets';
import { MIcons } from 'Bot/components/Common/Icon';
import { _t, _tHTML } from 'Bot/utils/lang';
import FutureTag from 'Bot/components/Common/FutureTag';

const Row = styled(Flex)`
  &:last-of-type {
    margin-bottom: 0;
  }
  ${({ isProfitField, value, theme }) => {
    if (!isProfitField) return undefined;
    if (Number(value) > 0) {
      return `
        background: linear-gradient(270deg, rgba(33, 195, 151, 0.08) 0%, rgba(33, 195, 151, 0) 100%);
        border-radius: 4px;
        > span {
            color: ${theme.colors.primary};
        }
        `;
    } else {
      return {
        backgroundColor: theme.colors.cover8,
      };
    }
  }}
`;

export const CardRow = React.memo(
  ({ label, value, rawValue, unit, className, onClick, isProfitField }) => {
    // rawValue 用于判断大小, 没有格式化
    return (
      <Row
        sb
        fs={14}
        mb={8}
        lh="130%"
        className={className}
        onClick={onClick}
        isProfitField={isProfitField}
        value={rawValue || value}
      >
        <Text as="label" color="text40" className="label-text" mr={20}>
          {label}
        </Text>
        <Text fw={500} color="text" className="label-value">
          {value ?? '--'}
          {!!unit && <>&nbsp;<Text color="text40">
              {unit}
            </Text></>}
        </Text>
      </Row>
    );
  },
);

const Card = styled.div`
  padding: 14px 0;
  border-bottom: 0.5px solid ${({ theme }) => theme.colors.divider8};
  ${({ cursor }) => {
    if (cursor) {
      return {
        cursor: 'pointer',
      };
    }
  }}
  &:last-of-type {
    border-bottom: none;
  }
  .card-tag {
    border-radius: 2px;
    text-align: center;
    font-size: 12px;
  }
  .color-primary-bk {
    background: linear-gradient(270deg, rgba(33, 195, 151, 0.08) 0%, rgba(33, 195, 151, 0) 100%);
    border-radius: 4px;
    > span {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
  .color-gray-bk {
    background-color: ${({ theme }) => theme.colors.cover8};
  }
  .tax {
    color: inherit;
  }
`;
/**
 * @description:
 * @param {*} list
 * @param {*} onJump
 * @param {*} children
 * @param {*} symbolName
 * @param {*} notArrow 是否允许点击
 * @return {*}
 */
export const CardWrap = ({
  item,
  notState, // 没有完成状态
  className,
}) => {
  return (
    <Card className={`stopOrderCard ${className}`} onClick={item.onClick} cursor={item.hasArrow}>
      <Flex vc sb mb={5}>
        <Flex vc>
          <Text color="text" fs={16} lh="130%" fw={500} className="ltr" mr={8}>
            {item.symbolNameText}
          </Text>
          {item.Tag || <FutureTag direction={item.direction} leverage={item.leverage} />}
        </Flex>
        {!notState && (
          <Flex vc fs={14} lh="130%" color="text40" fw={500}>
            {_t('stoporders3')}
            {item.hasArrow && <MIcons.ArrowRight color="text40" size={16} />}
          </Flex>
        )}
      </Flex>

      <Flex vc fs={12} mb={12}>
        <SideTag side={item.side} />
        <MarketType type={item.type} className="mr-4" />
        <Text color="text40" mr={8}>
          {item.time}
        </Text>
      </Flex>
      {item.lists.map((list, index) => {
        return <CardRow {...list} key={index} />;
      })}
    </Card>
  );
};

export default ({ items }) => {
  return items.map((item) => {
    return <CardWrap item={item} key={item.id} />;
  });
};
