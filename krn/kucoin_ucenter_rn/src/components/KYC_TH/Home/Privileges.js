import React from 'react';
import {useSelector} from 'react-redux';
import {useTheme} from '@krn/ui';
import useLang from 'hooks/useLang';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
import {Empty} from './Placeholder';
import {kycStatusEnum} from './config';
import {
  TagBox,
  TagText,
  CheckIcon,
  RightsTable,
  RightsTitle,
  Table,
  THeader,
  Cell,
  CellText,
  TR,
  CellView,
  TBody,
  ColorText,
} from './style';

const Tag = ({children}) => {
  return (
    <TagBox>
      <TagText>{children}</TagText>
    </TagBox>
  );
};

const Uncheck = () => {
  const theme = useTheme();

  return theme?.type === 'dark' ? (
    <CheckIcon source={require('assets/dark/uncheck.png')} autoRotateDisable />
  ) : (
    <CheckIcon source={require('assets/light/uncheck.png')} autoRotateDisable />
  );
};

const Check = ({active}) => {
  const theme = useTheme();
  return active ? (
    <CheckIcon
      source={require('assets/common/primaryCheck.png')}
      autoRotateDisable
    />
  ) : (
    <>
      {theme?.type === 'dark' ? (
        <CheckIcon
          source={require('assets/dark/check.png')}
          autoRotateDisable
        />
      ) : (
        <CheckIcon
          source={require('assets/light/check.png')}
          autoRotateDisable
        />
      )}
    </>
  );
};

const TableContext = React.createContext();
const TD = props => {
  const {width} = React.useContext(TableContext);
  return <Cell {...props} cellWidth={width} />;
};
const TDView = props => {
  const {width} = React.useContext(TableContext);
  return <CellView {...props} viewWidth={width} />;
};
/**
 * @description:
 * @param {*} children
 * @param {*} align (center, right)
 * @param {array} rest
 * @return {*}
 */
const TDBox = ({children, align, color, ...rest}) => {
  return (
    <TDView {...rest} align={align === 'right' ? 'flex-end' : align}>
      {typeof children === 'object' ? (
        children
      ) : (
        <ColorText textColor={children === '-' ? 'icon40' : color}>
          {children === '-' ? '一' : children}
        </ColorText>
      )}
    </TDView>
  );
};

const empty = ' ';

const getValue = ({
  privileges,
  item,
  isLoading,
  isRTL,
  isBaseVerified,
  isAdvanceVerified,
}) => {
  const isFetched = !isEmpty(privileges);
  if (!isFetched || isLoading) {
    return {
      currentValue: <Empty />,
      verifiedValue: <Empty />,
      hidden: false,
    };
  }
  const current = privileges?.standard || {};
  let currentValue;
  const verified = privileges?.advance || {};
  let verifiedValue;
  let hidden = false;
  if (['withDrawLimit'].includes(item.key)) {
    if (+current[item.key] === -1 || +verified[item.key] === -1) hidden = true;
    currentValue = current[item.key]
      ? isRTL
        ? `${current[item.unitKey]} ${current[item.key]}`
        : `${current[item.key]} ${current[item.unitKey]}`
      : empty;
    verifiedValue = verified[item.key]
      ? isRTL
        ? `${verified[item.unitKey]} ${verified[item.key]}`
        : `${verified[item.key]} ${verified[item.unitKey]}`
      : empty;
  } else if (['fiatLimit'].includes(item.key)) {
    if (+current[item.key] === -2 || +verified[item.key] === -2) hidden = true;
    if (+current[item.key] === -1) currentValue = <Uncheck />;
    else currentValue = <Check active={isBaseVerified && !isAdvanceVerified} />;
    if (+verified[item.key] === -1) currentValue = <Uncheck />;
    else verifiedValue = <Check active={isAdvanceVerified} />;
  } else if (['trading'].includes(item.key)) {
    currentValue = current[item.key] ? (
      <Check active={isBaseVerified && !isAdvanceVerified} />
    ) : (
      <Uncheck />
    );
    verifiedValue = verified[item.key] ? (
      <Check active={isAdvanceVerified} />
    ) : (
      <Uncheck />
    );
  }

  return {
    currentValue,
    verifiedValue,
    hidden,
  };
};
const UserRightsTable = ({
  privileges,
  _t,
  isLoading,
  status,
  advanceStatus,
}) => {
  const {isRTL} = useTheme();

  const isBaseVerified = [kycStatusEnum.KYC_VERIFIED].includes(status);

  const isAdvanceVerified = [kycStatusEnum.ADVANCE_VERIFIED].includes(
    advanceStatus,
  );

  const common = {
    width: '33.3%',
  };

  return (
    <TableContext.Provider value={common}>
      <Table>
        <THeader>
          <TD textColor="text40">{_t('kyc.limits.title1')}</TD>
          <TDView align="center">
            <CellText textColor="text40">{_t('07e9663790df4000a960')}</CellText>
            {isBaseVerified && !isAdvanceVerified ? (
              <Tag>{_t('kyc.limits.title22')}</Tag>
            ) : null}
          </TDView>
          <TDView align="flex-end">
            <CellText textColor="text40">{_t('ba8efe58d5fb4000a605')}</CellText>
            {isAdvanceVerified && <Tag>{_t('kyc.limits.title22')}</Tag>}
          </TDView>
        </THeader>
        <TBody>
          {limitList.map(item => {
            const {hidden, currentValue, verifiedValue} = getValue({
              privileges,
              item,
              _t,
              isLoading,
              isRTL,
              isBaseVerified,
              isAdvanceVerified,
            });

            return hidden ? null : (
              <TR key={item.key}>
                <TD textColor="text40">{_t(item.title)}</TD>
                <TDBox
                  align="center"
                  color={
                    isBaseVerified && !isAdvanceVerified ? 'primary' : 'text'
                  }
                  fw={500}>
                  {currentValue}
                </TDBox>
                <TDBox
                  align="right"
                  color={isAdvanceVerified ? 'primary' : 'text'}>
                  {isString(verifiedValue) &&
                  verifiedValue?.includes('NotLimit')
                    ? _t('c89e114801b14000a3a6')
                    : verifiedValue}
                </TDBox>
              </TR>
            );
          })}
        </TBody>
      </Table>
    </TableContext.Provider>
  );
};

const limitList = [
  {
    key: 'withDrawLimit',
    title: 'kyc.homepage.withdraw',
    unitKey: 'withdrawUnit',
  },
  // {key: 'p2pLimit', title: 'kyc.homepage.P2P', unitKey: 'p2pUnit'},
  {key: 'trading', title: 'kyc.homepage.trade'},
  {key: 'fiatLimit', title: 'kyc.homepage.deposit'},
  // {key: 'earnCoin', title: 'kyc.homepage.earn'},
  // {key: 'leverLimit', title: 'kyc.homepage.leverage'},
];

const Privileges = React.memo(({isLoading, status, ...otherProps}) => {
  const {_t} = useLang();
  const privileges = useSelector(state => state.kyc_th.privileges);
  return (
    <RightsTable>
      <RightsTitle>{_t('kyc.homepage.limittitle')}</RightsTitle>
      <UserRightsTable
        _t={_t}
        privileges={privileges}
        status={status}
        isLoading={isLoading}
        {...otherProps}
      />
    </RightsTable>
  );
});

export default Privileges;
