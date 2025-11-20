/**
 * Owner: iron@kupotech.com
 */
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useResponsive, useTheme } from '@kux/mui';
import { namespace } from '../model';
import MarketsAmount from '../components/MarketsAmount';
import ServerTime from '../components/ServerTime';
import FooterLogo from '../components/Logo';
import CmsLinks from '../components/CmsLinks';
import { tenantConfig } from '../tenantConfig';
import { useStyles } from './styles';
import { useLang } from '../hookTool';

export default function Footer(props) {
  const {
    styleConfig = {},
    currentLang,
    KUCOIN_HOST, // kucoin主站地址
  } = props;
  const dispatch = useDispatch();
  const theme = useTheme();
  const styles = useStyles({ theme });

  const rv = useResponsive();
  const { t } = useLang();
  const disclaimerDesc = tenantConfig.disclaimerDesc(t, currentLang);
  const highRiskDesc = tenantConfig.highRiskDesc(t);

  // 获取成交额榜
  useEffect(() => {
    dispatch({ type: `${namespace}/getTurnoverRank` });
  }, [dispatch]);
  // 动态加入 how-to-buy 币种数据 - 成交额榜前十

  useEffect(() => {
    const nodes = document.querySelectorAll('.newFooterLinkGroupTitle');
    nodes.forEach((node, idx) => {
      if (idx !== nodes.length - 1) {
        if (node.className.includes('after')) {
          node.className = node.className.replace('after', '');
        }
        const sibs = node.parentNode.childNodes;
        sibs.forEach((sib, index) => {
          if (sib.nodeType === 1 && index !== 0) {
            if (rv.sm) {
              sib.style.display = 'block';
            } else {
              sib.style.display = 'none';
            }
          }
        });
      }
    });
  }, [rv]);

  return (
    <div css={styles.cFooter} style={{ ...styleConfig }}>
      <footer css={styles.footerMain} className="footerMain">
        <FooterLogo currentLang={currentLang} KUCOIN_HOST={KUCOIN_HOST} />
        <CmsLinks {...props} />
        {/* 泰国站风险声明 */}
        {highRiskDesc ? <div css={styles.highRiskDesc}>{highRiskDesc}</div> : null}
        <div css={styles.divider} className="divider" />
        {disclaimerDesc ? <div css={styles.disclaimerDesc}>{disclaimerDesc}</div> : null}
        <div
          css={
            tenantConfig.showServeTime
              ? [styles.copyright, styles.smCopyRight]
              : [styles.copyrightOneCol]
          }
          className="copyright"
        >
          <small
            css={styles.newCopyright}
            className="new-copyright"
            data-inspector="inspector_footer_copyright"
          >
            {tenantConfig.copyrightText}
          </small>
          {tenantConfig.showServeTime ? (
            <div css={[styles.servertime, styles.smCopyRight]} className="servertime">
              <ServerTime {...props} />
              {tenantConfig.showMarketsAmount ? <MarketsAmount {...props} /> : null}
            </div>
          ) : null}
        </div>
      </footer>
    </div>
  );
}
