import { styled, useTheme } from '@kux/mui';
import { useEffect, useState } from 'react';
import { bootConfig, getSiteConfig } from 'kc-next/boot';
import { useDispatch, useSelector } from 'react-redux';
import { LEVEL_COPY_TEXT_ENUMS, LEVEL_ENUMS } from 'src/constants/security/score';
import { _t } from 'src/tools/i18n';
import { push } from 'src/utils/router';
import storage from 'src/utils/storage';
import { ReactComponent as GuardIcon } from 'static/security/score/guard.svg';
import { kcsensorsManualExpose, trackClick } from 'utils/ga';

const ExGuardIcon = styled(GuardIcon)`
  transform-origin: center;
  &.shake {
    animation: shake 1s ease-in-out;
  }
  @keyframes shake {
    0% {
      transform: rotate(0deg);
    }
    10% {
      transform: rotate(-20deg);
    }
    20% {
      transform: rotate(20deg);
    }
    30% {
      transform: rotate(-15deg);
    }
    40% {
      transform: rotate(15deg);
    }
    50% {
      transform: rotate(-10deg);
    }
    60% {
      transform: rotate(10deg);
    }
    70% {
      transform: rotate(-5deg);
    }
    80% {
      transform: rotate(5deg);
    }
    90% {
      transform: rotate(-2deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
`;

const getKey = (uid) => `security_guard_first_exposure_${uid}`;

const U = styled.u`
  cursor: pointer;
`;

const TextNode = ({ loaded, level, color }) => {
  const theme = useTheme();
  const { uid } = useSelector((state) => state.user?.user ?? {});
  const [shouldShake, setShouldShake] = useState(false);

  useEffect(() => {
    kcsensorsManualExpose(['security_score']);
  }, []);

  useEffect(() => {
    if (uid) {
      const res = storage.getItem(getKey(uid));
      if (res !== '1') {
        storage.setItem(getKey(uid), '1');
        setShouldShake(true);
      }
    }
  }, [uid]);

  if (!loaded) {
    return (
      <>
        <ExGuardIcon color={theme.colors.primary} className={shouldShake ? 'shake' : ''} />
        <span>{_t('securityGuard.lastStatus', { status: '--' })}</span>
      </>
    );
  }
  const text = LEVEL_COPY_TEXT_ENUMS[level] ? (
    _t('securityGuard.lastStatus', { status: LEVEL_COPY_TEXT_ENUMS[level].title() })
  ) : (
    <U
      onClick={() => {
        push('/account/security/score');
        trackClick(['security_score']);
      }}
    >
      {_t('securityGuard.checkNow')}
    </U>
  );
  return (
    <>
      <ExGuardIcon color={color} className={shouldShake ? 'shake' : ''} />
      <span>{text}</span>
    </>
  );
};

export default function useSecurityGuard() {
  const enable = bootConfig._SITE_CONFIG_.functions.security_guard;
  const [loaded, setLoaded] = useState(false);
  const theme = useTheme();
  const dispatch = useDispatch();
  const level = useSelector((state) => state.securityGuard?.cacheResult?.level);

  const color =
    level === LEVEL_ENUMS.HIGH
      ? theme.colors.primary
      : level === LEVEL_ENUMS.MEDIUM
        ? theme.colors.complementary
        : theme.colors.icon;

  const textNode = <TextNode loaded={loaded} level={level} color={color} />;

  useEffect(() => {
    (async () => {
      if (enable) {
        try {
          await dispatch({ type: 'securityGuard/pullCacheResult' });
        } catch (error) {
          console.log(error);
        } finally {
          setLoaded(true);
        }
      }
    })();
  }, []);

  return { enable, level, themeColor: color, loaded, textNode };
}
