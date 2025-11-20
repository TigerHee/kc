/*
 * @Date: 2024-05-28 23:30:29
 * Owner: harry.lai@kupotech.com
 * @LastEditors: harry.lai harry.lai@kupotech.com
 */
import { memo, useMemo } from 'react';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'src/tools/i18n';
import { makeSlotProjectInfoList } from './constant';
import {
  CoinTitleWrap,
  StyledCoinIcon,
  StyledInfoSection,
  StyledLabel,
  StyledProjectInfo,
  StyledRow,
  StyledSection,
  StyledTagItem,
  StyledTagWrap,
  StyledValue,
  Title,
} from './styled';
import { usePullCoinInfo } from './usePullCoinInfo';

const ProjectInfo = (props) => {
  const { className, coin } = props;
  const { coinInfo } = usePullCoinInfo({ coin });
  const categories = useSelector((state) => state.categories);
  const { name, currencyName } = categories[coin] || {};
  const tagList = coinInfo?.currencyTagList;
  const projectInfoList = useMemo(() => makeSlotProjectInfoList({ currency: coin }), [coin]);
  return (
    <StyledProjectInfo className={className}>
      <StyledSection>
        <Title>{_t('d534b0a457da4000a7c7')}</Title>
        <CoinTitleWrap>
          <StyledCoinIcon hiddenLoading coin={coin} />
          <span className="coin-name">{currencyName}</span>
          <span className="label">{name}</span>
        </CoinTitleWrap>
        {!!tagList?.length && (
          <StyledTagWrap>
            {tagList.map(
              (item, idx) =>
                !!item?.title && (
                  <StyledTagItem key={item?.tagId || idx}>{item?.title}</StyledTagItem>
                ),
            )}
          </StyledTagWrap>
        )}
      </StyledSection>
      <StyledInfoSection>
        {projectInfoList.map((config) => {
          const { label, key, render } = config;
          const value = render && coinInfo[key] ? render(coinInfo[key]) : '--';
          return (
            <StyledRow key={key}>
              <StyledLabel>
                <span className="text">{label?.()}</span>
              </StyledLabel>
              <StyledValue>{value}</StyledValue>
            </StyledRow>
          );
        })}
      </StyledInfoSection>
    </StyledProjectInfo>
  );
};

export default memo(ProjectInfo);
