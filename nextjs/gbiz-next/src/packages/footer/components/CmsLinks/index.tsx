import React, { useMemo, useCallback, useEffect } from 'react';
import { useResponsive } from '@kux/mui-next';
import { kcsensorsManualTrack } from 'tools/sensors';
import { changLangToPath } from 'packages/footer/common/tools';
import { useTranslation } from 'tools/i18n';
import { useFooterStore } from 'packages/footer/model';
import FooterLinks from '../FooterLinks';
import { getCurrentLang } from 'kc-next/i18n';
import commonStyle from '../styles.module.scss';

export default function CmsLinks() {
  const rv = useResponsive();
  const turnoverRank = useFooterStore((store) => store.turnoverRank);
  const getTurnoverRank = useFooterStore((store) => store.getTurnoverRank);
  const { t } = useTranslation('footer');
  const currentLang = getCurrentLang();

  useEffect(() => {
    getTurnoverRank?.();
  }, [getTurnoverRank]);

  const kcDynamicData = useMemo(
    () => {
      if (turnoverRank && turnoverRank.items) {
        return turnoverRank.items.slice(0, 10);
      }
      return [];
    },
    [turnoverRank]
  );

  const renderDynamicData = useCallback(() => {
    const KC_LEARN = document.getElementById('kc_howTobuy');
    if (kcDynamicData?.length && KC_LEARN) {
      // 清空原有的a链接
      // KC_LEARN.innerHTML = '';
      const ddElements = KC_LEARN.querySelectorAll('dd');
      if (ddElements) {
        ddElements.forEach((p) => {
          KC_LEARN.removeChild(p);
        });
      }
      let newHtml;
      const newFragment = document.createDocumentFragment();
      for (let i = 0; i < kcDynamicData.length; i++) {
        // eslint-disable-next-line prototype-pollution/no-bracket-notation-property-accessor
        const coin = kcDynamicData[i];
        const coinPath = (coin.fullName || coin.name).trim()
          .toLowerCase()
          .replace(/\s/g, '-'); // 因为path不能显示空格，所以替换空格为-, 全采用小写;
        const newUrl = `/how-to-buy/${coinPath}`;
        const newHref = changLangToPath(newUrl);
        const in18Text = t('56c885kctfxDcKff9N66kG', {
          name: coin?.fullName || coin?.name,
        });
        const newText = document.createTextNode(in18Text);
        newHtml = document.createElement('a');
        newHtml.setAttribute('href', newHref);
        newHtml.setAttribute('target', '_blank');
        newHtml.style.display = 'block';
        newHtml.appendChild(newText);
        // 添加点击埋点
        newHtml.onclick = () => {
          const categoryKey = KC_LEARN.getAttribute('data-category-key');
          kcsensorsManualTrack(
            { spm: ['Footer', categoryKey], data: { url: `/how-to-buy/${coinPath}` } },
            'page_click',
          );
        };
        const dd = document.createElement('dd');
        dd.appendChild(newHtml);
        newFragment.appendChild(dd);
      }
      KC_LEARN.appendChild(newFragment);
    }
  }, [kcDynamicData, currentLang, t]);

  const handleTitleClick = useCallback(
    (e) => {
      if (rv.sm) return;
      const targetClassName = e.target.className;
      if (targetClassName.includes('newFooterLinkGroupTitle')) {
        if (e.target.parentNode.className.includes('association')) {
          return;
        }
        if (targetClassName.includes(commonStyle.after)) {
          e.target.className = e.target.className.replace(commonStyle.after, '');
        } else {
          e.target.className = `${e.target.className} ${commonStyle.after}`;
        }
        const parent = e.target.parentNode;
        parent.childNodes.forEach((node, idx) => {
          if (node.nodeType === 1 && idx !== 0) {
            const { display } = node.style;
            node.style.display =
              display === 'none' || display === '' ? 'block' : 'none';
          }
        });
      }
    },
    [rv]
  );

  return (
    <div onClick={handleTitleClick}>
      <FooterLinks
        renderDynamicData={renderDynamicData}
        currentLang={currentLang}
      />
    </div>
  );
}
