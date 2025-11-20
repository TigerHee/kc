/**
 * Owner: brick.fan@kupotech.com
 */
import { styled, useTheme } from '@kux/mui';
import { _t } from 'tools/i18n';
import clxs from 'classnames';

import Logo1 from 'static/securityV2/light/partner-1.png';
import Logo2 from 'static/securityV2/light/partner-2.png';
import Logo3 from 'static/securityV2/light/partner-3.png';
import Logo4 from 'static/securityV2/light/partner-4.png';
import Logo5 from 'static/securityV2/light/soc2.png';

import DarkLogo1 from 'static/securityV2/dark/partner-1.png';
import DarkLogo2 from 'static/securityV2/dark/partner-2.png';
import DarkLogo3 from 'static/securityV2/dark/partner-3.png';
import DarkLogo4 from 'static/securityV2/dark/partner-4.png';

const Container = styled.div`
  margin: 0 auto;
  margin-top: 140px;
  .pa-title {
    color: ${(props) => props.theme.colors.text};
    font-weight: 700;
    font-size: 36px;
    line-height: 130%;
    text-align: center;
  }
  .pa-items {
    margin-top: 50px;
    text-align: center;
    img {
      width: 20%;
      max-width: 100px;
      margin-right: 83px;
      &:last-child {
        margin-right: 0;
      }
    }
    .pa-item {
      width: 100px;
    }
    .pa-item-soc {
      width: 80px;
    }
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    max-width: 100%;
    padding: 0 24px;
    .pa-title {
      font-size: 28px;
    }
    .pa-items {
      display: flex;
      justify-content: space-around;
      margin-top: 40px;
      img {
        width: 20%;
        max-width: 100px;
        margin-right: 0;
      }
      .pa-item-soc {
        width: 60px;
      }
    }
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    max-width: 100%;
    margin-top: 60px;
    padding: 0 16px;
    .pa-title {
      font-size: 20px;
    }
    .pa-items {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 40px;
      img {
        width: 100px;
        margin-right: 0;
      }
    }
  }
`;

const Partners = () => {
  const theme = useTheme();
  const currentTheme = theme.currentTheme || 'light';

  const images =
    currentTheme === 'light'
      ? [Logo1, Logo2, Logo3, Logo4, Logo5]
      : [DarkLogo1, DarkLogo2, DarkLogo3, DarkLogo4, Logo5];

  return (
    <Container data-inspector="security_content_partners">
      <div className="pa-title">{_t('kUKcwjfuCCkb8X1CmpNCZ9')}</div>
      <div className="pa-items">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt="partner"
            className={clxs('pa-item', { 'pa-item-soc': index === 4 })}
          />
        ))}
      </div>
    </Container>
  );
};

export default Partners;
