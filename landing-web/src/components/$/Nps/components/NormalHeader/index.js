/**
 * Owner: jesse.shao@kupotech.com
 */
import React, { memo } from 'react';
import { useHistory, useSelector } from 'dva';
import { styled, Global, css } from '@kufox/mui/emotion';
import { addLangToPath } from 'utils/lang';
import JsBridge from 'utils/jsBridge';
import useTheme from '@kufox/mui/hooks/useTheme';
import { ReactComponent as Back } from 'src/components/$/Nps/components/assets/arrow-left.svg';
import LangSelector from 'components/Header/LangSelector';
import LANG_CHECKED from 'src/assets/NFTQuiz/lang_icon.svg';
import langCheckedSvg from 'assets/prediction/lang-checked.svg';
import classnames from 'classnames';
import useQuestion from '../../hooks/useQuestion';

import style from './style.less';

const BackWrap = styled.div`
  height: 24px;
  width: 24px;
  position: absolute;
  top: 50%;
  left: 16px;
  border: none;
  outline: none;
  transform: translate(0, -50%);
  cursor: pointer;
  padding: 4px 0 0 4px;
`;

const NormalHeader = memo((props) => {
  const theme = useTheme();
  const { surveyinfo } = useQuestion();
  console.log('theme', theme);
  const darkLang = theme.currentTheme === 'dark';
  const { title = 'title' } = props;
  const isInApp = useSelector((state) => state.app.isInApp);
  const currentLang = useSelector((state) => state.app.currentLang);
  const { goBack } = useHistory();

  const handleBack = () => {
    if (isInApp) {
      JsBridge.open({
        type: 'func',
        params: {
          name: 'exit',
        },
      });
    } else {
      goBack();
    }
  };

  const Title = <div className={style.title}>{title}</div>;

  if (isInApp) {
    return (
      <div
        className={classnames(style.barWrap, {
          [style.isInApp]: isInApp,
        })}
      >
        <div
          className={classnames(style.bar, {
            [style.isInApp]: isInApp,
          })}
        >
          <BackWrap onClick={handleBack} aria-label="back">
            <Back style={{ color: 'rgba(115, 126, 141, 1)' }} />
          </BackWrap>
          {Title}
        </div>
      </div>
    );
  }

  return (
    <div
      className={classnames(style.wrap, style.barWrap, {
        [style.isInApp]: isInApp,
      })}
    >
      <div
        className={classnames(style.bar, {
          [style.isInApp]: isInApp,
        })}
      >
        {Title}
        <LangSelector
          filterLangsFn={(l) => {
            return l.filter((e) => {
              return e.key === currentLang || (surveyinfo?.languages || []).includes(e.key);
            });
          }}
          showCheckedImg
          checkedImgUrl={langCheckedSvg}
          className={!darkLang ? 'land-lang-selector' : 'land-lang-selector-dark'}
        />
      </div>
    </div>
  );
});

export default NormalHeader;
