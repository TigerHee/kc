import React from 'react';
import {useSelector} from 'react-redux';
import {useTheme} from '@krn/ui';
import useLang from 'hooks/useLang';
import isEmpty from 'lodash/isEmpty';
import {Empty} from './Placeholder';
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
import {Text} from 'react-native';

const Tag = ({children}) => {
  return (
    <TagBox>
      <TagText>{children}</TagText>
    </TagBox>
  );
};

const Uncheck = () => {
  return <Text>--</Text>;
  // const theme = useTheme();
  // return theme?.type === 'dark' ? (
  //   <CheckIcon source={require('assets/dark/uncheck.png')} autoRotateDisable />
  // ) : (
  //   <CheckIcon source={require('assets/light/uncheck.png')} autoRotateDisable />
  // );
};

const Check = () => {
  return (
    <CheckIcon
      source={require('assets/common/green_check.png')}
      autoRotateDisable
    />
  );
  // const theme = useTheme();
  // return theme?.type === 'dark' ? (
  //   <CheckIcon source={require('assets/dark/check.png')} autoRotateDisable />
  // ) : (
  //   <CheckIcon source={require('assets/light/check.png')} autoRotateDisable />
  // );
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

const getValue = ({privileges, currentLevel, item, _t, isLoading, isRTL}) => {
  const isFetched = !isEmpty(privileges);
  if (!isFetched || isLoading) {
    return {
      currentValue: <Empty />,
      verifiedValue: <Empty />,
      hidden: false,
    };
  }
  const current = privileges?.[currentLevel] || {};
  let currentValue;
  const verified = privileges?.kyc3 || {};
  let verifiedValue;
  let hidden = false;
  if (['withDrawLimit', 'p2pLimit'].includes(item.key)) {
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
  } else if (['leverLimit'].includes(item.key)) {
    if (+current[item.key] === -2 || +verified[item.key] === -2) hidden = true;
    if (+current[item.key] === -1) currentValue = <Uncheck />;
    else
      currentValue = current[item.key]
        ? _t('kyc.homepage.max', {
            num: current[item.key],
          })
        : empty;
    if (+verified[item.key] === -1) currentValue = <Uncheck />;
    else
      verifiedValue = verified[item.key]
        ? _t('kyc.homepage.max', {
            num: verified[item.key],
          })
        : empty;
  } else if (['fiatLimit'].includes(item.key)) {
    if (+current[item.key] === -2 || +verified[item.key] === -2) hidden = true;
    if (+current[item.key] === -1) currentValue = <Uncheck />;
    else currentValue = <Check />;
    if (+verified[item.key] === -1) currentValue = <Uncheck />;
    else verifiedValue = <Check />;
  } else if (['trading', 'earnCoin'].includes(item.key)) {
    currentValue = current[item.key] ? <Check /> : <Uncheck />;
    verifiedValue = verified[item.key] ? <Check /> : <Uncheck />;
  }

  return {
    currentValue,
    verifiedValue,
    hidden,
  };
};
const UserRightsTable = ({currentLevel, privileges, _t, isLoading}) => {
  const {isRTL} = useTheme();
  const common = {
    width: currentLevel === 'kyc3' ? '50%' : '33.3%',
  };

  return (
    <TableContext.Provider value={common}>
      <Table>
        <THeader>
          <TD textColor="text40">{_t('kyc.limits.title1')}</TD>
          {currentLevel !== 'kyc3' && (
            <TDView align="center">
              <CellText textColor="text40">{_t('kyc.limits.title21')}</CellText>
              <Tag>{_t('kyc.limits.title22')}</Tag>
            </TDView>
          )}
          <TDView align="flex-end">
            <CellText textColor="text40">{_t('kyc.limits.title3')}</CellText>
            {currentLevel === 'kyc3' && <Tag>{_t('kyc.limits.title22')}</Tag>}
          </TDView>
        </THeader>
        <TBody>
          {limitList.map(item => {
            const {hidden, currentValue, verifiedValue} = getValue({
              privileges,
              currentLevel,
              item,
              _t,
              isLoading,
              isRTL,
            });
            return hidden ? null : (
              <TR key={item.key}>
                <TD textColor="text40">{_t(item.title)}</TD>
                {currentLevel !== 'kyc3' && (
                  <TDBox align="center" color="text" fw={500}>
                    {currentValue}
                  </TDBox>
                )}
                <TDBox align="right" color="primary">
                  {verifiedValue}
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
  {key: 'p2pLimit', title: 'kyc.homepage.P2P', unitKey: 'p2pUnit'},
  {key: 'trading', title: 'kyc.homepage.trade'},
  {key: 'fiatLimit', title: 'kyc.homepage.deposit'},
  {key: 'earnCoin', title: 'kyc.homepage.earn'},
  {key: 'leverLimit', title: 'kyc.homepage.leverage'},
];

const getKYCStatus = kycInfo => {
  if (
    kycInfo?.verifyStatus === 5 ||
    (kycInfo?.verifyStatus === 1 && kycInfo?.regionType !== 3)
  ) {
    // 假失败展示1
    return 'kyc1';
  } else if (kycInfo?.verifyStatus === 1) {
    return 'kyc3';
  } else if (kycInfo?.intermediateVerifyStatus === 1) {
    return 'kyc2';
  } else if (kycInfo?.primaryVerifyStatus === 1) {
    return 'kyc1';
  } else {
    return 'kyc0';
  }
};
const Privileges = React.memo(({isLoading, noMarginTop}) => {
  const {_t} = useLang();
  const kycInfo = useSelector(s => s.kyc.kycInfo);
  const privileges = useSelector(state => state.kyc.privileges);
  const currentLevel = getKYCStatus(kycInfo);
  return (
    <RightsTable noMarginTop={noMarginTop}>
      <RightsTitle>{_t('kyc.homepage.limittitle')}</RightsTitle>
      <UserRightsTable
        _t={_t}
        currentLevel={currentLevel}
        privileges={privileges}
        isLoading={isLoading}
      />
    </RightsTable>
  );
});

export default Privileges;
