/**
 * Owner: tiger@kupotech.com
 */
import React from 'react';
import { Tooltip, styled } from '@kux/mui';
import map from 'lodash/map';
import useLang from '@packages/kyc/src/hookTool/useLang';
import defaultNationalImg from '@packages/kyc/static/images/default_national.svg';

const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
  width: 100%;
  direction: ltr;
  pointer-events: none;
`;
const CountryIcon = styled.img`
  flex-shrink: 0;
  width: ${(props) => (props.type === 'OT' ? '24px' : '27px')};
  height: ${(props) => (props.type === 'OT' ? '24px' : '16px')};
  margin-right: 8px;
  opacity: ${({ isDisabled }) => (isDisabled ? 0.3 : 1)};
`;
const Name = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 26px;
  color: ${({ theme, isDisabled }) => (isDisabled ? theme.colors.text40 : theme.colors.text)};
  margin: 0;
`;
const LabelWrapper = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  color: ${(props) => props.theme.colors.text60};
  margin-top: 16px;
`;
const Restricted = styled.p`
  color: ${(props) => props.theme.colors.text60};
  background: ${(props) => props.theme.colors.cover4};
  border-radius: 4px;
  margin-left: 8px;
  padding: 2px 6px;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  flex-shrink: 0;
`;

const CountryOption = ({ country, _t, isDisabled }) => {
  return (
    <Wrapper className="countryItem">
      <CountryIcon
        className="countryItemIcon"
        src={country?.icon || defaultNationalImg}
        type={country?.code}
        isDisabled={isDisabled}
      />
      <Name className="countryItemName" isDisabled={isDisabled}>
        {country?.name}
      </Name>

      {!country?.isOptional ? (
        <Tooltip title={_t('x38c8B5XLMgZgeMKaf5cSd')} placement="top">
          <Restricted>{_t('uCQNHSVrZKcrqS71dULWqJ')}</Restricted>
        </Tooltip>
      ) : null}
    </Wrapper>
  );
};

const Label = ({ label }) => {
  return <LabelWrapper>{label}</LabelWrapper>;
};

export const CountrySelectOption = (list) => {
  const { _t } = useLang();

  // 不分组
  if (!list[0]?.isIpRegion) {
    return map(list, (i) => {
      const isDisabled = !i?.isOptional;
      return {
        label: () => {
          return <CountryOption country={i} _t={_t} isDisabled={isDisabled} />;
        },
        value: i?.code,
        title: i?.name,
        disabled: isDisabled,
      };
    });
  }

  // 分组逻辑
  const newList = [
    { name: '89SbX1ebY4JUAaYjhSUwsg', list: [list[0]] },
    { name: '4iLnmVkvpZ11Qp8fTLLzNy', list },
  ];

  const arr = map(newList, (item) => {
    let options = [];

    options = map(item?.list, (i) => {
      const isDisabled = !i?.isOptional;

      return {
        label: () => {
          return <CountryOption country={i} _t={_t} isDisabled={isDisabled} />;
        },
        value: i?.code,
        title: i?.name,
        disabled: isDisabled,
      };
    });

    return {
      label: <Label label={_t(item.name)} />,
      value: item?.name,
      options,
    };
  });

  return arr;
};
