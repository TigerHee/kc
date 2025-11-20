/**
 * Owner: willen@kupotech.com
 */
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { map } from 'lodash';
import { px2rem } from '@kufox/mui';
import { Box } from '@kufox/mui';
import { _t } from 'tools/i18n';
import { useLocale } from '@kucoin-base/i18n';
import { styled } from '@kufox/mui';
import { Link } from 'components/Router';
import noDataImg from 'static/content-creator/no-data.svg';

const Wrapper = styled(Box)`
  padding: ${px2rem(80)} 0;
  transition: all 0.3s ease-in-out;
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: ${px2rem(60)} ${px2rem(24)};
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    padding: ${px2rem(40)} ${px2rem(12)};
  }
`;

const Content = styled(Box)`
  margin: 0 auto;
  width: 83.3%;
  max-width: ${px2rem(1200)};
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
  }
`;

const Title = styled.h2`
  font-size: ${px2rem(36)};
  line-height: ${px2rem(44)};
  color: #00142a;
  margin: 0 0 ${px2rem(48)} 0;
  transition: all 0.3s ease-in-out;
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin: 0 0 ${px2rem(36)} 0;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    margin: 0 0 ${px2rem(24)} 0;
    font-size: ${px2rem(24)};
    line-height: ${px2rem(36)};
  }
`;

const FlexWrapper = styled(Box)`
  display: flex;
  flex-wrap: wrap;
`;

const FlexItem = styled(Link)`
  width: 23.5%;
  margin: 0 2% 2% 0;
  padding: ${px2rem(24)} ${px2rem(24)};
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  border: 1px solid rgba(0, 20, 42, 0.08);
  border-radius: ${px2rem(12)};
  transition: all 0.3s ease-in-out;
  &:hover,
  &:active {
    background: rgba(0, 20, 42, 0.04);
  }
  &:nth-of-type(4n + 0) {
    margin-right: 0;
    ${(props) => props.theme.breakpoints.down('lg')} {
      margin-right: 3.5%;
    }
  }
  &:nth-of-type(3n + 0) {
    ${(props) => props.theme.breakpoints.down('lg')} {
      margin-right: 0;
    }
    ${(props) => props.theme.breakpoints.down('md')} {
      margin-right: 3.4%;
    }
  }
  &:nth-of-type(2n + 0) {
    ${(props) => props.theme.breakpoints.down('md')} {
      margin-right: 0;
    }
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 31%;
    margin: 0 3.5% 3.5% 0;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    width: 48.3%;
    margin: 0 3.4% 3.4% 0;
    padding: ${px2rem(24)} ${px2rem(12)};
  }
`;

const TextImage = styled.img`
  width: ${px2rem(48)};
  height: ${px2rem(48)};
  border-radius: 50%;
  transition: all 0.3s ease-in-out;
  ${(props) => props.theme.breakpoints.down('md')} {
    width: ${px2rem(36)};
    height: ${px2rem(36)};
  }
`;

const TextHead = styled.p`
  text-align: center;
  margin: ${px2rem(16)} 0 0 0;
  font-size: ${px2rem(14)};
  line-height: ${px2rem(24)};
  color: #00142a;
  word-break: break-word;
  transition: all 0.3s ease-in-out;
  ${(props) => props.theme.breakpoints.down('md')} {
    margin: ${px2rem(12)} 0 0 0;
    font-size: ${px2rem(12)};
    line-height: ${px2rem(20)};
  }
`;

const TextContent = styled.p`
  text-align: center;
  margin: ${px2rem(8)} 0 0 0;
  font-size: ${px2rem(14)};
  line-height: ${px2rem(24)};
  color: rgba(0, 20, 42, 0.6);
  word-break: break-word;
  transition: all 0.3s ease-in-out;
  ${(props) => props.theme.breakpoints.down('md')} {
    font-size: ${px2rem(12)};
    line-height: ${px2rem(20)};
  }
`;

const NoData = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NoDataImage = styled.img`
  width: 15%;
  max-width: ${px2rem(180)};
  transition: all 0.3s ease-in-out;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 25%;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    width: 28.5%;
    max-width: ${px2rem(100)};
  }
`;

const NoDataText = styled.p`
  margin: ${px2rem(12)} 0 0 0;
  font-size: ${px2rem(14)};
  line-height: ${px2rem(22)};
  text-align: center;
  color: rgba(0, 20, 42, 0.6);
  ${(props) => props.theme.breakpoints.down('md')} {
    margin: ${px2rem(8)} 0 0 0;
  }
`;

const Banner8 = () => {
  const dispatch = useDispatch();
  const { currentLang } = useLocale();
  const { topicList } = useSelector((state) => state.contentCreator);
  const show = topicList instanceof Array && topicList.length;

  useEffect(() => {
    dispatch({
      type: 'contentCreator/getTopicList',
      payload: {
        defaultLang: currentLang,
      },
    });
  }, []);

  return (
    <Wrapper>
      <Content>
        <Title>{_t('creator.fourth.title')}</Title>
        <FlexWrapper>
          {!!show ? (
            map(topicList, (item, index) => {
              return (
                <FlexItem key={`${item.iconUrl}${index}`} to={item.jumpLink}>
                  <TextImage src={item.iconUrl} alt="content-icon" />
                  <TextHead>{item.title}</TextHead>
                  <TextContent>{item.description}</TextContent>
                </FlexItem>
              );
            })
          ) : (
            <NoData>
              <NoDataImage src={noDataImg} alt="no-data" />
              <NoDataText>{_t('table.empty')}</NoDataText>
            </NoData>
          )}
        </FlexWrapper>
      </Content>
    </Wrapper>
  );
};

export default Banner8;
