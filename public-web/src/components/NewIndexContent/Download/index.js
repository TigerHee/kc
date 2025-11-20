/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { px2rem, styled } from '@kufox/mui';
import previewPng from 'static/newhomepage/download/app.png';
import { _t } from 'tools/i18n';
import Down from '../HeaderDownLoad/down';
import ScrollImg from '../ScrollImg';

const WrapperBox = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  max-width: ${px2rem(1200)};
  width: 100%;
  margin: ${px2rem(32)} auto ${px2rem(96)} auto;
  ${(props) => props.theme.breakpoints.down('lg')} {
    align-items: center;
    width: 100%;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    flex-direction: column-reverse;
    width: 100%;
  }
`;

const PreviewWrap = styled.div`
  width: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  ${(props) => props.theme.breakpoints.down('md')} {
    width: 100%;
  }
`;

const Preview = styled.div`
  width: ${px2rem(480)};
  height: ${px2rem(334)};
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: ${px2rem(288)};
    height: ${px2rem(200)};
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    width: ${px2rem(351)};
    height: ${px2rem(234)};
  }
  img {
    width: 100%;
    height: 100%;
  }
`;

const Content = styled.div`
  width: 50%;
  ${(props) => props.theme.breakpoints.down('md')} {
    width: 100%;
    margin-top: ${px2rem(60)};
  }
`;

const Title = styled.h2`
  font-weight: 500;
  color: #091133;
  font-size: ${px2rem(40)};
  line-height: ${px2rem(48)};
  ${(props) => props.theme.breakpoints.down('md')} {
    font-size: ${px2rem(24)};
    line-height: ${px2rem(38)};
  }
`;

const Desc = styled.div`
  color: ${(props) => props.theme.colors.text60};
  font-size: ${px2rem(18)};
  line-height: ${px2rem(30)};
  margin-top: ${px2rem(20)};
  margin-bottom: ${px2rem(16)};
  ${(props) => props.theme.breakpoints.down('md')} {
    margin-top: ${px2rem(12)};
    margin-bottom: ${px2rem(8)};
    font-size: ${px2rem(14)};
    line-height: ${px2rem(22)};
  }
`;

const LayOutBox = styled.div`
  width: 100%;
  padding: 0 ${px2rem(24)};
  ${(props) => props.theme.breakpoints.down('md')} {
    padding: 0 ${px2rem(12)};
  }
`;

const Download = () => {
  const { isRTL } = useLocale();
  return (
    <LayOutBox data-inspector="inspector_home_download">
      <WrapperBox>
        <Content>
          <Title>{_t('newhomepage.text13')}</Title>
          <Desc>{_t('newhomepage.text14')}</Desc>
          <Down placement={isRTL ? 'left' : 'right'} />
        </Content>

        <PreviewWrap>
          <Preview>
            <ScrollImg src={previewPng} title="preview" alt="preview" />
          </Preview>
        </PreviewWrap>
      </WrapperBox>
    </LayOutBox>
  );
};

export default Download;
