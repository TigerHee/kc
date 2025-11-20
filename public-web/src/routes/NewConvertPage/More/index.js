/**
 * Owner: Ray.Lee@kupotech.com
 */
import { useCompliantShow } from '@kucoin-biz/compliantCenter';
import { ICArrowRight2Outlined } from '@kux/icons';
import { px2rem,styled } from '@kux/mui';
import { memo } from 'react';
import { Flex,Text } from 'src/components/Flex';
import { tenantConfig } from 'src/config/tenant';
import { _t } from 'src/tools/i18n';
import Crypto from 'static/convert/crypto.svg';
import Explore from 'static/convert/explore.svg';
import { addLangToPath } from 'tools/i18n';
import { trackClick } from 'utils/ga';

const LIST = [
  {
    title: '22Wx6pcmGnR7nE6tKPuFmf',
    content: 'jkawe4taCfxkXrLWecboEP',
    icon: Explore,
    href: addLangToPath('/earn/convert-plus'),
    track: ['ConvertPlus', '1'],
    displayKey: 'isShowConvertPlus',
  },
  {
    title: '6z7WHe6QY5Bz5cUu7ZBfd2',
    content: 'i7oi63cpvd6VHHYJ9LeEud',
    icon: Crypto,
    href: addLangToPath('/express'),
    track: ['Express', '1'],
    displayKey: 'isShowExpress',
  },
];

const Wrapper = styled.div`
  margin-top: 100px;
  /* max-width: ${px2rem(1200)};
  width: 100%;
  margin: 0 auto;

  ${(props) => props.theme.breakpoints.down('lg')} {
    padding: 0 ${px2rem(18)};
  } */
`;

const ListWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  ${(props) => props.theme.breakpoints.down('lg')} {
    flex-direction: column;
  }
`;

const ListItem = styled.a`
  border-radius: 24px;
  padding: 40px;
  background-color: ${(props) => props.theme.colors.cover2};
  background-image: url(${(props) => props.backgroundImage});
  background-repeat: no-repeat;
  background-position: right 40px bottom 20px;
  background-size: 80px;

  flex: 1;
  color: ${(props) => props.theme.colors.text};
  transition: 0.3s all ease;

  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 20px 16px;
    background-position: right 16px bottom 20px;
    background-size: 48px;
  }

  &:hover {
    color: ${(props) => props.theme.colors.text};
    transform: translateY(-5px);
  }

  &:not(:first-of-type) {
    margin-left: 40px;

    ${(props) => props.theme.breakpoints.down('lg')} {
      margin-top: 40px;
      margin-left: 0px;
    }

    ${({ theme }) => theme.breakpoints.down('sm')} {
      margin-top: 16px;
    }
  }
`;

const TitleWrapper = styled(Flex)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  ${(props) => props.theme.breakpoints.down('lg')} {
    justify-content: flex-start;
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 8px;
  }
`;

const Title = styled(Text)`
  font-size: 24px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 16px;
  }
`;

const Content = styled(Text)`
  font-size: 16px;
  width: 60%;
  min-height: 40px;

  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 80%;
    font-size: 14px;
  }
`;

const MoreTitle = styled(Text)`
  font-size: 36px;
  font-weight: 600;

  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 16px;
    font-size: 20px;
  }
`;

/**
 * More
 */
const More = (props) => {
  const { ...restProps } = props;
  const isShowExpress = useCompliantShow('kcWeb.BSfastTrade.Express.1');
  const isShowConvertPlus = useCompliantShow('kcWeb.BSfastTrade.ConvertPlus.1');

  if (![isShowExpress, isShowConvertPlus].some(Boolean)) return null;

  return (
    <Wrapper {...restProps}>
      <MoreTitle mb="24" as="h2" color="text">
        {_t('more')}
      </MoreTitle>
      <ListWrapper>
        {LIST.map(({ title, content, icon, href, track, displayKey }) => {
          const isShow = { isShowExpress, isShowConvertPlus }[displayKey];

          // 只有主站展示 convertPlus
          if (
            isShow === false ||
            (displayKey === 'isShowConvertPlus' && !tenantConfig.convertPageConfig.showConvertPlus)
          )
            return null;

          return (
            <ListItem
              key={title}
              backgroundImage={icon}
              href={href}
              target="_blank"
              onClick={() => trackClick(track)}
              data-inspector={`convert_page_more_${displayKey}`}
            >
              <TitleWrapper>
                <Title fw="700" color="text" lh="130%">
                  {_t(title)}
                </Title>
                <ICArrowRight2Outlined
                  style={{ marginLeft: '8px' }}
                  className="horizontal-flip-in-arabic"
                />
              </TitleWrapper>
              <Content color="text40" lh="150%" as="div">
                {_t(content)}
              </Content>
            </ListItem>
          );
        })}
      </ListWrapper>
    </Wrapper>
  );
};

export default memo(More);
