import React, { useMemo, useCallback } from 'react';
import { useResponsive } from '@kux/mui';
import { isEmpty, take, trim } from 'lodash';
import { kcsensorsManualTrack } from '@utils/sensors';
import { useSelector } from 'react-redux';
import { changLangToPath } from '../../common/tools';
import { useLang } from '../../hookTool';
import FooterLinks from '../FooterLinks';
import { namespace } from '../../model';

export default function CmsLinks(props) {
  const { currentLang } = props;
  const rv = useResponsive();
  const { turnoverRank } = useSelector((state) => state[namespace]); // 成交额榜
  const { t } = useLang();

  const kcDynamicData = useMemo(
    () => (!isEmpty(turnoverRank?.items) ? take(turnoverRank?.items, 10) : []),
    [turnoverRank],
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
        const coin = kcDynamicData[i];
        const coinPath = trim(coin?.fullName || coin?.name)
          .toLowerCase()
          .replace(/\s/g, '-'); // 因为path不能显示空格，所以替换空格为-, 全采用小写;
        const newUrl = `/how-to-buy/${coinPath}`;
        const newHref = changLangToPath(currentLang, newUrl);
        const in18Text = t('56c885kctfxDcKff9N66kG', { name: coin?.fullName || coin?.name });
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
        if (targetClassName.includes('after')) {
          e.target.className = e.target.className.replace('after', '');
        } else {
          e.target.className = `${e.target.className} after`;
        }
        const parent = e.target.parentNode;
        parent.childNodes.forEach((node, idx) => {
          if (node.nodeType === 1 && idx !== 0) {
            const { display } = node.style;
            node.style.display = display === 'none' || display === '' ? 'block' : 'none';
          }
        });
      }
    },
    [rv],
  );

  return (
    <div onClick={handleTitleClick}>
      <FooterLinks renderDynamicData={renderDynamicData} currentLang={currentLang} />
    </div>
  );
}
