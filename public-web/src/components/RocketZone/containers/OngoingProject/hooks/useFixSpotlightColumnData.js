/**
 * Owner: terry@kupotech.com
 */
import { useEffect, useState } from 'react';
import { BASE_CURRENCY } from 'src/config/base';
import { pullPage, getSpotlightInfo, getActivitySubcribeCount } from 'src/services/spotlight8';
/**
 * 获取url中的id，只处理sp8
 * 例如从url：https://nginx-web-02.sit.kucoin.net/zh-hant/spotlight_r8/907 拿到907
 * @param {*} url 
 * @returns 
 */
const getSp8Id = (jumpUrl) => {
  try {
    const pathName = new URL(jumpUrl).pathname;
    if (!pathName || !pathName.includes('spotlight_r8')) return;
    return pathName.split('/').pop();
  } catch (e) {
    console.error(e);
  }
}
/**
 * 临时修复spotlight中（仅spotlightR8），没有价格、额度、参与人数
 * 后续后端接口修复后，该hook需要进行下线处理
 */
export function useFixSpotlightColumnData(typeName, url) {
  const [fixData, setFixData] = useState({});
  useEffect(() => {
    // 只处理spotlight
    if (typeName !== 'gemPad') return;
    if (!url) return;
    const id = getSp8Id(url);
    if (!id) return;
    const init = async () => {
      try {
        // 根据id，请求cms/activity接口拿sp活动id
        const { data: { code }} = await pullPage({ id })
        const activityCode = code[0]
        if (!activityCode) return;
        // 请求spotlight8/campaignInfo、spotlight8/summary 获取对应详情数据
        const [{ data: projectData }, { data: summaryData}] = await Promise.all([
          getSpotlightInfo(activityCode),
          getActivitySubcribeCount(activityCode)
        ])
        const { token, tokenPrice, totalSaleQuantity } = projectData;
        const { totalSubscribers} = summaryData;
        const detailData = {
          price: tokenPrice,
          quoteCurrency: BASE_CURRENCY,
          campaignAmount: totalSaleQuantity,
          activityRegistrationCount: totalSubscribers,
          token,
        }
        setFixData(detailData);
      } catch (e) {
        console.error(e)
      }
    };
    init();
  }, [typeName, url]);

  return fixData;
}