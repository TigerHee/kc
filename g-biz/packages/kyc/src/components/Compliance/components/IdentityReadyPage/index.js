/**
 * Owner: tiger@kupotech.com
 * 证件准备提示页
 */
import { useEffect } from 'react';
import { styled, useTheme } from '@kux/mui';
import classnames from 'classnames';
import { Wrapper, ContentBox, FooterBtnBox } from '@kycCompliance/components/commonStyle';
import { GetIdentityReadyData } from '@kycCompliance/service';
import useFetch from '@kycCompliance/hooks/useFetch';
import useCommonData from '@kycCompliance/hooks/useCommonData';
import { getIdType } from '@kycCompliance/config';
import id_icon_light from './img/light/ID.png';
import driver_icon_light from './img/light/Driver.png';
import passport_icon_light from './img/light/Passport.png';
import id_icon_dark from './img/dark/ID.png';
import driver_icon_dark from './img/dark/Driver.png';
import passport_icon_dark from './img/dark/Passport.png';

const IMG_CONFIG = {
  light: {
    1: id_icon_light,
    2: passport_icon_light,
    3: driver_icon_light,
  },
  dark: {
    1: id_icon_dark,
    2: passport_icon_dark,
    3: driver_icon_dark,
  },
};

const Banner = styled.div`
  display: flex;
  justify-content: center;
  /* padding: 32px 0; */
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.cover2};
`;
const BannerImg = styled.img`
  width: 240px;
  height: 220px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 194px;
    height: 178px;
  }
  &.isSmStyle {
    width: 194px;
    height: 178px;
  }
`;
const Title = styled.div`
  font-size: 24px;
  line-height: 130%;
  font-weight: 700;
  margin-top: 24px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.text};
`;
const ListItem = styled.div`
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 400;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text60};
  display: flex;
  align-items: center;
  &::before {
    content: '';
    display: flex;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 12px;
    background-color: #d9d9d9;
    flex-shrink: 0;
  }
`;

export default ({ onNextPage, onPrePage }) => {
  const { isSmStyle, formData, setInnerPageElements } = useCommonData();
  const {
    data: { pageElements: data },
  } = useFetch(GetIdentityReadyData, {
    params: {
      identityType: getIdType(formData),
    },
    ready: getIdType(formData),
    cacheKey: 'IdentityReadyPage',
  });
  const { currentTheme } = useTheme();

  // 设置innerPageElements，顶部返回按钮要用
  useEffect(() => {
    setInnerPageElements(data);
  }, [data]);

  return (
    <Wrapper>
      <ContentBox
        className={classnames({
          isSmStyle,
        })}
      >
        <Banner
          className={classnames({
            isSmStyle,
          })}
        >
          <BannerImg
            className={classnames({
              isSmStyle,
            })}
            src={IMG_CONFIG?.[currentTheme]?.[getIdType(formData)]}
            alt=""
          />
        </Banner>
        <Title>{data?.pageContentTitle}</Title>
        {[data?.pageContentTxt1, data?.pageContentTxt2, data?.pageContentTxt3].map((item) => {
          return item ? <ListItem key={item}>{item}</ListItem> : null;
        })}
      </ContentBox>

      <FooterBtnBox
        onNext={onNextPage}
        onPre={onPrePage}
        preText={data?.pagePreButtonTxt}
        nextText={data?.pageNextButtonTxt}
      />
    </Wrapper>
  );
};
