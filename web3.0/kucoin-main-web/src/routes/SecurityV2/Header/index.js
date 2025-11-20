/**
 * Owner: larvide.peng@kupotech.com
 */
import { ICEduceOutlined } from '@kux/icons';
import { Button, styled, useMediaQuery, useTheme } from '@kux/mui';
import React, { useState } from 'react';
import LottieProvider from 'src/components/LottieProvider';
import LottieLight from 'static/securityV2/lottie/lottie-l.json';
import LottieDark from 'static/securityV2/lottie/lottie-d.json';
import BGLight from 'static/securityV2/light/bg-light.png';
import BGDark from 'static/securityV2/dark/bg-dark.png';
import { _t, _tHTML } from 'tools/i18n';
import DrawerTree from 'components/SecurityMenu/DrawerTree';
import SearchInput from 'components/SecurityMenu/SearchInput';

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  position: relative;
  z-index: 1;
  background-color: ${({ theme }) => theme.colors.background};
  background-image: url(${({ theme }) => (theme.currentTheme === 'dark' ? BGDark : BGLight)});
  background-size: cover;
  background-repeat: no-repeat;
  margin: 0 auto;
  .content {
    width: 632px;
    padding: 82px 0px 86px;
  }

  .title {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 700;
    font-size: 48px;
    font-style: normal;
    line-height: 130%;
  }

  .desc {
    padding-top: 24px;
    color: ${({ theme }) => theme.colors.text60};
    font-weight: 400;
    font-size: 16px;
    font-style: normal;
    line-height: 130%;
  }

  .action {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 48px;
    .KuxButton-root {
      margin-left: 24px;
    }
    .KuxButton-endIcon {
      width: 20px;
      height: 20px;
      margin-left: 4px;
    }
  }

  .main-img {
    position: absolute;
    top: 50px;
    right: -60px;
    z-index: -2;
    width: 550px;
    height: 400px;
  }

  ${(props) => props.theme.breakpoints.down('lg')} {
    .content {
      width: 100%;
      padding: 89px 24px 93px;
    }
    .title {
      font-size: 42px;
    }
    .desc {
      padding-top: 24px;
    }
    .main-img {
      top: -30px;
      right: -30px;
      width: 275px;
      height: 200px;
    }
  }

  ${(props) => props.theme.breakpoints.down('sm')} {
    .content {
      width: 100%;
      padding: 42px 16px 24px;
    }
    .title {
      font-size: 28px;
    }
    .desc {
      padding-top: 16px;
      font-size: 14px;
    }
    .main-img {
      display: none;
    }
    .action {
      margin-top: 32px;
      .KuxButton-root {
        margin-left: 8px;
      }
    }
  }
`;
const Lottie = styled(LottieProvider)`
  position: absolute;
  z-index: -1;
  top: 0;
  right: 0;
  margin: 50px 0;
  ${(props) => props.theme.breakpoints.down('lg')} {
    top: -10%;
    right: 0;
    width: 300px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    display: none;
  }
`;

const Header = () => {
  const theme = useTheme();
  const isSm = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [drawerTreeShow, setDrawerTreeShow] = useState(false);

  return (
    <Container>
      <div className="content">
        <div className="title">{_tHTML('9f3gKKx6kgKQykt6a3Gn5L')}</div>
        <div className="desc">{_t('rcy6yGRTNCzx3QNjiWTEo6')}</div>
        <div className="action">
          <SearchInput
            isSm={isSm}
            inputProps={{
              size: isSm ? 'medium' : 'xlarge',
            }}
            isHomePage={true}
          />
          <Button
            size={isSm ? 'basic' : 'large'}
            endIcon={!isSm && <ICEduceOutlined size={20} />}
            onClick={() => setDrawerTreeShow(true)}
            style={theme.currentTheme === 'light' ? {} : { color: '#fff' }}
          >
            {_t('f3b1d516d30b4000abd0')}
          </Button>
        </div>
      </div>
      <Lottie lottieJson={theme.currentTheme === 'light' ? LottieLight : LottieDark} loop />
      <DrawerTree
        show={drawerTreeShow}
        isHomePage={true}
        onClose={() => setDrawerTreeShow(false)}
      />
    </Container>
  );
};

export default Header;
