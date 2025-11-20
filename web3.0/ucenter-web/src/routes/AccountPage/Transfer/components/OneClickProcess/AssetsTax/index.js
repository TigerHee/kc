/**
 * Owner: john.zhang@kupotech.com
 */

import JsBridge from '@knb/native-bridge';
import { styled, useResponsive } from '@kux/mui';
import { useEffect, useState } from 'react';
import AssetsCostReport from 'src/components/AssetsCostReport';
import { divide } from 'src/helper';
import { useSelector } from 'src/hooks/useSelector';
import { addUserAssetCost } from 'src/services/user_transfer';
import { addLangToPath, _t } from 'src/tools/i18n';
import { resetAppHeader } from '../../../utils/app';
import { useMessageErr } from '../../../utils/message';
import { DotList, DotListItem, Link } from '../components/Common';
import AssetsFillOutFooter from '../layout/AssetsFillOutFooter';
import PageHeader from '../layout/PageHeader';
import { Content, PageWrapper } from '../layout/StyledComponents';
import { getCoinCurrency } from './utils';

// "如何申报成本" 链接
const HOW_TO_DO_LINK = '/support/47497300094087';

const SubTitle = styled.span`
  a {
    margin-left: 4px;
  }
`;

const StyledDotListItem = styled(DotListItem)`
  line-height: 160%;
`;

export default function AssetsTax({ onBack, handleRetry, isLoading }) {
  const userTransferInfo = useSelector((state) => state.userTransfer?.userTransferInfo);
  const categories = useSelector((state) => state.categories);
  const assetsCostInfo = useSelector((state) => state.userTransfer?.assetsCostInfo);
  const assetCostItemList = assetsCostInfo?.assetCostItemList;
  const [assetTable, setAssetTable] = useState(assetCostItemList || []);

  const needToClearData = assetsCostInfo?.needToClearData;
  const [checked, setChecked] = useState(false);

  const errorMessage = useMessageErr();

  const rv = useResponsive();
  const isH5 = !rv?.sm;
  // const [assetsForm] = useForm();
  // const { formCheck, updateFormData, formData } = useAssetsTaxForm(assetsForm);

  // console.log('show assetsForm12:', assetCostItemList, assetTable);

  const isApp = JsBridge.isApp();

  const handleEnter = (e) => {
    e?.preventDefault();
    const link = addLangToPath(HOW_TO_DO_LINK);
    if (isApp) {
      resetAppHeader();
      window.location.href = link;
    } else {
      window.open(link);
    }
  };

  const subTitle = (
    <SubTitle>
      {_t('acbe20f267af4800a636')}
      <Link href={addLangToPath(HOW_TO_DO_LINK)} onClick={handleEnter}>
        {_t('983e3517b6414800acf7')}
      </Link>
    </SubTitle>
  );

  const formatFetchParams = () => {
    const { originalSiteType, targetSiteType, targetRegion } = userTransferInfo || {};
    const list = assetTable.map((item) => {
      const totalCost = item.totalCost;
      const unitCost = divide(totalCost, item.totalAmount, precision || 8);
      const precision = getCoinCurrency(item, categories);
      const needTax = item.needTax;
      const newItem = {
        ...item,
        needTax,
        // 免税情况下, 传null
        totalCost: needTax ? totalCost : null,
        unitCost: needTax ? unitCost : null,
      };
      delete newItem.startDate;
      delete newItem.endDate;
      return newItem;
    });
    const params = {
      originalSiteType,
      targetSiteType,
      targetRegion,
      itemList: list,
      needToClearData,
      bizType: 'SITE_TRANSFER',
    };

    return params;
  };

  const checkTable = () => {
    return assetTable?.every((record) => typeof record.needTax === 'boolean');
  };

  const onContinue = async () => {
    try {
      // await formCheck();
      const flag = checkTable();
      if (!flag) {
        console.error('record should not empty!');
        errorMessage(_t('ef0b3850a1534800af2a'));
        return;
      }
      const params = formatFetchParams();
      const result = await addUserAssetCost(params);
      if (result?.data === 1) {
        return true;
      }

      // 资产变动异常
      if (result?.data === 2) {
        // 提交由于网络异常后将更新一次资产数据
        onRetry();
        errorMessage(_t('a3f07038c9a24000a87e'));
        return false;
      }
      // 3: 后端核对异常
      // 4: 后端服务提报不成功
      errorMessage(_t('ef0b3850a1534800af2a'));
      return false;
    } catch (error) {
      // 表单本地检查异常
      if (error.errorFields?.length > 0) {
        const tips = error.errorFields[0]?.errors?.[0];
        tips && errorMessage(tips);
        return false;
      }
      console.error('show addUserAssetCost error:', error);
      errorMessage(_t('ef0b3850a1534800af2a'));
      // 提交由于网络异常后将更新一次资产数据
      onRetry();
      return false;
    }
  };

  const onRetry = () => {
    try {
      return handleRetry(userTransferInfo);
    } catch (error) {
      console.error('show onRetry error:', error);
    }
  };

  // const tableContent = isH5 ? (
  //   <H5AssetsCardList list={assetCostItemList} assetsForm={assetsForm} handleRetry={onRetry} />
  // ) : (
  //   <AssetsTable list={assetCostItemList} assetsForm={assetsForm} handleRetry={onRetry} />
  // );

  useEffect(() => {
    // 资产查询，告知是否填报=true, 需要弹窗提示: "您此前填写的成本信息已失效，可能因资产变动被清空，请重新核对并填写"
    if (assetCostItemList?.length > 0) {
      // 如果数据中是已填报过的数据，需要弹toast提示
      const hasFillData = assetCostItemList.some((item) => typeof item.needTax === 'boolean');

      if (assetsCostInfo?.needToClearData) {
        errorMessage(_t('a3f07038c9a24000a87e'));
      } else if (hasFillData) {
        errorMessage(_t('131b25069fb74000a10e'));
      }
    }

    if (assetCostItemList?.length === 0) {
      onContinue();
    }
  }, [assetsCostInfo?.needToClearData]);

  useEffect(() => {
    if (!assetTable?.length) {
      setAssetTable(assetCostItemList);
    }
  }, [assetCostItemList]);

  return (
    <PageWrapper>
      <PageHeader
        pageTitle={_t('8c96e030be9b4000abf3')}
        pageSubTitle={subTitle}
        onBack={onBack}
        isShowAlert={false}
        style={{ paddingBottom: 0, paddingTop: 15 }}
        alertTips={
          <DotList>
            <StyledDotListItem>{_t('f348ded1e94f4800a070')}</StyledDotListItem>
            <StyledDotListItem>{_t('5d2f0e8c25894800aa15')}</StyledDotListItem>
          </DotList>
        }
      />
      <Content>
        <AssetsCostReport
          dataSource={assetTable}
          onRetry={handleRetry}
          isLoading={isLoading}
          // needShowAgree={checked}
          onAssetChange={(data) => {
            if (!data) {
              return;
            }
            const { startDate, endDate, cost, assetType } = data;
            const { target } = data?.data || {};
            console.log('show target:', data, target, cost);
            const targetIndex = assetTable?.findIndex((item) => item.currency === target.currency);
            const needTax = assetType === 'NEW';
            if (targetIndex > -1) {
              const targetValue = assetTable[targetIndex];
              const newTable = [...assetTable];
              newTable[targetIndex] = {
                ...targetValue,
                assetAcquireStartTime: startDate,
                assetAcquireEndTime: endDate,
                totalCost: cost,
                needTax,
              };

              setAssetTable(newTable);
              setChecked(true);
            }
          }}
        />
      </Content>
      {(assetCostItemList?.length > 0 || assetsCostInfo?.needToClearData) && (
        <AssetsFillOutFooter
          checked={checked}
          onCheckedChange={(val) => setChecked(val)}
          onBack={onBack}
          onContinue={onContinue}
        />
      )}
    </PageWrapper>
  );
}
