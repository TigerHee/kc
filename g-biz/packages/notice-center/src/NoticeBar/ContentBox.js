/**
 * Owner: willen@kupotech.com
 */
import { ModalFooter, Spin, styled } from '@kux/mui';
import React from 'react';
import InfiniteLoadingList from '../components/Virtualized/InfiniteLoadingList';
import useLang from '../hookTool/useLang';

const Content = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Body = styled.div`
  flex: auto;
  .ReactVirtualized__List {
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 8px 0;
`;

const Footer = styled.div``;

const CusModalFooter = styled(ModalFooter)`
  padding: 20px 32px;
  button:first-of-type {
    margin-right: 24px;
    color: ${(props) => props.theme.colors.text60};
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 20px 16px;
  }
`;

const ContentBox = (props) => {
  const { t: _t } = useLang();
  const {
    hasMore,
    loading,
    dataArr,
    queryMore,
    renderMsgList,
    shouldUpdateMeasurer,
    renderNoRows,
    openConfirm,
    markAllRead,
  } = props;

  console.log('==== trunkLoaded notice content');

  return (
    <Content>
      <Body>
        <InfiniteLoadingList
          hasNextPage={hasMore}
          isNextPageLoading={loading}
          data={dataArr}
          loadNextPage={queryMore}
          renderRow={renderMsgList}
          shouldUpdateMeasurer={shouldUpdateMeasurer}
          loadingPlaceHolder={
            <LoadingWrapper>
              <Spin spinning type="normal" />
            </LoadingWrapper>
          }
          noRowsRender={renderNoRows}
        />
      </Body>
      <Footer>
        <CusModalFooter
          okText={_t('all.read')}
          cancelText={_t('all.clear')}
          onCancel={openConfirm}
          onOk={markAllRead}
          okButtonProps={{ size: 'basic', disabled: !dataArr.length }}
          cancelButtonProps={{ variant: 'text', size: 'basic', disabled: !dataArr.length }}
        />
      </Footer>
    </Content>
  );
};

export default ContentBox;
