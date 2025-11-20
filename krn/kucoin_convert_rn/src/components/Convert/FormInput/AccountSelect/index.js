/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import {TouchableOpacity} from 'react-native';
import styled from '@emotion/native';
import {useDispatch, useSelector} from 'react-redux';
import dropdownLight from 'assets/convert/dropdown_light.png';
import dropdownDark from 'assets/convert/dropdown_dark.png';
import ThemeImage from 'components/Common/ThemeImage';
import withAuth from 'hooks/withAuth';
import AccountAndIcon from 'components/Convert/Common/AccountAndIcon';

const AuthTouchableOpacity = withAuth(TouchableOpacity);

const AccountSelect = styled.View`
  flex-direction: row;
`;

const Place = styled.View`
  flex: 1;
`;

const Cont = styled.View`
  height: 32px;
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const Arrow = styled(ThemeImage)`
  width: 12px;
  height: 12px;
`;

export default props => {
  const selectAccountType = useSelector(
    state => state.convert.selectAccountType,
  );

  const dispatch = useDispatch();

  const onOpenAccountSheet = () => {
    dispatch({
      type: 'convert/update',
      payload: {
        openAccountSheet: true,
      },
    });
  };

  return (
    <AccountSelect>
      <AuthTouchableOpacity activeOpacity={1} onPress={onOpenAccountSheet}>
        <Cont>
          <AccountAndIcon
            type={selectAccountType}
            textStyle={{
              marginRight: 8,
            }}
          />
          <Arrow lightSrc={dropdownLight} darkSrc={dropdownDark} />
        </Cont>
      </AuthTouchableOpacity>
      <Place />
    </AccountSelect>
  );
};
