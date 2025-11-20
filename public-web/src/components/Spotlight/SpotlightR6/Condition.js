/**
 * Owner: jessie@kupotech.com
 */
import { ICArrowRightOutlined, ICHookOutlined, ICInfoFilled } from '@kux/icons';
import { styled } from '@kux/mui';
import { memo, useCallback, useEffect } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import useShow from 'TradeActivity/hooks/useShow.js';
import { useKyc } from './hooks';

const Wrapper = styled.div`
  width: 100%;
  svg {
    width: 16px;
    min-width: 16px;
    max-width: 16px;
    height: 21px;
    margin-right: 4px;
  }

  span {
    display: inline-block;
    width: 200px;
    color: rgba(225, 232, 245, 0.4);
    font-weight: 400;
    font-size: 16px;
    line-height: 21px;
    text-align: right;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    span {
      width: 108px;
      height: 21px;
      font-size: 14px;
      line-height: 18px;
      text-align: right;
    }
  }
`;

const Title = styled.h2`
  font-weight: 600;
  font-size: 16px;
  line-height: 21px;
  color: #e1e8f5;
  margin-bottom: 14px;
`;

const IconDone = styled(ICHookOutlined)`
  color: #01bc8d;
`;

const IconNormal = styled(ICInfoFilled)`
  color: #737e8d;
`;

const IconNot = styled(ICInfoFilled)`
  color: #f65454;
`;

const Items = styled.div`
  margin-bottom: 120px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-bottom: 102px;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 80px;
  }
`;

const Item = styled.div`
  margin-bottom: 14px;
  display: flex;
  align-items: flex-start;
`;

const ItemTitle = styled.div`
  font-weight: 400;
  font-size: 16px;
  line-height: 21px;
  color: rgba(225, 232, 245, 0.68);
  display: flex;
  align-items: flex-start;
  flex: 1;
  width: 400px;
  margin-right: 60px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    flex: 1;
    margin-right: 20px;
    font-size: 14px;
    line-height: 18px;
  }
`;

const ItemContent = styled.a`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #01bc8d !important;
  display: flex;
  align-items: center;
  width: 200px;
  justify-content: flex-end;

  svg {
    width: 18px;
    min-width: 18px;
    max-width: 18px;
    height: 18px;
    margin-right: 0;
    [dir='rtl'] & {
      transform: rotate(180deg) /* rtl:ignore */;
    }
  }

  &.done {
    color: rgba(225, 232, 245, 0.4) !important;
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 108px;
    font-size: 14px;
    line-height: 18px;
    text-align: right;
    svg {
      width: 16px;
      min-width: 16px;
      max-width: 16px;
      height: 16px;
      margin-right: 0;
    }
  }
`;

const Condition = ({ id }) => {
  const qualification = useSelector((state) => state.spotlight.qualification, shallowEqual);
  const isLogin = useSelector((state) => state.user.isLogin);
  const { handleKyc } = useKyc();
  const dispatch = useDispatch();

  const { completedKyc, signedCountryAgreement, signedAgreement } = qualification || {};

  const getQualification = useCallback(() => {
    if (id && isLogin) {
      dispatch({ type: 'spotlight/getQualification', payload: { id } });
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
      type: 'spotlight/update',
      payload: {
        showBlackListDrawer: true,
      },
    });
  };

  const openAgreement = () => {
    dispatch({
      type: 'spotlight/update',
      payload: {
        showAgreementDrawer: true,
      },
    });
  };

  const openKyc = () => {
    handleKyc();
  };

  return (
    <Wrapper>
      <Title>{_t('dd3d5NmJhJxHRaDahoB6bx')}</Title>
      <Items>
        <Item>
          <ItemTitle>
            {IconComp(completedKyc)}
            {`${_t('7VMoouXDytKtLjuBPzDEHo')}${_t('ttzzaSsLVqhuZwvDFiZE6B')}`}
          </ItemTitle>
          {completedKyc || !isLogin ? (
            <span>
              {completedKyc ? _t('gTELmx9PYyeoWmGoBKSbEL') : _t('9haCL2x5Fs36T1WaqbWbcc')}
            </span>
          ) : (
            <ItemContent onClick={openKyc}>
              {_t('ohdRNr4JEScytXc9VdsDR6')} <ICArrowRightOutlined />
            </ItemContent>
          )}
        </Item>

        <Item>
          <ItemTitle>
            {IconComp(signedCountryAgreement)}
            {_t('t26W3eqYKv4yHDnZRPiAiT')}
          </ItemTitle>
          <ItemContent className={signedCountryAgreement ? 'done' : ''} onClick={openBlackList}>
            {!signedCountryAgreement ? _t('5YMMQUMhgkji9daWAhSB7G') : _t('fCHxaxHEi9J6KJL68H5Xzm')}
            <ICArrowRightOutlined />
          </ItemContent>
        </Item>

        <Item>
          <ItemTitle>
            {IconComp(signedAgreement)}
            {_t('584aDq5v1gApdLcKRbRw1g')}
          </ItemTitle>
          <ItemContent className={signedAgreement ? 'done' : ''} onClick={openAgreement}>
            {!signedAgreement ? _t('5YMMQUMhgkji9daWAhSB7G') : _t('fCHxaxHEi9J6KJL68H5Xzm')}
            <ICArrowRightOutlined />
          </ItemContent>
        </Item>
      </Items>
    </Wrapper>
  );
};

export default memo(Condition);
