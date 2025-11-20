/**
 * Owner: john.zhang@kupotech.com
 */

import { Spin } from '@kux/mui';
import { useEffect, useState } from 'react';
import { checkIsNeedToGuide, getUserGuidanceAsset } from 'src/services/guidance_zbx';
import { Container } from './components/LayoutComponent';
import MainContent from './components/MainContent';
import RegionRestriction from './components/Restriction';
import { reportZbxErrorToSentry } from './utils';
import ErrorBoundary, { SCENE_MAP } from '@/components/common/ErrorBoundary';
import AccountPage from '@/components/AccountLayout';

const GuidanceZBX = () => {
  const [assetsList, setAssetsList] = useState<any>(null);
  const [isNeedGuidance, setIsNeedGuidance] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGetAssetInfo = async () => {
    try {
      const { data } = await getUserGuidanceAsset();
      setAssetsList(data);
    } catch (error: any) {
      reportZbxErrorToSentry(
        `zbx error | getUserGuidanceAsset | ${error?.response?.status} | ${
          error.message || error.msg
        }`,
      );
      console.error('show handleGetAssetInfo error:', error);
    }
  };

  const handleCheckIsNeedGuidance = async () => {
    try {
      const { data } = await checkIsNeedToGuide();
      setIsNeedGuidance(data);
    } catch (error: any) {
      console.error('show handleGetAssetInfo error:', error);
      reportZbxErrorToSentry(
        `zbx error | checkIsNeedToGuide | ${error?.response?.status} | ${
          error.message || error.msg
        }`,
      );
    }
  };

  const handleInit = async () => {
    try {
      setLoading(true);
      await Promise.all([handleGetAssetInfo(), handleCheckIsNeedGuidance()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleInit();
    // dispatch({ type: `${namespace}/pullUserGuidanceAsset` });
    // dispatch({ type: `${namespace}/pullUserIsNeedToGuide` });
  }, []);

  const pageContent = !isNeedGuidance ? (
    <RegionRestriction />
  ) : (
    <MainContent assetsList={assetsList} />
  );

  return (
    <ErrorBoundary scene={SCENE_MAP.guidanceZBX.index}>
      <AccountPage>
        <Container data-inspector="zbx_container">
          <Spin type="brand" size="basic" spinning={loading}>
            {pageContent}
          </Spin>
        </Container>
      </AccountPage>
    </ErrorBoundary>
  );
};

export default GuidanceZBX;
