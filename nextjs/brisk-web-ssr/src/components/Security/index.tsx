import clsx from 'clsx';
import { useResponsive } from '@kux/design';
import useTheme from '@/hooks/useTheme';
import { useRef } from 'react';
import useTranslation from '@/hooks/useTranslation';
import { addLangToPath } from '@/tools/i18n';
import Highlights from './Highlights';
import H5Highlights from './H5Highlights/index';
import bg from '@/static/security/bg.png';
import bgLight from '@/static/security/bg-light.png';
import styles from './styles.module.scss';
import AnimatedContent from '../CommonComponents/Animations/AnimatedContent';
import LazyImg from '@/components/CommonComponents/LazyImg';

export default function Security() {
  const { t, Trans } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const rs = useResponsive();
  const { theme } = useTheme();

  const isLight = theme === 'light';
  const isH5 = rs === 'sm';
  const url = addLangToPath('/security');

  return (
    <section
      ref={sectionRef}
      className={clsx({
        [styles.security]: true,
        [styles.securityLight]: isLight,
      })}
      style={isH5 ? {} : { backgroundImage: `url(${isLight ? bgLight : bg})` }}
    >
      {isH5 && <LazyImg src={isLight ? bgLight : bg} alt="h5bg" className={styles.h5bg} />}
      <AnimatedContent>
        <h2 className={styles.title}>{t('7e72a4acee1a4000a902')}</h2>
        <div className={styles.desc}>
          <Trans
            i18nKey="10fccb9fe4854800a4fc"
            values={{
              url: `'${url}'`,
            }}
            components={{ a: <a />, span: <span /> }}
          />
        </div>
      </AnimatedContent>

      {isH5 ? (
        <H5Highlights />
      ) : (
        <div className={styles.arcContainer}>
          <Highlights />
        </div>
      )}
    </section>
  );
}
