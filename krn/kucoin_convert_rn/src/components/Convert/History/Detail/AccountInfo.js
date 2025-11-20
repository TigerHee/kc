/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import styled from '@emotion/native';
import AccountAndIcon from 'components/Convert/Common/AccountAndIcon';
import {useTheme} from '@krn/ui';
import useLang from 'hooks/useLang';
import CoinCodeToName from 'components/Common/CoinCodeToName';
import {Platform} from 'react-native';

const Wrapper = styled.View``;
const Title = styled.Text`
  font-size: 12px;
  line-height: 20px;
  color: ${props => props.theme.colorV2.text40};
  margin-bottom: 12px;
`;
const Content = styled.View`
  background: ${props => props.theme.colorV2.cover4};
  border-radius: 8px;
  padding: 16px;
`;
const AccountWrapper = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${({index}) => (index === 1 ? '8px' : '0px')};
`;
const AccountNum = styled.Text`
  font-size: 14px;
  line-height: ${() => (Platform.OS === 'android' ? undefined : '20px')};
  font-weight: bold;
  color: ${props => props.theme.colorV2.text};
`;
export default ({account = []}) => {
  const theme = useTheme();
  const {_t, numberFormat} = useLang();

  return (
    <Wrapper>
      <Title>{_t('9sTRXSwKpKbyvA95kD8GBz')}</Title>
      <Content>
        {account.map((item, index) => {
          return (
            <AccountWrapper key={item?.type} index={index}>
              <AccountAndIcon
                type={item?.type}
                textStyle={{
                  fontSize: 12,
                  color: theme.colorV2.text40,
                  fontWeight: 'normal',
                }}
              />

              <AccountNum>
                {item?.num ? (
                  <>
                    {numberFormat(item?.num)}
                    &nbsp;
                    {<CoinCodeToName coin={item?.currency} />}
                  </>
                ) : (
                  '--'
                )}
              </AccountNum>
            </AccountWrapper>
          );
        })}
      </Content>
    </Wrapper>
  );
};
