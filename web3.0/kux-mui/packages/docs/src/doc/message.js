/**
 * Owner: victor.ren@kupotech.com
 */
import React from 'react';
import { useSnackbar, Button, withSnackbar } from '@kux/mui';
import Wrapper from './wrapper';

@withSnackbar()
class Message2 extends React.Component {
  render() {
    return (
      <div>
        <Button
          onClick={() => {
            this.props.message.success(
              '第八次全国森林资源清查结果，全国森林面积2.08亿公顷，森林覆盖率21.63%，森林蓄积151.37亿立方米。人工林面积0.69亿公顷，蓄积24.83亿立方米，居世界首位。',
            );
          }}
        >
          click
        </Button>
      </div>
    );
  }
}

const Message = () => {
  const { message } = useSnackbar();

  return (
    <>
      <Button
        onClick={() => {
          message.success(
            '删除成功',
            {
              autoHideDuration: 500000000,
            },
          );
        }}
      >
        success
      </Button>
      <Button
        onClick={() => {
          message.warning('sasasasasaasasas', {
            autoHideDuration: 500000000,
          });
        }}
      >
        warning
      </Button>
      <Button
        onClick={() => {
          message.error('sasasasasaasasassasasasasaasasassasasasasaasasas', {
            autoHideDuration: 500000000,
          });
        }}
      >
        error
      </Button>
      <Button
        onClick={() => {
          message.info('sasasasasaasasas');
        }}
      >
        info
      </Button>
      <Button
        onClick={() => {
          message.loading('sasasasasaasasas', {
            autoHideDuration: 500000000,
          });
        }}
      >
        loading
      </Button>
    </>
  );
};

export default () => {
  return (
    <Wrapper>
      <Message />
      <Message2 />
    </Wrapper>
  );
};
