/**
 * Owner: jessie@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { NumberFormat } from '@kux/mui';
import { isNil } from 'lodash';
import { memo, useMemo } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import hotSvg from 'static/votehub/hot.svg';
import { _t } from 'tools/i18n';
import { ContentWrapper, DialogWrapper, TitleInfo, TitleWrapper } from './styledComponents';

const ProjectDetailModal = () => {
  const detailModal = useSelector((state) => state.votehub.detailModal);
  const detailInfo = useSelector((state) => state.votehub.detailInfo, shallowEqual);

  const dispatch = useDispatch();
  const { currentLang } = useLocale();

  const handleClose = () => {
    dispatch({
      type: 'votehub/update',
      payload: {
        detailModal: false,
        detailInfo: {},
      },
    });
  };

  const Title = useMemo(() => {
    return (
      <TitleWrapper>
        <img src={detailInfo?.logoUrl} alt="logo" />
        <TitleInfo>
          <div className="nameWrapper">
            <span className="name">{detailInfo?.currency}</span>
            <span className="subName">{detailInfo?.project}</span>
          </div>
          {!isNil(detailInfo?.voteNumber) ? (
            <div className="hotWrapper">
              <img src={hotSvg} alt="hot" />
              <span className="num">
                {detailInfo?.voteNumber ? (
                  <NumberFormat lang={currentLang}>{detailInfo?.voteNumber}</NumberFormat>
                ) : (
                  '0'
                )}
              </span>
            </div>
          ) : null}
        </TitleInfo>
      </TitleWrapper>
    );
  }, [detailInfo, currentLang]);

  return (
    <DialogWrapper
      title={Title}
      open={detailModal}
      onClose={handleClose}
      onCancel={handleClose}
      footer={null}
      size="large"
    >
      <ContentWrapper>
        <div className="projectInfo">
          <h2>{_t('nRuJEbBHQZdu5ritbxSwih')}</h2>
          <p>{detailInfo?.description}</p>
        </div>
        <div className="chainInfo">
          <span className="name">{detailInfo?.chainType}</span>
          <span>{detailInfo?.contractAddress}</span>
        </div>
      </ContentWrapper>
    </DialogWrapper>
  );
};

export default memo(ProjectDetailModal);
