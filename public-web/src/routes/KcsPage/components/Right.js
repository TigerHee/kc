/**
 * Owner: chris@kupotech.com
 */
import { ICArrowRight2Outlined } from '@kux/icons';
import { styled, useTheme } from '@kux/mui';
import { Link } from 'components/Router';
import R1ICON from 'static/kcs-intro/r1.svg';
import R2ICON from 'static/kcs-intro/r2.svg';
import R3ICON from 'static/kcs-intro/r3.svg';
import TitleIcon from 'static/kcs-intro/title_icon.svg';
import sensors from 'tools/ext/kc-sensors';
import { _t } from 'tools/i18n';

const Wrapper = styled.div`
  padding-top: 48px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    padding-top: 24px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding-top: 32px;
  }
`;
const SubTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 28px;
  font-weight: 600;
  line-height: 130%;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  img {
    width: 24px;
    height: 24px;
    margin-right: 12px;
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-bottom: 24px;
    font-size: 20px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-bottom: 16px;
    font-size: 16px;
    img {
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }
  }
`;
const Content = styled.div`
  display: flex;
  gap: 40px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    flex-direction: column;
    gap: 28px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    flex-direction: column;
    gap: 16px;
  }
`;
const Item = styled.div`
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.colors.divider8};
  display: flex;
  width: 373.333px;
  padding: 32px 24px 24px 24px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  flex-shrink: 0;
  img {
    width: 32px;
    height: 32px;
    margin-bottom: 12px;
  }
  h1 {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 700;
    font-size: 20px;
    line-height: 130%;
  }
  p {
    margin-top: 12px;
    color: ${({ theme }) => theme.colors.text60};
    font-weight: 400;
    font-size: 16px;
    line-height: 150%;
  }
  .rightCon {
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
    font-size: 16px;
    font-style: normal;
    cursor: pointer;
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 100%;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    gap: 16px;
    padding: 16px;
    border-radius: 12px;
    img {
      width: 24px;
      height: 24px;
    }
    h1 {
      font-weight: 600;
      font-size: 16px;
    }
    p {
      font-weight: 400;
      font-size: 14px;
    }
    .rightCon {
      font-weight: 500;
      font-size: 14px;
    }
  }
`;
const ItemCon = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;
const list = [
  {
    icon: R1ICON,
    title: _t('7cd3b3a2e6364000a620'),
    desc: _t('6fdb72d41e4c4000a9e4'),
    sensorsName: 'vip',
    url: '/vip/privilege',
  },
  {
    icon: R2ICON,
    title: _t('7b2766f537834000a23c'),
    desc: _t('686f7c8929df4000a892'),
    sensorsName: 'fees',
    url: '/vip/privilege',
  },
  {
    icon: R3ICON,
    title: _t('4ba60179294d4000a4c9'),
    desc: _t('d3d5bb10dbdb4000a74e'),
    sensorsName: 'kucard',
    url: '/kucard',
  },
];
const Right = () => {
  const { theme } = useTheme();
  const toView = (url, sensorsName) => {
    sensors.trackClick([`${sensorsName}`, `1`]);
    window.open(url, '_blank');
  };
  return (
    <Wrapper>
      <SubTitle>
        <img src={TitleIcon} alt="TitleIcon" />
        <div>{_t('ce88dba37bb24000a558')}</div>
      </SubTitle>
      <Content>
        {list?.map((i, index) => {
          const { title, desc, icon, url, sensorsName } = i || {};
          return (
            <Item key={index}>
              <ItemCon>
                <img src={icon} alt="icon" />

                <h1> {title || '--'}</h1>
                <p>{desc || '--'}</p>
              </ItemCon>
              <Link
                href={url}
                dontGoWithHref
                className="rightCon primary"
                onClick={() => toView(url, sensorsName)}
              >
                {_t('newhomepage.view.more')}
                <ICArrowRight2Outlined
                  className="ml-4 kcs-arrow"
                  size={16}
                  color={theme?.colors?.primary}
                />
              </Link>
            </Item>
          );
        })}
      </Content>
    </Wrapper>
  );
};

export default Right;
