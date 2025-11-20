/**
 * Owner: lena@kupotech.com
 */
import React from 'react';
import { Tooltip, styled } from '@kux/mui';
import map from 'lodash/map';
import { useTranslation } from '@tools/i18n';
import defaultNationalImg from '../../../../static/images/default_national.svg';

const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
  width: 100%;
  direction: ltr;
`;
const CountryIcon = styled.img`
  width: ${(props) => (props.type === 'OT' ? '24px' : '27px')};
  height: ${(props) => (props.type === 'OT' ? '24px' : '16px')};
  margin-right: 8px;
`;
const Name = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 26px;
  color: ${(props) => props.theme.colors.text};
  margin: 0;
`;
const LabelWrapper = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  color: ${(props) => props.theme.colors.text60};
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
`;
const CountryOption = ({ country, _t }) => {
  return (
    <Wrapper className="countryOptionItem">
      <CountryIcon src={country?.icon || defaultNationalImg} type={country?.code} />
      <Name>{country?.name}</Name>

      {[1, 2].includes(country?.regionType) ? (
        <Tooltip title={_t('x38c8B5XLMgZgeMKaf5cSd')} placement="top">
          <Restricted>{_t('uCQNHSVrZKcrqS71dULWqJ')}</Restricted>
        </Tooltip>
      ) : null}
    </Wrapper>
  );
};
export const CountrySelectOption = (list) => {
  const { t: _t } = useTranslation('kyc');

  const newList = [];
  if (!list[0]?.isIpRegion) {
    newList.push({ name: '4iLnmVkvpZ11Qp8fTLLzNy', list });
  } else {
    newList.push(
      { name: '89SbX1ebY4JUAaYjhSUwsg', list: [list[0]] },
      { name: '4iLnmVkvpZ11Qp8fTLLzNy', list },
    );
  }
  const Label = ({ label }) => {
    return <LabelWrapper>{label}</LabelWrapper>;
  };
  const arr = map(newList, (item) => {
    let options = [];

    options = map(item?.list, (i) => {
      return {
        label: () => {
          return <CountryOption country={i} _t={_t} />;
        },
        value: i?.code,
        title: i?.name,
        disabled: [1, 2].includes(i?.regionType),
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
