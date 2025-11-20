/**
 * Owner: willen@kupotech.com
 */
import React from 'react';

export default class SecBase extends React.Component {
  /**
   * 获取需要的校验类型
   * @param bizType
   * @returns {Promise<void>}
   */
  getAuthType = async (bizType) => {
    const { dispatch } = this.props;
    try {
      this.setState({ authTypesLoading: true });
      const allowTypes = await dispatch({
        type: 'security_new/get_verify_type',
        payload: { bizType },
      });
      // 检测到不需要验证，或者验证类型为空的时候，直接进入下一步
      if (allowTypes && allowTypes.length === 0) {
        if (this.nextStep) {
          this.nextStep();
        } else if (this.next) {
          this.next();
        }
        return;
      }

      this.setState({
        allowTypes: allowTypes || [],
      });
    } catch (e) {
      console.error(e);
    } finally {
      this.setState({ authTypesLoading: false });
    }
  };

  componentDidMount() {
    this.getAuthType(this.props.bizType);
  }
}
