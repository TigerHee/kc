/**
 * Owner: willen@kupotech.com
 */
import styled from '@emotion/native';
import React from 'react';
import Title from './Title';
import { Pressable, View } from 'react-native';

const Wrapper = styled.View``;
const List = styled.View`
  padding: 12px 8px;
`;
const Item = styled.View`
  flex-direction: row;
  justify-content: space-between;
  border-color: ${({ theme }) => theme.color.complementary12};
  border-style: solid;
  border-width: 0 0 1px 0;
  padding: 12px 0;
`;

const ItemColumn = styled.View`
  flex-direction: row;
  align-items: center;
  width: ${({ width }) => width}px;
  flex: ${({ width }) => (width ? 'none' : '1')};
  margin: 0 4px;
`;

const ItemColumnText = styled.Text`
  color: ${({ theme }) => theme.color.complementary};
  font-size: 12px;
  line-height: 18px;
`;

const ExpandList = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.color.primary};
`;

export default ({ list }) => {
  const [expandList, setExpandList] = React.useState(false);

  return (
    <Wrapper>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
        <Title style={{ flex: 1 }}>参数列表</Title>
        <Pressable style={{ marginRight: 16 }} onPress={() => setExpandList((i) => !i)}>
          <ExpandList>{expandList ? '收起参数列表' : '展开参数列表'}</ExpandList>
        </Pressable>
      </View>
      {expandList ? (
        <List>
          <Item>
            <ItemColumn width={100}>
              <ItemColumnText>参数</ItemColumnText>
            </ItemColumn>
            <ItemColumn>
              <ItemColumnText>说明</ItemColumnText>
            </ItemColumn>
            <ItemColumn width={60}>
              <ItemColumnText>类型</ItemColumnText>
            </ItemColumn>
            <ItemColumn width={50}>
              <ItemColumnText>默认值</ItemColumnText>
            </ItemColumn>
          </Item>
          {Object.keys(list).map((key) => {
            const { comment, defaultValue, type } = list[key];
            return (
              <Item key={key}>
                <ItemColumn width={100}>
                  <ItemColumnText>{key}</ItemColumnText>
                </ItemColumn>
                <ItemColumn>
                  <ItemColumnText>{comment}</ItemColumnText>
                </ItemColumn>
                <ItemColumn width={60}>
                  <ItemColumnText>{type}</ItemColumnText>
                </ItemColumn>
                <ItemColumn width={50}>
                  <ItemColumnText>
                    {typeof defaultValue === 'boolean'
                      ? defaultValue.toString()
                      : typeof defaultValue === 'string'
                      ? `"${defaultValue}"`
                      : typeof defaultValue === 'object'
                      ? JSON.stringify(defaultValue)
                      : defaultValue ?? '-'}
                  </ItemColumnText>
                </ItemColumn>
              </Item>
            );
          })}
        </List>
      ) : null}
    </Wrapper>
  );
};
