/**
 * Owner: willen@kupotech.com
 */
import React from 'react';
import { px2rem } from '@kufox/mui';
import { Box, Button } from '@kufox/mui';
import { _t } from 'tools/i18n';
import { styled } from '@kufox/mui';
import ImgSrc from 'static/content-creator/free-bitcoin.png';

const Wrapper = styled(Box)`
  padding: ${px2rem(48)} 0;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    flex-direction: column;
    width: 100%;
  }
`;

const Image = styled.img`
  width: 34%;
  ${(props) => props.theme.breakpoints.down('md')} {
    display: none;
  }
`;

const Text = styled.div`
  width: 49%;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 54%;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    width: 100%;
  }
`;

const TextHeader = styled.h2`
  font-size: ${px2rem(36)};
  line-height: ${px2rem(44)};
  color: #00142a;
  margin: 0 0;
  transition: all 0.3s ease-in-out;
  ${(props) => props.theme.breakpoints.down('md')} {
    font-size: ${px2rem(24)};
    line-height: ${px2rem(36)};
  }
`;

const TextContent = styled.p`
  font-size: ${px2rem(18)};
  line-height: ${px2rem(28)};
  color: rgba(0, 20, 42, 0.6);
  margin: ${px2rem(20)} 0 0 0;
  transition: all 0.3s ease-in-out;
  ${(props) => props.theme.breakpoints.down('md')} {
    margin: ${px2rem(12)} 0 0 0;
    font-size: ${px2rem(14)};
    line-height: ${px2rem(20)};
  }
`;

const SubmitButton = styled(Button)`
  min-width: ${px2rem(140)};
  min-height: ${px2rem(40)};
  margin-top: ${px2rem(24)};
  transition: all 0.3s ease-in-out;
  ${(props) => props.theme.breakpoints.down('lg')} {
    min-width: ${px2rem(160)};
    min-height: ${px2rem(48)};
    font-size: ${px2rem(18)};
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    min-width: ${px2rem(124)};
    min-height: ${px2rem(32)};
    font-size: ${px2rem(14)};
  }
`;

const Banner2 = () => {
  const goLink = () => {
    const newWindow = window.open(
      'https://docs.google.com/forms/d/1_MVBNjOlMOAVW3c55Q7YcGw0thGqj1dgFeYXERnY4Gs/edit',
    );
    newWindow.opener = null;
  };

  return (
    <Wrapper>
      <Content>
        <Image src={ImgSrc} alt="free-bitcoin" />
        <Text>
          <TextHeader>{_t('creator.second.title')}</TextHeader>
          <TextContent>{_t('creator.second.sub')}</TextContent>
          <SubmitButton onClick={goLink}>{_t('creator.second.btn')}</SubmitButton>
        </Text>
      </Content>
    </Wrapper>
  );
};

export default Banner2;
