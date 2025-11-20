/**
 * Owner: jessie@kupotech.com
 */
import { ICArrowRightOutlined, ICSuccessOutlined, ICWarningOutlined } from '@kux/icons';
import { styled } from '@kux/mui';
import { useKyc } from 'components/Spotlight/SpotlightR7/hooks';
import { memo, useCallback, useEffect } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import book from 'static/spotlight8/book.svg';
import bookLight from 'static/spotlight8/bookLight.svg';
import { _t } from 'tools/i18n';
import useShow from 'TradeActivity/hooks/useShow.js';
import { skip2Login } from 'TradeActivity/utils';
import AnchorPlaceholder from 'TradeActivityCommon/AnchorPlaceholder';
import Title from './Title';

const Wrapper = styled.section`
  position: relative;
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 0 24px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 0 16px;
  }
`;

const IconDone = styled(ICSuccessOutlined)`
  color: ${(props) => props.theme.colors.primary};
`;

const IconNormal = styled(ICWarningOutlined)`
  color: ${(props) => props.theme.colors.icon};
`;

const IconNot = styled(ICWarningOutlined)`
  color: ${(props) => props.theme.colors.secondary};
`;

const Items = styled.div`
  width: 100%;
  border: 1px solid ${(props) => props.theme.colors.cover8};
  border-radius: 12px;
  position: relative;
  padding: 31px 47px;

  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 31px 23px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 19px 15px;
  }
`;

const Item = styled.div`
  margin-bottom: 24px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  position: relative;
  z-index: 1;

  &:last-of-type {
    margin-bottom: 0;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    flex-direction: column;
  }
`;

const ItemTitle = styled.div`
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
  color: ${(props) => props.theme.colors.text};
  display: flex;
  align-items: flex-start;
  margin-right: 12px;

  svg {
    width: 20px;
    min-width: 20px;
    max-width: 20px;
    height: 20px;
    margin-top: 2px;
    margin-right: 12px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-right: 0;
    font-size: 14px;
    line-height: 130%;

    svg {
      width: 16px;
      min-width: 16px;
      max-width: 16px;
      height: 16px;
      margin-right: 8px;
    }
  }
`;

const ItemContent = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  text-align: right;
  cursor: pointer;

  svg {
    width: 16px;
    min-width: 16px;
    max-width: 16px;
    height: 16px;
    margin-right: 0;
    [dir='rtl'] & {
      transform: rotate(180deg) /* rtl:ignore */;
    }
  }

  &.done {
    color: ${(props) => props.theme.colors.text40};
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 8px;
    padding-left: 24px;
    font-size: 14px;
    text-align: left;
  }
`;

const ItemContentText = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text40};
  width: 240px;
  text-align: right;

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
    margin-top: 8px;
    padding-left: 24px;
    font-size: 14px;
    text-align: left;
  }
`;

const Condition = () => {
  const id = useSelector((state) => state.spotlight8.detailInfo?.campaignId);
  const qualification = useSelector((state) => state.spotlight8.qualification, shallowEqual);
  const isLogin = useSelector((state) => state.user.isLogin);
  const currentTheme = useSelector((state) => state.setting.currentTheme);
  const { handleKyc } = useKyc();
  const dispatch = useDispatch();
  const { completedKyc, signedCountryAgreement, signedAgreement } = qualification || {};

  const getQualification = useCallback(() => {
    if (id && isLogin) {
      dispatch({ type: 'spotlight8/getQualification', payload: { id } });
    }
  }, [dispatch, id, isLogin]);

  useShow(getQualification);

  useEffect(() => {
    getQualification();
  }, [getQualification]);

  const IconComp = useCallback(
    (status) => {
      if (!isLogin) return <IconNormal />;
      return status ? <IconDone /> : <IconNot />;
    },
    [isLogin],
  );

  const openBlackList = () => {
    dispatch({
      type: 'spotlight8/update',
      payload: {
        showBlackListDrawer: true,
      },
    });
  };

  const openAgreement = () => {
    dispatch({
      type: 'spotlight8/update',
      payload: {
        showAgreementDrawer: true,
      },
    });
  };

  const openKyc = () => {
    if (!isLogin) {
      skip2Login();
      return;
    }
    handleKyc();
  };

  return (
    <Wrapper>
      <AnchorPlaceholder id="requirements" />
      <Title
        title={_t('dd3d5NmJhJxHRaDahoB6bx')}
        icon={currentTheme === 'dark' ? book : bookLight}
      />
      <Items>
        <Item>
          <ItemTitle>
            {IconComp(completedKyc)}
            {_t('7VMoouXDytKtLjuBPzDEHo')}
          </ItemTitle>
          {completedKyc ? (
            <ItemContentText>{_t('gTELmx9PYyeoWmGoBKSbEL')}</ItemContentText>
          ) : (
            <ItemContent onClick={openKyc}>
              {!isLogin ? _t('9haCL2x5Fs36T1WaqbWbcc') : _t('ohdRNr4JEScytXc9VdsDR6')}
              <ICArrowRightOutlined />
            </ItemContent>
          )}
        </Item>

        <Item>
          <ItemTitle>
            {IconComp(signedCountryAgreement)}
            {_t('t26W3eqYKv4yHDnZRPiAiT')}
          </ItemTitle>
          <ItemContent
            // className={signedCountryAgreement || !isLogin ? 'done' : ''}
            onClick={openBlackList}
          >
            {!signedCountryAgreement && isLogin
              ? _t('5YMMQUMhgkji9daWAhSB7G')
              : _t('fCHxaxHEi9J6KJL68H5Xzm')}
            <ICArrowRightOutlined />
          </ItemContent>
        </Item>

        <Item>
          <ItemTitle>
            {IconComp(signedAgreement)}
            {_t('584aDq5v1gApdLcKRbRw1g')}
          </ItemTitle>
          <ItemContent
            // className={signedAgreement || !isLogin ? 'done' : ''}
            onClick={openAgreement}
          >
            {!signedAgreement && isLogin
              ? _t('5YMMQUMhgkji9daWAhSB7G')
              : _t('fCHxaxHEi9J6KJL68H5Xzm')}
            <ICArrowRightOutlined />
          </ItemContent>
        </Item>
      </Items>
    </Wrapper>
  );
};

export default memo(Condition);
