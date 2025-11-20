/**
 * Owner: willen@kupotech.com
 */
import ItemWrapper from './NormalWrapper';
import styled from '@emotion/native';
import React from 'react';
import Title from './NormalText';

const Wrapper = styled.View`
  padding: 24px 0 0;
`;
const Content = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: ${({index}) => (index > 0 ? '16px' : '0px')};
`;
const LabelText = styled(Title)`
  margin-bottom: 0;
  text-align: center;
  color: ${({theme, selected}) => theme.colorV2[selected ? 'text' : 'tex60']};
  font-weight: 500;
`;
const StyledItemWrapper = styled(ItemWrapper)`
  margin-right: ${({index}) => (index < 2 ? '16px' : '0px')};
  flex: 1;
  max-width: 30%;
`;

export default ({list = [], onPress, title = '', style}) => {
  const len = Math.ceil(list.length / 3);

  let showlist = [];
  for (let i = 0; i < len; i++) {
    showlist.push(list.slice(3 * i, 3 * (i + 1)));
  }

  return (
    <Wrapper style={style}>
      <Title text={title} />
      {showlist.map((i, idx) => {
        return (
          <Content key={idx} index={idx}>
            {i.map((item, index) => {
              return (
                <StyledItemWrapper
                  index={index}
                  key={item.label}
                  selected={item.selected}
                  onPress={() => {
                    onPress(item);
                  }}>
                  <LabelText text={item.label} selected={item.selected} />
                </StyledItemWrapper>
              );
            })}
          </Content>
        );
      })}
    </Wrapper>
  );
};
