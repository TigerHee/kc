import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Popover } from '../popover';
import { Modal } from './index';
import { Button } from '../button';
import { SuccessIcon } from '@kux/iconpack';
import { Text } from '../text';
import { Empty } from '../empty';
import { Stack } from '../stack';
import { Tooltip } from '../tooltip';

const componentMeta = {
  title: 'base/Modal',
  component: Modal,
  parameters: {
    layout: 'padded',
    creevey: {
      delay: 2000,
      browsers: {
        chrome: true,
        otherChrome: {
          browserName: 'chrome',
          viewport: { width: 767, height: 720 },
          limit: 2,
          version: '106',
        },
      },
    },
  },
} satisfies Meta<typeof Modal>;

export default componentMeta;
type Story = StoryObj<typeof componentMeta>;

/** 基础功能展示 */
export const ShowCase: Story = {
  name: 'ShowCase',
  args: {
    size: 'small',
    isOpen: false,
    maskClosable: false,
    mobileTransform: true,
    showCloseX: true,
    title: 'List Dialog Title',
    footerBorder: true,
    cancelText: '取消',
    okText: '确定',
    onClose: fn(),
    onCancel: fn(),
    onOk: fn(),
    children: '占位内容',
  },
  render: function BasicModal(args) {
    const [visible, setVisible] = useState(false);
    const [visible1, setVisible1] = useState(false);
    const [currentProps, setCurrentProps] = useState({});
    const [current1Props, setCurrent1Props] = useState({});
    const [visible2, setVisible2] = useState(false);
    const [current2Props, setCurrent2Props] = useState({});
    const [visible3, setVisible3] = useState(false);
    const [current3Props, setCurrent3Props] = useState({});
    const [visible4, setVisible4] = useState(false);
    const [current4Props, setCurrent4Props] = useState({});
    const [visible5, setVisible5] = useState(false);
    const [current5Props, setCurrent5Props] = useState({});
    const [visible6, setVisible6] = useState(false);

    const openShowcase = (props: any) => {
      setCurrentProps(props);
      setVisible(true);
    };

    const openShowcase1 = (props: any) => {
      setCurrent1Props(props);
      setVisible1(true);
    };
    const openShowcase2 = (props: any) => {
      setCurrent2Props(props);
      setVisible2(true);
    };

    const openShowcase3 = (props: any) => {
      setCurrent3Props(props);
      setVisible3(true);
    };

    const openShowcase4 = (props: any) => {
      setCurrent4Props(props);
      setVisible4(true);
    };

    const openShowcase5 = (props: any) => {
      setCurrent5Props(props);
      setVisible5(true);
    };

    const openShowcase6 = () => {
      setVisible6(true);
    };

    return (
      <div>
        <h1>Web Modal</h1>
        <span> 🛎️ 查看web弹窗时请把storybook调整至中/大屏状态。❗❗❗</span>
        <section>
          <h1>centeredFooterButton: true</h1>
          <Button
            type="primary"
            onClick={() => openShowcase({ size: 'small', footerBorder: false })}
            sync
          >
            small
          </Button>
          <Button type="primary" onClick={() => openShowcase({ size: 'medium' })} sync>
            medium
          </Button>
          <Button type="primary" onClick={() => openShowcase({ size: 'large' })} sync>
            large
          </Button>
        </section>
        <section>
          <h1>centeredFooterButton: false</h1>
          <Button
            type="primary"
            onClick={() =>
              openShowcase({
                centeredFooterButton: false,
                cancelButtonType: 'text',
                footerBorder: false,
              })
            }
            sync
          >
            small
          </Button>
          <Button
            type="primary"
            onClick={() =>
              openShowcase({
                size: 'medium',
                centeredFooterButton: false,
                cancelButtonType: 'text',
              })
            }
            sync
          >
            medium
          </Button>
          <Button
            type="primary"
            onClick={() =>
              openShowcase({ size: 'large', centeredFooterButton: false, cancelButtonType: 'text' })
            }
            sync
          >
            large
          </Button>
        </section>
        <Modal
          {...args}
          {...currentProps}
          isOpen={visible}
          onClose={() => {
            setVisible(false);
          }}
          onCancel={() => {
            setVisible(false);
          }}
          onOk={() => {
            setVisible(false);
          }}
        >
          <Text>
            Nulla suspendisse metus vel in netus. Tortor justo bibendum purus imperdiet imperdiet
            tellus in lacus. Posuere libero quam et aliquam penatibus vitae.
          </Text>
        </Modal>
        <section>
          <h1>info modal</h1>
          <Button
            type="primary"
            onClick={() => openShowcase1({ size: 'small', footerBorder: false })}
          >
            small
          </Button>
          <Button
            type="primary"
            onClick={() => openShowcase1({ size: 'medium', centeredFooterButton: false })}
          >
            medium
          </Button>
          <Button
            type="primary"
            onClick={() => openShowcase1({ size: 'large', centeredFooterButton: false })}
          >
            large
          </Button>
          <Modal
            {...args}
            {...current1Props}
            cancelText=""
            isOpen={visible1}
            onClose={() => {
              setVisible1(false);
            }}
            onCancel={() => {
              setVisible1(false);
            }}
            onOk={() => {
              setVisible1(false);
            }}
          >
            <Stack direction="vertical" spacing="small">
              <Empty name="success" size="small" />
              <Text as="h4">List Dialog Title</Text>
              <Text as="span" style={{ textAlign: 'center' }}>
                Habitant facilisi tincidunt pretium id et pellentesque mauris eget.{' '}
              </Text>
            </Stack>
          </Modal>
        </section>

        <h1>H5 Modal</h1>
        <span> 🛎️ 查看h5弹窗时请把storybook调整至小屏状态。❗❗❗</span>

        <section>
          <h1></h1>
          <Button
            type="primary"
            onClick={() =>
              openShowcase5({
                size: 'small',
                footerBorder: false,
                title: '',
                mobileTransform: false,
              })
            }
          >
            small modal
          </Button>
          <Button
            type="primary"
            onClick={() =>
              openShowcase5({
                size: 'small',
                footerBorder: false,
                title: '',
                mobileTransform: true,
                isTouchEnabled: false,
              })
            }
          >
            small drawer
          </Button>
          <Modal
            {...args}
            {...current5Props}
            cancelText=""
            isOpen={visible5}
            onClose={() => {
              setVisible5(false);
            }}
            onCancel={() => {
              setVisible5(false);
            }}
            onOk={() => {
              setVisible5(false);
            }}
          >
            <Stack direction="vertical" spacing="small">
              <Empty name="success" size="small" />
              <Text as="h4">List Dialog Title</Text>
              <Text as="span" style={{ textAlign: 'center' }}>
                Habitant facilisi tincidunt pretium id et pellentesque mauris eget.{' '}
              </Text>
            </Stack>
          </Modal>
        </section>

        <section>
          <h6>h5有些弹窗使用场景比较特殊，这里单独列举</h6>
          <Button type="primary" onClick={openShowcase2}>
            activity
          </Button>
          <Modal
            {...args}
            {...current2Props}
            header={
              <img
                src="https://assets.staticimg.com/g-biz/externals/2022-06-01/026e5a2a76e951d8.png"
                alt="404"
                style={{
                  background: 'rgba(29, 29, 29, 0.04)',
                  height: '200px',
                  marginBottom: '24px',
                }}
              />
            }
            cancelButtonType="text"
            footerDirection="vertical"
            footerBorder={false}
            isOpen={visible2}
            onClose={() => {
              setVisible2(false);
            }}
            onCancel={() => {
              setVisible2(false);
            }}
            onOk={() => {
              setVisible2(false);
            }}
          >
            <Stack direction="vertical" spacing="small">
              <Text as="h4">List Dialog Title</Text>
              <Text as="span" style={{ textAlign: 'center' }}>
                Habitant facilisi tincidunt pretium id et pellentesque mauris eget.{' '}
              </Text>
            </Stack>
          </Modal>
        </section>
        <section>
          <h1></h1>
          <Button type="primary" onClick={openShowcase3}>
            news
          </Button>
          <Modal
            {...args}
            {...current3Props}
            cancelText=""
            header={null}
            cancelButtonType="text"
            footerDirection="vertical"
            mobileTransform={true}
            footerBorder={false}
            isOpen={visible3}
            onClose={() => {
              setVisible3(false);
            }}
            onCancel={() => {
              setVisible3(false);
            }}
            onOk={() => {
              setVisible3(false);
            }}
          >
            <img
              src="https://assets.staticimg.com/g-biz/externals/2022-06-01/026e5a2a76e951d8.png"
              alt="404"
              style={{ height: '200px', width: '100%', margin: '24px 0', borderRadius: '12px' }}
            />
            <Text as="h4">List Dialog Title</Text>
            <Text as="span" style={{ textAlign: 'center' }}>
              Habitant facilisi tincidunt pretium id et pellentesque mauris eget.{' '}
            </Text>
          </Modal>
        </section>
        <section>
          <h1></h1>
          <Button type="primary" onClick={openShowcase4}>
            full mode
          </Button>
          <Modal
            {...args}
            {...current4Props}
            skipText={'skip'}
            mode="full"
            cancelText=""
            cancelButtonType="text"
            footerDirection="vertical"
            footerBorder={false}
            isOpen={visible4}
            onOk={() => {
              setVisible4(false);
            }}
            onCancel={() => {
              setVisible4(false);
            }}
            onClose={() => {
              setVisible4(false);
            }}
          >
            <img
              src="https://assets.staticimg.com/g-biz/externals/2022-06-01/026e5a2a76e951d8.png"
              alt="404"
              style={{
                height: '200px',
                width: '100%',
                margin: '16px 0 24px',
                borderRadius: '12px',
              }}
            />
            <Text as="h4">List Dialog Title</Text>
            <Text as="span" style={{ textAlign: 'center' }}>
              Habitant facilisi tincidunt pretium id et pellentesque mauris eget.{' '}
            </Text>
          </Modal>
        </section>
        <section>
          <h1></h1>
          <Button type="primary" onClick={openShowcase6}>
            simple mode
          </Button>
          <Modal
            {...args}
            mode="simple"
            cancelText=""
            cancelButtonType="text"
            footerDirection="vertical"
            mobileTransform={false}
            footerBorder={false}
            isOpen={visible6}
            onOk={() => {
              setVisible6(false);
            }}
            onCancel={() => {
              setVisible6(false);
            }}
            onClose={() => {
              setVisible6(false);
            }}
          ></Modal>
        </section>
      </div>
    );
  },
};

/** full 对话框示例 */
export const FullModals: Story = {
  name: 'full对话框',
  args: {
    isOpen: false,
    maskClosable: true,
    showCloseX: true,
    children: '占位内容',
  },
  render: function NestedModalsDemo() {
    const [modal1Visible, setModal1Visible] = useState(false);

    return (
      <div>
        <Button type="primary" onClick={() => setModal1Visible(true)} sync>
          full 对话框
        </Button>

        <Modal
          title="full 对话框"
          mode="full"
          isOpen={modal1Visible}
          onClose={() => setModal1Visible(false)}
        >
          <Text>full 对话框</Text>
        </Modal>
      </div>
    );
  },
};

/** simple 对话框示例 */
export const SimpleModals: Story = {
  name: 'simple对话框',
  args: {
    isOpen: false,
    maskClosable: true,
    showCloseX: true,
    children: '占位内容',
  },
  render: function NestedModalsDemo() {
    const [modal1Visible, setModal1Visible] = useState(false);

    return (
      <div>
        <Button type="primary" onClick={() => setModal1Visible(true)} sync>
          simple 对话框
        </Button>

        <Modal
          title="simple 对话框"
          mode="simple"
          isOpen={modal1Visible}
          onClose={() => setModal1Visible(false)}
        >
          <Text>simple 对话框</Text>
        </Modal>
      </div>
    );
  },
};

/** 嵌套对话框示例 */
export const NestedModals: Story = {
  name: '嵌套对话框',
  args: {
    isOpen: false,
    maskClosable: true,
    showCloseX: true,
    children: '占位内容',
  },
  render: function NestedModalsDemo() {
    const [modal1Visible, setModal1Visible] = useState(false);
    const [modal2Visible, setModal2Visible] = useState(false);
    const [modal3Visible, setModal3Visible] = useState(false);

    return (
      <div>
        <Button type="primary" onClick={() => setModal1Visible(true)} sync>
          打开嵌套对话框
        </Button>

        <Modal title="第一层对话框" isOpen={modal1Visible} onClose={() => setModal1Visible(false)}>
          <Text>这是第一层对话框</Text>
          <Button type="primary" onClick={() => setModal2Visible(true)} style={{ marginTop: 16 }}>
            打开第二层
          </Button>

          <Modal
            title="第二层对话框"
            isOpen={modal2Visible}
            onClose={() => setModal2Visible(false)}
          >
            <Text>这是第二层对话框</Text>
            <Button type="primary" onClick={() => setModal3Visible(true)} style={{ marginTop: 16 }}>
              打开第三层
            </Button>

            <Modal
              title="第三层对话框"
              isOpen={modal3Visible}
              onClose={() => setModal3Visible(false)}
            >
              <Text>这是第三层对话框</Text>
            </Modal>
          </Modal>
        </Modal>
      </div>
    );
  },
};

/** 抽屉模式示例 */
export const DrawerMode: Story = {
  name: '抽屉模式',
  args: {
    isOpen: false,
    drawTransform: true,
    drawAnchor: 'right',
    width: '30%',
    children: '占位内容',
  },
  render: function DrawerDemo(args) {
    const [visible, setVisible] = useState(false);

    return (
      <div>
        <Button type="primary" onClick={() => setVisible(true)} sync>
          打开抽屉
        </Button>
        <Modal {...args} isOpen={visible} title="抽屉模式" onClose={() => setVisible(false)}>
          <div style={{ height: '100vh', padding: 20 }}>
            <Text>这是一个抽屉式对话框</Text>
            <Popover
              trigger="hover"
              placement="top"
              content={<div style={{ padding: 10 }}>抽屉中的气泡提示</div>}
            >
              <Button type="outlined">Hover 查看气泡</Button>
            </Popover>
          </div>
        </Modal>
      </div>
    );
  },
};

/** 自定义内容示例 */
export const CustomContent: Story = {
  name: '自定义内容',
  args: {
    isOpen: false,
    width: '500px',
    children: '占位内容',
  },
  render: function CustomContentDemo(args) {
    const [visible, setVisible] = useState(false);

    return (
      <div>
        <Button type="primary" onClick={() => setVisible(true)} sync>
          自定义内容
        </Button>
        <Modal
          {...args}
          isOpen={visible}
          onClose={() => setVisible(false)}
          header={
            <div style={{ padding: '20px', display: 'flex', alignItems: 'center' }}>
              <SuccessIcon style={{ marginRight: 8 }} />
              <Text strong>自定义头部</Text>
            </div>
          }
          footer={
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
              <Button type="primary" onClick={() => setVisible(false)}>
                知道了
              </Button>
            </div>
          }
        >
          <div style={{ padding: '20px' }}>
            <Text>这是一个完全自定义的对话框</Text>
          </div>
        </Modal>
      </div>
    );
  },
};

/** 静态方法示例 */
export const StaticMethods: Story = {
  name: '静态方法',
  args: {
    isOpen: false,
    children: '占位内容',
  },
  render: function StaticMethodsDemo() {
    const showConfirm = () => {
      Modal.confirm({
        title: '信息确认',
        content: '这是一条确认提示',
        okText: '继续',
      }).then((result) => {
        alert(`确认结果: ${result}`);
      });
    };
    const showInfo = () => {
      Modal.info({
        title: '信息提示',
        content: '这是一条信息提示',
      }).then(() => {
        console.log('信息提示已关闭');
      });
    };

    return (
      <div>
        <Button type="primary" onClick={showConfirm} sync>
          显示Confirm
        </Button>
        <Button type="primary" onClick={showInfo} sync>
          显示 Info
        </Button>
      </div>
    );
  },
};

/** 异步关闭示例 */
export const AsyncClose: Story = {
  name: '异步关闭',
  args: {
    isOpen: false,
    closeSync: false,
    children: '占位内容',
  },
  render: function AsyncCloseDemo(args) {
    const [visible, setVisible] = useState(false);

    const handleOk = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          setVisible(false);
          resolve(true);
        }, 2000); // 模拟异步操作，2秒后关闭
      });
    };

    return (
      <div>
        <Button type="primary" onClick={() => setVisible(true)} sync>
          异步关闭
        </Button>
        <Modal
          {...args}
          isOpen={visible}
          title="异步关闭"
          onClose={() => setVisible(false)}
          okText={'确定'}
          onOk={handleOk}
        >
          <Text>点击确定按钮后会等待 2 秒才关闭</Text>
        </Modal>
      </div>
    );
  },
};
