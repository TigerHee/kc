/**
 * Owner: odan.ou@kupotech.com
 */

// 资产证明FAQ
import React from 'react';
import { withRouter } from 'components/Router';
import BreadCrumbs from 'components/KcBreadCrumbs';
import { _t, _tHTML } from 'src/tools/i18n';
import copyDataImg from 'static/por/copy-data.svg';
import faildImg from 'static/por/faild.svg';
import passedImg from 'static/por/passed.svg';
import pathDataImg from 'static/por/path-data.svg';
import runCodeImg from 'static/por/run-code.svg';
import treeImg from 'static/por/tree.svg';
import verifyDataImg from 'static/por/verify-data.svg';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useSnackbar } from '@kufox/mui';
import { Button } from '@kufox/mui';
import CodeShow from './CodeShow';
import { verifyCode } from './config';

import s from './style.less';

const FAQ = (props) => {
  const { query } = props;
  const id = query?.id;
  const { message } = useSnackbar();
  const breadCrumbs = [
    {
      label: _t('back'),
      url: id ? `/proof-of-reserves/detail/${id}` : '/proof-of-reserves',
    },
    {
      label: _t('assets.por.faq.title'),
    },
  ];

  return (
    <div data-inspector="proof_of_reserves_faq_page" className={s.faq}>
      <div className="faq_wrap">
        <div className="bread_crumbs">
          <BreadCrumbs breadCrumbs={breadCrumbs} />
        </div>
        <div>
          <div>
            <div className="title_h1">{_t('assets.por.faq.title')}</div>
          </div>
          <div>
            <div>
              <div className="title_h3 title_h3_f">{_t('assets.por.faq.merkle.title')}</div>
              <img alt="" src={treeImg} />
              <div>
                <div className="title_h5">{_t('assets.por.faq.merle.node.info')}</div>
                <div className="line150">
                  <div>{_tHTML('assets.por.faq.merle.node.desc')}</div>
                  <div className="demo_box">{_t('assets.por.faq.merle.node.format')}</div>
                  <div className="demo_box">
                    {_t('assets.por.faq.merle.node.codedemo', {
                      code: `66770c5ed0186d5bdfb8d4f930d42247c593f8b60235c1f4d8f95b907d0c39dc,{"BTC":"2.096","ETH":"0","USDT":"6.32232082","USDC":"5.46397825"}`,
                    })}
                  </div>
                </div>
                <div>
                  <div className="title_h5">{_t('assets.por.faq.merle.rule.title')}</div>
                  <div>{_tHTML('assets.por.faq.merle.rule.desc')}</div>
                  <div className="demo_box">
                    {_t('assets.por.faq.merle.rule.code', {
                      code: `{"BTC":"2.096","ETH":"0","USDT":"6.32232082","USDC":"5.46397825"}`,
                    })}
                  </div>
                  <div className="text_line br_line">
                    {_tHTML('assets.por.faq.merle.rule.fill')}
                  </div>
                  <div className="text_line">{_tHTML('assets.por.faq.merle.rule.parent')}</div>
                </div>
              </div>
            </div>
            <div>
              <div className="title_h3">{_t('assets.por.faq.merle.theory.title')}</div>
              <div>{_tHTML('assets.por.faq.merle.theory.desc')}</div>
              <div className="text_line demo_text_des">
                {_t('assets.por.faq.merle.theory.demo')}
              </div>
              <img alt="" src={pathDataImg} />
            </div>
            <div>
              <div className="title_h3">{_t('assets.por.faq.merle.verify.title')}</div>
              <div className="title_h5">{_t('assets.por.faq.merle.verify.step1')}</div>
              <div>{_tHTML('assets.por.faq.merle.verify.step1.desc')}</div>
              <div>{_t('assets.por.faq.merle.verify.step1.run')}</div>
              <img alt="" src={runCodeImg} />
              <div className="code_show">
                <CodeShow lang="python" code={verifyCode} />
              </div>
              <div>
                <CopyToClipboard
                  text={verifyCode}
                  onCopy={() => {
                    message.success(_t('copy.succeed'));
                  }}
                >
                  <Button size="small">{_t('assets.por.step.copy')}</Button>
                </CopyToClipboard>
              </div>
              <div className="title_h5">{_t('assets.por.faq.merle.verify.step2')}</div>
              <img alt="" src={copyDataImg} />
              <div className="title_h5">{_t('assets.por.faq.merle.verify.step3')}</div>
              <img alt="" src={verifyDataImg} />
              <div className="title_h5">{_t('assets.por.faq.merle.verify.step4')}</div>
              <div className="text_line">{_t('assets.por.faq.merle.verify.ok')}</div>
              <img alt="" src={passedImg} />
              <div className="text_line">{_t('assets.por.faq.merle.verify.error')}</div>
              <img alt="" src={faildImg} />
              <div className="text_line">{_t('assets.por.faq.merle.verify.self')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter()(FAQ);
