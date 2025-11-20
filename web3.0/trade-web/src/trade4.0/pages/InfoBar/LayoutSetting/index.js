/*
 * owner: Borden@kupotech.com
 */
import React, { Suspense, Fragment } from 'react';
import { map, isUndefined } from 'lodash';
import { ICRefreshOutlined } from '@kux/icons';
import Divider from '@mui/Divider';
import Switch from '@mui/Switch';
import Button from '@mui/Button';
import Drawer from '@mui/Drawer';
import Tooltip from '@mui/Tooltip';
import { _t } from 'src/utils/lang';
import withAuth from '@/hocs/withAuth';
import SvgComponent from '@/components/SvgComponent';
import { MODULES } from '@/layouts/moduleConfig';
import { DEFAULT_LAYOUTS, DEFAULT_LAYOUTS_MAP } from '@/layouts/XlLayout/layout';
import useStateAndLogic from './useStateAndLogic';
import {
  GroupHeader,
  GroupBody,
  GroupItem,
  ItemPicture,
  ItemTitle,
  ModuleList,
  Module,
  ModuleName,
  Actions,
  ActionBox,
} from './style';
import Recommended from './Recommended';

const Picture = (props) => (
  <SvgComponent
    keepOrigin
    width="100%"
    height="100%"
    fileName="layoutSetting"
    {...props}
  />
);

const AddModal = React.lazy(() => {
  return import(/* webpackChunkName: 'tradev4-layoutAddModal' */'./AddModal');
});

const EditModal = React.lazy(() => {
  return import(/* webpackChunkName: 'tradev4-layoutEditModal' */'./EditModal');
});

const ConfirmModal = React.lazy(() => {
  return import(/* webpackChunkName: 'tradev4-layoutDeleteConfirm' */'./ConfirmModal');
});

const AddLayoutArea = withAuth(props => (
  <GroupItem key="add_customized_layout" {...props}>
    <ItemPicture>
      <SvgComponent
        size={22}
        type="layout-add"
        fileName="layoutSetting"
      />
    </ItemPicture>
    <ItemTitle>{_t('dfDwCKHqVQciWBdsF4gJ8J')}</ItemTitle>
  </GroupItem>
));

// 用户最大自定义布局数
const MAX_CUSTOMIZED_LAYOUTS_COUNT = 6;

const LayoutSetting = React.memo(() => {
  const {
    onClose,
    isLogin,
    updateLayout,
    createLayout,
    resetLayout,
    openAddModal,
    updateModule,
    switchLayout,
    currentTheme,
    closeAddModal,
    currentLayout,
    inLayoutIdMap,
    addModalVisible,
    isDefaultLayout,
    openLayoutSetting,
    customizedLayouts,
    editModalProps,
    openEditModal,
    closeEditModal,
    confirmModalProps,
    openConfirmModal,
    closeConfirmModal,
    deleteLayout,
  } = useStateAndLogic();

  return (
    <Drawer
      back={false}
      anchor="right"
      onClose={onClose}
      show={openLayoutSetting}
      contentPadding="8px 32px"
      title={_t('uQQmY7meydqpU2HpiywCVV')}
    >
      <GroupHeader>
        {_t('nVrQYX5tpFE37PiXjpTY1F')}
      </GroupHeader>
      <GroupBody>
        {
          map(DEFAULT_LAYOUTS, (item) => {
            const { code, name } = item;
            const isActive = code === currentLayout;
            return (
              <GroupItem
                key={code}
                active={isActive}
                onClick={() => switchLayout({ currentLayout: code })}
              >
                {isActive && (
                  <Actions className="layoutSetting_actions">
                    <Tooltip title={_t('8ayXwBSfWhPgHGfkgtkXNu')} placement="top">
                      <ActionBox onClick={resetLayout}>
                        <ICRefreshOutlined size={12} />
                      </ActionBox>
                    </Tooltip>
                  </Actions>
                )}
                <ItemPicture className="layoutSetting_itemPicture">
                  <Picture type={`${code}-${currentTheme}`} />
                </ItemPicture>
                <ItemTitle>{name()}</ItemTitle>
              </GroupItem>
            );
          })
        }
      </GroupBody>
      <GroupHeader>
        {_t('nrCNZTnkHeSgGC8PzACSnW')}
      </GroupHeader>
      <GroupBody style={{ paddingBottom: 8 }}>
        {
          Boolean(customizedLayouts.length) && (
            <Fragment>
              <Suspense fallback={<div />}>
                <EditModal
                  onOk={updateLayout}
                  onCancel={closeEditModal}
                  open={!!editModalProps?.open}
                />
              </Suspense>
              <Suspense fallback={<div />}>
                <ConfirmModal
                  onOk={deleteLayout}
                  onCancel={closeConfirmModal}
                  open={!!confirmModalProps?.open}
                />
              </Suspense>
            </Fragment>
          )
        }
        {
          map(customizedLayouts, (item) => {
            const { code, name } = item;
            return (
              <GroupItem
                key={code}
                active={code === currentLayout}
                onClick={() => switchLayout({ currentLayout: code })}
              >
                <Actions className="layoutSetting_actions">
                  <Tooltip title={_t('t8XRRSLALCR3S6anKK4cnr')} placement="top">
                    <ActionBox onClick={(e) => openConfirmModal(e, { code })}>
                      <SvgComponent
                        size={12}
                        type="layout-delete"
                        fileName="layoutSetting"
                      />
                    </ActionBox>
                  </Tooltip>
                  <Tooltip title={_t('1uHn7w8KEitV2FTEU8rDwj')} placement="top">
                    <ActionBox onClick={(e) => openEditModal(e, { code })}>
                      <SvgComponent
                        size={12}
                        type="layout-edit"
                        fileName="layoutSetting"
                      />
                    </ActionBox>
                  </Tooltip>
                </Actions>
                <ItemPicture className="layoutSetting_itemPicture">
                  <Picture type={`customized-${currentTheme}`} />
                </ItemPicture>
                <ItemTitle>{name}</ItemTitle>
              </GroupItem>
            );
          })
        }
        {
          customizedLayouts.length < MAX_CUSTOMIZED_LAYOUTS_COUNT && (
            <Fragment>
              {
                Boolean(isLogin) && (
                  <Suspense fallback={<div />}>
                    <AddModal
                      onOk={createLayout}
                      open={addModalVisible}
                      onCancel={closeAddModal}
                    />
                  </Suspense>
                )
              }
              <AddLayoutArea onClick={openAddModal} />
            </Fragment>
          )
        }
      </GroupBody>
      <Divider />
      <GroupHeader>
        {!isDefaultLayout ? (
          _t('88An4ndEJUxg69ehwosQdC')
        ) : (
          <Fragment>
            {DEFAULT_LAYOUTS_MAP[currentLayout].name()}
            <Button variant="text" type="brandGreen" onClick={resetLayout}>
              {_t('8ayXwBSfWhPgHGfkgtkXNu')}
            </Button>
          </Fragment>
        )}
      </GroupHeader>
      <ModuleList>
        {
          map(MODULES, (item) => {
            return (
              <Module key={item.id}>
                <ModuleName>{item.renderName({ justShowTitle: true })}</ModuleName>
                <Switch
                  onChange={v => updateModule(v, item.id)}
                  checked={!isUndefined(inLayoutIdMap?.[item.id])}
                />
              </Module>
            );
          })
        }
      </ModuleList>
      <Divider />
      <Recommended />
    </Drawer>
  );
});

export default LayoutSetting;
