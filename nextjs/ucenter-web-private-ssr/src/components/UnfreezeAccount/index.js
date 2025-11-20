/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from 'hooks/useLocale';
import { Box, Button, Checkbox, styled, useTheme } from '@kux/mui';
import { Link } from 'components/Router';
import { formatCountdown } from 'helper';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import unfreezingImgDark from 'static/account/freezing-new-dark.svg';
import unfreezingImg from 'static/account/freezing-new.svg';
import { _t, _tHTML } from 'tools/i18n';
import { ContainerWrapper, ContentWrapper, FreezIcon, link, SubDesc, Text } from './styled';

export const StyledTitle = styled.h1`
  color: ${(props) => props.theme.colors.text};
  font-size: 36px;
  font-style: normal;
  font-weight: 600;
  padding: 0;
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 24px;
  }
`;

const ONE_DAY = 8.64e7;

const StyledLink = styled(Link)`
  color: ${(props) => props.theme.colors.text};
  margin-top: 32px;
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%; /* 18.2px */
  text-decoration-line: underline;
  &:hover {
    color: ${(props) => props.theme.colors.primary};
    text-decoration-line: underline;
  }
`;

export default ({ timer = 8.64e7, canApply = false, logout = () => {}, onApply = () => {} }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { hasFreezeSub } = useSelector((state) => state.account_freeze);
  const [checked, setChecked] = useState(true);
  useLocale();

  useEffect(() => {
    dispatch({
      type: 'account_freeze/hasFreezeSub',
    });
  }, []);

  let formatedTimer = formatCountdown(timer);
  if (timer >= ONE_DAY) {
    formatedTimer = '24:00:00';
  }

  const applyEnable = timer <= 0;

  const handleCheckChange = () => {
    setChecked(!checked);
  };

  return (
    <ContainerWrapper data-inspector="unfreeze_page">
      <ContentWrapper>
        <FreezIcon>
          <img
            alt="unfreezing-icon"
            src={theme.currentTheme === 'dark' ? unfreezingImgDark : unfreezingImg}
          />
        </FreezIcon>
        <Box style={{ height: '32px' }} />
        <StyledTitle style={{ margin: 0 }}> {_t('osQ4aYcG6fazfTLcst7jDu')}</StyledTitle>
        <Text>
          {applyEnable
            ? _t('unfreeze.account.help')
            : _tHTML('frozen.account.help', { time: formatedTimer })}
        </Text>
        {canApply ? (
          <div style={{ width: '100%' }}>
            {hasFreezeSub ? (
              <SubDesc>
                <p>{_t('ikJ1K2kddtZ5qB54i6XKsY')}</p>
                <Checkbox checked={checked} onChange={handleCheckChange}>
                  {_t('2xjnCbMgy4zF83XNPVJkkp')}
                </Checkbox>
              </SubDesc>
            ) : null}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '34px' }}>
              <Button
                data-inspector="unfreeze_apply_button"
                disabled={!applyEnable}
                size="large"
                onClick={() => onApply(checked)}
                style={{
                  maxWidth: '280px',
                  width: '100%',
                  backgroundColor: !applyEnable ? theme.colors.text40 : theme.colors.primary,
                }}
              >
                {_t('apply.to.unfreeze')}
              </Button>
            </div>
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Button variant="text" onClick={logout} style={{ height: '12px' }}>
                <span css={link}> {_t('logout')}</span>
              </Button>
            </div>
          </div>
        ) : (
          <StyledLink href="/ucenter/signin">{_t('login.to.unfreeze')}</StyledLink>
        )}
      </ContentWrapper>
    </ContainerWrapper>
  );
};
