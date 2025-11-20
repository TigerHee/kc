/**
 * Owner: tiger@kupotech.com
 */
import clsx from 'clsx';
import JsBridge from 'tools/jsBridge';
import useCommonData from 'kycCompliance/hooks/useCommonData';
import { htmlToReactParser } from '../style';
import { DescBox, DescItem } from './style';

// const testDesc = `<div class="renderHtmlDesc">
// <div class="subTitleContent">
// 请上传财富证明, 我们会根据财富证明评估提现额度:
// </div>
// <div class="subTitleContentList">
//   <div>1.银行流水（发行3个月内）</div>
//   <div>2.存款证明</div>
//   <div>3.证券账户对账单</div>
//   <div>4.加密货币钱包余额或交易历史</div>
//   <div>5.房产证明</div>
//   <div>6.工资单</div>
//   <div>7.税单税收证明</div>
//   <div>8.其他财富证明文件</div>
// </div>
// <div class="descContent">
//   <div>PDF/PNG/JPG, &lt;50M, max 10 files</div>
//   <div>请确保上传文件为完整页面，包含全名，机构名称或印章。</div>
// </div>
// </div>`;

export default ({ desc, ignoreBoxMb }) => {
  const { isSmStyle } = useCommonData();
  const list = desc?.split('#');
  const isRenderHtmlDesc =
    (desc?.includes('renderHtmlDesc') || (desc?.includes('<') && desc?.includes('</'))) &&
    list?.length === 1;

  return desc ? (
    <DescBox
      className={clsx({
        isSmStyle,
      })}
      ignoreBoxMb={ignoreBoxMb}
    >
      {isRenderHtmlDesc ? (
        htmlToReactParser.parse(desc)
      ) : (
        <>
          {list?.map((item) => (
            <DescItem
              key={item}
              className="descItem"
              onClick={(e) => {
                e.preventDefault();
                if (e?.target?.nodeName?.toLocaleUpperCase() === 'A' && e?.target?.href) {
                  const url = e?.target?.href?.includes('?')
                    ? `${e?.target?.href}&appNeedLang=true`
                    : `${e?.target?.href}?appNeedLang=true`;

                  if (JsBridge.isApp()) {
                    JsBridge.open({
                      type: 'jump',
                      params: {
                        url: `/link?url=${url}`,
                      },
                    });
                  } else {
                    window.open(url, '_blank');
                  }
                }
                return false;
              }}
            >
              {list?.length > 1 && <div className="point" />}

              <div>
                {item?.split('$$').map((itemLine) => (
                  <div key={itemLine}>{htmlToReactParser.parse(itemLine)}</div>
                ))}
              </div>
            </DescItem>
          ))}
        </>
      )}
    </DescBox>
  ) : null;
};
