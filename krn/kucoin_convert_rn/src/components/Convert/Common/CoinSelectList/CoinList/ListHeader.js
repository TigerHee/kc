/**
 * Owner: willen@kupotech.com
 */
import styled from '@emotion/native';
import React from 'react';
import useLang from 'hooks/useLang';
import {useSelector} from 'react-redux';
import hotIcon from 'assets/common/firehot.png';
import deleteIcon from 'assets/common/delete.png';
import ThemeImage from 'components/Common/ThemeImage';

const Contianer = styled.View`
  margin: 0 16px;
`;

const CommonlyWrapper = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 16px;
`;

const DeleteWrapper = styled.TouchableOpacity`
  width: 16px;
  height: 16px;
`;

const Delete = styled(ThemeImage)`
  width: 16px;
  height: 16px;
`;

const HotTitle = styled.Text`
  font-size: 12px;
  font-weight: 400;
  color: ${props => props.theme.colorV2.text40};
`;

export const HotImg = styled(ThemeImage)`
  width: 16px;
  height: 16px;
`;

export const HotIcon = ({...restProps}) => {
  return <HotImg lightSrc={hotIcon} darkSrc={hotIcon} {...restProps} />;
};

const CoinWrapper = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const HotItemWrapper = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 30px;
  padding: 0 12px;
  margin-right: 8px;
  border-radius: 4px;
  background-color: ${props => props.theme.colorV2.cover2};
  margin-top: 10px;
`;

const HotItem = styled.Text`
  color: ${props => props.theme.colorV2.text60};

  font-size: 14px;
  font-weight: 500;
`;

const TitleWrapper = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 24px 0 8px;
`;
const KeyName = styled.Text`
  font-size: 12px;
  line-height: 15.6px;
  color: ${props => props.theme.colorV2.text40};
`;

export default ({
  showBalance,
  orderHotsList = [],
  commonSelectedList = [],
  handleSelect,
  handleDelete,
}) => {
  const {_t} = useLang();
  const selectAccountType = useSelector(
    state => state.convert.selectAccountType,
  );

  return (
    <Contianer>
      {!!commonSelectedList.length && (
        <>
          <CommonlyWrapper>
            <HotTitle>{_t('qaFjowFSaCHbheQgMaGCQR')}</HotTitle>
            <DeleteWrapper
              activeOpacity={0.6}
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              onPress={handleDelete}>
              <Delete lightSrc={deleteIcon} darkSrc={deleteIcon} />
            </DeleteWrapper>
          </CommonlyWrapper>

          <CoinWrapper>
            {commonSelectedList.map((coin, i) => (
              <HotItemWrapper
                key={coin}
                activeOpacity={0.6}
                onPress={() => handleSelect({coin}, i)}>
                <HotItem>{coin}</HotItem>
              </HotItemWrapper>
            ))}
          </CoinWrapper>
        </>
      )}

      {!!orderHotsList.length && (
        <>
          <CommonlyWrapper>
            <HotTitle>{_t('dGXZ1xSsxk9wp7Fo6YeUDp')}</HotTitle>
          </CommonlyWrapper>
          <CoinWrapper>
            {orderHotsList.map((coin, i) => (
              <HotItemWrapper
                key={coin}
                activeOpacity={0.6}
                onPress={() => handleSelect({coin}, i)}>
                {i === 0 && <HotIcon />}
                <HotItem>{coin}</HotItem>
              </HotItemWrapper>
            ))}
          </CoinWrapper>
        </>
      )}

      <TitleWrapper>
        <KeyName
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={{flex: 1, marginRight: 5}}>
          {_t('2RHF5n7NYQALMWKiJmMx4U')}
        </KeyName>
        {showBalance ? (
          <KeyName>
            {selectAccountType === 'MAIN'
              ? _t('hKSimpY7xAA7RC9itjnd9b')
              : selectAccountType === 'TRADE'
              ? _t('1BBYwjauG8p1QE7ByqMeyb')
              : _t('86TE4UxS3PafGBGAPCX84Q')}
          </KeyName>
        ) : null}
      </TitleWrapper>
    </Contianer>
  );
};
