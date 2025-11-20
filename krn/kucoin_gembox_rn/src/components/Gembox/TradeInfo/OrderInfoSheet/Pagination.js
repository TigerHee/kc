/**
 * Owner: roger.chen@kupotech.com
 */
import React, {useCallback, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import styled from '@emotion/native';
import {useTheme} from '@krn/ui';

const PaginationWrapper = styled.View`
  width: 100%;
  padding: 12px 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const PaginationBtn = styled.View`
  width: 128px;
  height: 40px;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
  background: rgba(0, 20, 42, 0.04);
`;
const ArrowImg = styled.Image`
  width: 24px;
  height: 24px;
`;
const PaginationText = styled.Text`
  font-size: 14px;
  color: rgba(0, 20, 42, 0.4);
`;
const PaginationTextNumber = styled.Text`
  color: #00142a;
`;

const TabContent = props => {
  const {isRTL} = useTheme();
  const {totalNumber, changePage, activePage} = props;
  const prePage = useCallback(() => {
    if (activePage > 1) {
      changePage(activePage - 1);
    }
  }, [activePage, changePage]);
  const nextPage = useCallback(() => {
    const total = Math.ceil(totalNumber / 10);
    if (activePage < total) {
      changePage(activePage + 1);
    }
  }, [totalNumber, activePage, changePage]);

  if (totalNumber <= 10) {
    return null;
  }
  return (
    <PaginationWrapper>
      {activePage > 1 ? (
        <TouchableOpacity activeOpacity={0.6} onPress={prePage}>
          <PaginationBtn>
            <ArrowImg source={require('assets/gembox/PagingLeft.png')} />
          </PaginationBtn>
        </TouchableOpacity>
      ) : (
        <PaginationBtn>
          <ArrowImg source={require('assets/gembox/PagingLeftGray.png')} />
        </PaginationBtn>
      )}

      {isRTL ? (
        <PaginationText>
          {Math.ceil(totalNumber / 10)}/
          <PaginationTextNumber>{activePage}</PaginationTextNumber>
        </PaginationText>
      ) : (
        <PaginationText>
          <PaginationTextNumber>{activePage}</PaginationTextNumber>/
          {Math.ceil(totalNumber / 10)}
        </PaginationText>
      )}

      {activePage < Math.ceil(totalNumber / 10) ? (
        <TouchableOpacity activeOpacity={0.6} onPress={nextPage}>
          <PaginationBtn>
            <ArrowImg source={require('assets/gembox/PagingRight.png')} />
          </PaginationBtn>
        </TouchableOpacity>
      ) : (
        <PaginationBtn>
          <ArrowImg source={require('assets/gembox/PagingRightGray.png')} />
        </PaginationBtn>
      )}
    </PaginationWrapper>
  );
};
export default TabContent;
