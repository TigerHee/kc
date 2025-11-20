/**
 * Owner: larvide.peng@kupotech.com
 */
import React, { useEffect } from 'react';
import { map } from 'lodash';
import { _t } from 'tools/i18n';
import { useLocale } from '@kucoin-base/i18n';
import { helpers } from './config';
import { styled, useTheme, Button } from '@kux/mui';
import { ICArrowRightOutlined } from '@kux/icons';
import { saTrackForBiz } from 'utils/ga';

const LayOutBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const HelperWrapper = styled.div`
  width: 100%;
  ${(props) => props.theme.breakpoints.up('lg')} {
    max-width: 1200px;
    margin: 0 24px;
    padding: 80px 0 80px;
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin: 0 24px;
    padding: 40px 0 40px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    display: block;
    margin: 0 16px;
    padding: 24px 0 24px;
  }
`;

const Title = styled.h2`
  color: ${(props) => props.theme.colors.text};
  font-size: 36px;
  line-height: 130%;
  font-weight: 600;
  text-align: center;
  ${(props) => props.theme.breakpoints.up('lg')} {
    font-size: 36px;
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    font-size: 28px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 20px;
  }
`;

const HelpList = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 40px;
`;

const Card = styled.div`
  width: calc((100% - 48px) / 3);
  padding: 32px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.cover8};
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: calc((100% - 48px) / 2);
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 100%;
    padding: 24px;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.overlay};
    border: 1px solid ${({ theme }) => theme.colors.text30};
    border-radius: 12px;
    box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.04);
  }
`;
const FlexItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  ${(props) => props.theme.breakpoints.down('sm')} {
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
  }
`;
const CardIcon = styled.img`
  width: 72px;
  ${(props) => props.theme.breakpoints.down('lg')} {
    width: 72px;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    width: 56px;
  }
`;
const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  ${(props) => props.theme.breakpoints.down('sm')} {
    align-items: flex-start;
    margin-left: 24px;
  }

  .icon {
    [dir='rtl'] & {
      transform: rotate(-180deg);
    }
  }
`;
const HelpTitle = styled.h3`
  font-weight: 500;
  font-size: 24px;
  line-height: 130%;
  color: ${(props) => props.theme.colors.text};
  margin-top: 20px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 0;
    font-size: 18px;
  }
`;
const HelpDesc = styled.p`
  font-weight: 400;
  color: ${(props) => props.theme.colors.text40};
  font-size: 18px;
  line-height: 130%;
  min-height: 72px;
  margin-top: 12px;
  margin-bottom: 0;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 4px;
    font-size: 14px;
  }
`;
const ButtonWrapper = styled(Button)`
  background: none;
  color: ${({ theme }) => (theme.currentTheme === 'light' ? '#1d1d1d' : theme.colors.primary)};
  margin-top: 38px;
  ${(props) => props.theme.breakpoints.down('sm')} {
    margin-top: 20px;
  }
  &:hover {
    color: #fff;
    background: ${({ theme }) =>
      theme.currentTheme === 'light' ? '#1d1d1d' : theme.colors.primary};
  }
`;

const Helper = () => {
  const { currentTheme } = useTheme();
  const { currentLang } = useLocale();
  useEffect(() => {
    saTrackForBiz({}, ['blocks', '1'], { contentItem: 'service' });
  }, []);
  return (
    <LayOutBox>
      <HelperWrapper>
        <Title>{_t('help.kucoin')}</Title>
        <HelpList>
          {map(helpers, (item) => {
            const { icon, darkIcon, title, desc, moreLink, newTabOpen } = item || {};
            const href = typeof moreLink === 'function' ? moreLink(currentLang) : moreLink || '';
            return (
              <Card key={title}>
                <FlexItem>
                  <CardIcon src={currentTheme === 'dark' ? darkIcon : icon} alt="icon" />
                  <CardContent>
                    <HelpTitle>{_t(title)}</HelpTitle>
                    <HelpDesc>{_t(desc)}</HelpDesc>
                    <a href={href} target={newTabOpen ? '_blank' : ''} rel="noopener noreferrer">
                      <ButtonWrapper>
                        {_t('newhomepage.view.more')}{' '}
                        <ICArrowRightOutlined size="16" className="icon" />
                      </ButtonWrapper>
                    </a>
                  </CardContent>
                </FlexItem>
              </Card>
            );
          })}
        </HelpList>
      </HelperWrapper>
    </LayOutBox>
  );
};

export default Helper;
